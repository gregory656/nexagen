import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-intasend-signature',
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const challenge = Deno.env.get('INTASEND_WEBHOOK_CHALLENGE')

  if (!supabaseUrl || !serviceRoleKey) return json({ error: 'Webhook environment is not configured' }, 500)

  const rawBody = await request.text()
  if (challenge) {
    const signature = request.headers.get('x-intasend-signature') ?? request.headers.get('x-webhook-signature')
    const valid = await verifyHmac(rawBody, challenge, signature)
    if (!valid) return json({ error: 'Invalid webhook signature' }, 401)
  }

  const event = JSON.parse(rawBody)
  const status = String(event.state ?? event.status ?? event.invoice?.state ?? '').toUpperCase()
  const apiRef = String(event.api_ref ?? event.invoice?.api_ref ?? event.data?.api_ref ?? '')
  const transactionId = String(event.invoice_id ?? event.tracking_id ?? event.id ?? event.data?.id ?? apiRef)
  const amount = Number(event.value ?? event.amount ?? event.invoice?.value ?? 0)

  if (!['COMPLETE', 'COMPLETED', 'SUCCESS', 'PAID'].includes(status)) {
    return json({ received: true, ignored: status || 'UNKNOWN' })
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey)
  const paymentLookup = await supabase
    .from('payment_logs')
    .select('user_id,plan_name,amount,status')
    .eq('transaction_id', apiRef)
    .single()

  if (paymentLookup.error || !paymentLookup.data) return json({ error: 'Webhook missing payment metadata' }, 400)

  const resolvedUserId = paymentLookup.data.user_id
  const planName = paymentLookup.data.plan_name === 'pro' ? 'pro' : 'starter'
  const profileLookup = await supabase.from('user_profiles').select('selected_dashboard').eq('id', resolvedUserId).maybeSingle()
  const dashboardAccess = planName === 'pro' ? ['all'] : [profileLookup.data?.selected_dashboard ?? 'piano-12-keys']
  const languageAccess = planName === 'pro' ? ['all'] : ['javascript']
  const expiresAt = new Date()
  expiresAt.setMonth(expiresAt.getMonth() + 1)

  await supabase.from('payment_logs').upsert(
    {
      user_id: resolvedUserId,
      plan_name: planName,
      amount,
      status: 'complete',
      transaction_id: apiRef || transactionId,
    },
    { onConflict: 'transaction_id' },
  )

  await supabase.from('subscriptions').insert(
    {
      user_id: resolvedUserId,
      plan_name: planName,
      dashboard_access: dashboardAccess,
      language_access: languageAccess,
      status: 'active',
      amount,
      expires_at: expiresAt.toISOString(),
    },
  )

  await supabase.from('user_profiles').upsert(
    {
      id: resolvedUserId,
      current_plan: planName,
      selected_dashboard: dashboardAccess[0],
    },
    { onConflict: 'id' },
  )

  return json({ received: true, unlocked: true, plan: planName })
})

async function verifyHmac(rawBody: string, challenge: string, signature: string | null) {
  if (!signature) return false

  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', encoder.encode(challenge), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const digest = await crypto.subtle.sign('HMAC', key, encoder.encode(rawBody))
  const hex = Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')

  return timingSafeEqual(signature.replace(/^sha256=/, ''), hex)
}

function timingSafeEqual(left: string, right: string) {
  if (left.length !== right.length) return false
  let result = 0
  for (let index = 0; index < left.length; index += 1) {
    result |= left.charCodeAt(index) ^ right.charCodeAt(index)
  }
  return result === 0
}

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status,
  })
}
