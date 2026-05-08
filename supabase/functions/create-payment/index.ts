import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

type PaymentRequest = {
  user_id?: string
  plan_name?: 'starter' | 'pro'
  selected_dashboard?: string
  phone_number?: string
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const intasendSecretKey = Deno.env.get('INTASEND_SECRET_KEY')

  if (!supabaseUrl || !serviceRoleKey || !intasendSecretKey) {
    return json({ error: 'Server payment environment is not configured' }, 500)
  }

  const body = (await request.json().catch(() => ({}))) as PaymentRequest
  if (!body.user_id || !body.plan_name || !body.phone_number) {
    return json({ error: 'user_id, plan_name, and phone_number are required' }, 400)
  }

  if (!/^2547\d{8}$/.test(body.phone_number)) {
    return json({ error: 'Use phone format 2547XXXXXXXX' }, 400)
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey)
  const authHeader = request.headers.get('Authorization') ?? ''
  const jwt = authHeader.replace('Bearer ', '')
  const { data: authData, error: authError } = await supabase.auth.getUser(jwt)

  if (authError || authData.user?.id !== body.user_id) {
    return json({ error: 'Unauthorized payment request' }, 401)
  }

  const amount = body.plan_name === 'pro' ? 150 : 100
  const dashboardAccess = body.plan_name === 'pro' ? ['all'] : [body.selected_dashboard ?? 'piano-12-keys']
  const languageAccess = body.plan_name === 'pro' ? ['all'] : ['python', 'javascript', 'typescript', 'java', 'c', 'cpp', 'csharp', 'go', 'rust', 'dart']

  const apiRef = `nexagen-${crypto.randomUUID()}`
  const paymentPayload = {
    amount: String(amount),
    api_ref: apiRef,
    phone_number: body.phone_number,
  }

  console.log('IntaSend STK request', {
    amount: paymentPayload.amount,
    api_ref: paymentPayload.api_ref,
    phone_prefix: paymentPayload.phone_number.slice(0, 4),
  })

  const response = await fetch('https://api.intasend.com/api/v1/payment/mpesa-stk-push/', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${intasendSecretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(paymentPayload),
  })

  const responseText = await response.text()
  console.log('IntaSend STK response', {
    body: responseText,
    status: response.status,
  })

  let paymentData: Record<string, unknown> = {}
  try {
    paymentData = JSON.parse(responseText)
  } catch {
    paymentData = { raw: responseText }
  }

  if (!response.ok) {
    return json(
      {
        error: `IntaSend returned ${response.status}`,
        details: paymentData,
      },
      response.status,
    )
  }

  await supabase.from('payment_logs').insert({
    user_id: body.user_id,
    plan_name: body.plan_name,
    amount,
    status: 'pending',
    transaction_id: apiRef,
  })

  await supabase.from('user_profiles').upsert(
    {
      id: body.user_id,
      current_plan: 'pending',
      selected_dashboard: dashboardAccess[0],
    },
    { onConflict: 'id' },
  )

  return json({
    message: 'STK Push sent. Unlock will complete after payment verification.',
    api_ref: apiRef,
    dashboard_access: dashboardAccess,
    language_access: languageAccess,
    invoice_id: paymentData.invoice_id,
    tracking_id: paymentData.tracking_id,
  })
})

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status,
  })
}
