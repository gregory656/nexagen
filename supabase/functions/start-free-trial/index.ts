import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

type TrialRequest = {
  user_id?: string
  plan?: string
  dashboard?: string
  language?: string
  device_fingerprint?: string
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
  if (!supabaseUrl || !serviceRoleKey) return json({ error: 'Trial environment is not configured' }, 500)

  const body = (await request.json().catch(() => ({}))) as TrialRequest
  if (!body.user_id || !body.dashboard || !body.language || !body.device_fingerprint) {
    return json({ error: 'user_id, dashboard, language, and device_fingerprint are required' }, 400)
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey)
  const authHeader = request.headers.get('Authorization') ?? ''
  const jwt = authHeader.replace('Bearer ', '')
  const { data: authData, error: authError } = await supabase.auth.getUser(jwt)
  if (authError || authData.user?.id !== body.user_id) {
    return json({ error: 'Unauthorized trial request' }, 401)
  }

  const existingDevice = await supabase
    .from('free_trials')
    .select('id')
    .eq('device_fingerprint', body.device_fingerprint)
    .maybeSingle()
  const existingUser = await supabase
    .from('free_trials')
    .select('id')
    .eq('user_id', body.user_id)
    .maybeSingle()

  if (existingDevice.data?.id || existingUser.data?.id) return json({ error: 'This account or device has already used a free trial.' }, 409)

  const expiresAt = new Date()
  expiresAt.setMonth(expiresAt.getMonth() + 1)
  const trialDashboard = 'programming'
  const trialLanguage = body.language || 'JavaScript'

  const trialInsert = await supabase.from('free_trials').insert({
    device_fingerprint: body.device_fingerprint,
    user_id: body.user_id,
    language: trialLanguage,
    dashboard: trialDashboard,
    expires_at: expiresAt.toISOString(),
  })
  if (trialInsert.error) return json({ error: trialInsert.error.message }, 400)

  const subscriptionInsert = await supabase
    .from('subscriptions')
    .insert({
      user_id: body.user_id,
      plan_name: 'free_trial',
      plan: 'free_trial',
      dashboard_access: [trialDashboard],
      language_access: [trialLanguage],
      status: 'active',
      active: true,
      is_trial: true,
      all_access: false,
      amount: 0,
      expires_at: expiresAt.toISOString(),
    })
    .select('*')
    .single()

  if (subscriptionInsert.error) return json({ error: subscriptionInsert.error.message }, 400)

  await supabase.from('user_profiles').upsert(
    {
      id: body.user_id,
      current_plan: 'free_trial',
      selected_dashboard: trialDashboard,
      selected_trial_language: trialLanguage,
      free_trial_used: true,
      device_fingerprint: body.device_fingerprint,
    },
    { onConflict: 'id' },
  )

  return json({ subscription: subscriptionInsert.data })
})

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status,
  })
}
