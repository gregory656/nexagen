import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

type PaymentRequest = {
  user_id?: string
  dashboard_id?: string
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
  if (!body.user_id || !body.dashboard_id || !body.phone_number) {
    return json({ error: 'user_id, dashboard_id, and phone_number are required' }, 400)
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

  const dashboardLookup = getDashboardLookup(body.dashboard_id)
  const dashboardQuery = supabase.from('dashboards').select('id,title,price,is_locked')
  const { data: dashboard, error: dashboardError } = dashboardLookup.kind === 'uuid'
    ? await dashboardQuery.eq('id', dashboardLookup.value).single()
    : await dashboardQuery.eq('title', dashboardLookup.value).single()

  if (dashboardError || !dashboard) return json({ error: 'Dashboard not found' }, 404)
  if (!dashboard.is_locked || dashboard.price <= 0) return json({ error: 'Dashboard is already free' }, 400)

  const apiRef = `nexagen-${crypto.randomUUID()}`
  const paymentPayload = {
    amount: String(dashboard.price),
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

  await supabase.from('payments').insert({
    user_id: body.user_id,
    dashboard_id: dashboard.id,
    amount: dashboard.price,
    status: 'PENDING',
    transaction_id: apiRef,
  })

  return json({
    message: 'STK Push sent. Unlock will complete after payment confirmation.',
    api_ref: apiRef,
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

function getDashboardLookup(dashboardId: string) {
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  if (uuidPattern.test(dashboardId)) return { kind: 'uuid' as const, value: dashboardId }

  const fallbackTitles: Record<string, string> = {
    'music-theory': 'Music Theory',
    'piano-12-keys': 'Piano (12 Keys)',
    'find-my-key-pitch': 'Find My Key & Pitch',
    programming: 'Programming',
    'operating-systems': 'Operating Systems',
    'installing-troubleshooting': 'Installing & Troubleshooting',
    'computer-basics': 'Computer Basics',
    'powershell-commands': 'PowerShell Commands',
  }

  return { kind: 'title' as const, value: fallbackTitles[dashboardId] ?? dashboardId }
}
