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
  const intasendPublicKey = Deno.env.get('INTASEND_PUBLIC_KEY') ?? Deno.env.get('INTASEND_PUBLISHABLE_KEY')
  const liveMode = (Deno.env.get('INTASEND_ENV') ?? 'LIVE').toUpperCase() === 'LIVE'

  if (!supabaseUrl || !serviceRoleKey || !intasendSecretKey || !intasendPublicKey) {
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

  const { data: dashboard, error: dashboardError } = await supabase
    .from('dashboards')
    .select('id,title,price,is_locked')
    .eq('id', body.dashboard_id)
    .single()

  if (dashboardError || !dashboard) return json({ error: 'Dashboard not found' }, 404)
  if (!dashboard.is_locked || dashboard.price <= 0) return json({ error: 'Dashboard is already free' }, 400)

  const apiRef = `${body.user_id}:${body.dashboard_id}:${crypto.randomUUID()}`
  const response = await fetch('https://api.intasend.com/api/v1/payment/mpesa-stk-push/', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${intasendSecretKey}`,
      'Content-Type': 'application/json',
      'X-IntaSend-Public-API-Key': intasendPublicKey,
    },
    body: JSON.stringify({
      amount: dashboard.price,
      api_ref: apiRef,
      currency: 'KES',
      email: authData.user.email ?? 'customer@nexagen.local',
      first_name: 'NexaGen',
      host: request.headers.get('origin') ?? 'https://nexagen.local',
      live: liveMode,
      method: 'MPESA_STK_PUSH',
      narrative: `NexaGen ${dashboard.title}`,
      phone_number: body.phone_number,
    }),
  })

  const paymentData = await response.json().catch(() => ({}))
  if (!response.ok) return json({ error: 'IntaSend rejected the payment request', details: paymentData }, response.status)

  await supabase.from('payments').insert({
    user_id: body.user_id,
    dashboard_id: body.dashboard_id,
    amount: dashboard.price,
    status: 'PENDING',
    transaction_id: paymentData.invoice_id ?? paymentData.id ?? apiRef,
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

