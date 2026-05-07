import { supabase, supabaseConfigured } from '../lib/supabase'
import { fallbackContent, fallbackDashboards, fallbackSubtopics } from '../data/nexagenContent'
import type { ContentItem, Dashboard, SkillLevel, Subtopic } from '../types/nexagen'

type UnlockResponse = {
  error?: string
  details?: unknown
  payment_id?: string
  invoice_id?: string
  tracking_id?: string
  message?: string
}

export const TEST_MODE = true

export type SongCacheRecord = {
  id?: string
  title: string
  artist?: string | null
  key: string
  scale: string
  progression: string[]
  genre?: string | null
  created_at?: string
}

export type ActivityAction =
  | 'dashboard_opened'
  | 'subtopic_opened'
  | 'question_completed'
  | 'piano_interaction'
  | 'song_search'
  | 'programming_level_set'
  | 'programming_question_attempted'
  | 'programming_question_completed'

export type SubscriptionPlan = 'starter' | 'pro'

export type UserSubscription = {
  id: string
  user_id: string
  plan: SubscriptionPlan
  dashboards_access: string[]
  language_access: string[]
  status: string
  amount: number
  expires_at: string
  created_at: string
}

export type UserProfile = {
  id: string
  username: string | null
  current_plan: string
  selected_dashboard: string | null
  selected_trial_language: string | null
  free_trial_used: boolean
  device_fingerprint: string | null
  created_at: string
}

export async function getActiveSubscription(userId: string): Promise<UserSubscription | null> {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .gt('expires_at', new Date().toISOString())
    .order('expires_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) return null
  return normalizeSubscription(data)
}

export async function activateTestSubscription(payload: {
  userId: string
  plan: SubscriptionPlan
  dashboardsAccess: string[]
  languageAccess?: string[]
  trial?: boolean
}): Promise<UserSubscription> {
  if (!supabaseConfigured) throw new Error('Supabase is not configured on this deployment yet.')
  const expiresAt = new Date()
  expiresAt.setMonth(expiresAt.getMonth() + 1)

  const { data, error } = await supabase
    .from('subscriptions')
    .insert({
      user_id: payload.userId,
      plan_name: payload.plan,
      dashboard_access: payload.dashboardsAccess,
      language_access: payload.languageAccess ?? (payload.plan === 'pro' ? ['all'] : ['javascript']),
      status: 'active',
      amount: payload.trial ? 0 : payload.plan === 'pro' ? 150 : 100,
      expires_at: expiresAt.toISOString(),
    })
    .select('*')
    .single()

  if (error) throw error
  await supabase.from('user_profiles').upsert(
    {
      id: payload.userId,
      current_plan: payload.trial ? `${payload.plan}_trial` : payload.plan,
      selected_dashboard: payload.dashboardsAccess[0] ?? null,
      selected_trial_language: payload.languageAccess?.[0] ?? null,
      free_trial_used: payload.trial ? true : undefined,
      device_fingerprint: payload.trial ? getDeviceFingerprint() : undefined,
    },
    { onConflict: 'id' },
  )
  return normalizeSubscription(data) as UserSubscription
}

export async function startFreeTrial(payload: {
  userId: string
  plan: SubscriptionPlan
  dashboard: string
  language: string
}): Promise<UserSubscription> {
  if (!supabaseConfigured) throw new Error('Supabase is not configured on this deployment yet.')
  const deviceFingerprint = getDeviceFingerprint()
  const existing = await supabase.from('free_trials').select('id').eq('device_fingerprint', deviceFingerprint).maybeSingle()
  if (existing.data?.id) throw new Error('This device has already used a free trial.')

  const expiresAt = new Date()
  expiresAt.setMonth(expiresAt.getMonth() + 1)
  const { error } = await supabase.from('free_trials').insert({
    device_fingerprint: deviceFingerprint,
    user_id: payload.userId,
    language: payload.language,
    dashboard: payload.dashboard,
    expires_at: expiresAt.toISOString(),
  })
  if (error) throw error

  return activateTestSubscription({
    userId: payload.userId,
    plan: payload.plan,
    dashboardsAccess: [payload.dashboard],
    languageAccess: [payload.language],
    trial: true,
  })
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase.from('user_profiles').select('*').eq('id', userId).maybeSingle()
  if (error) return null
  return data as UserProfile | null
}

export async function saveUserProfile(payload: {
  userId: string
  username?: string
  selectedDashboard?: string | null
  selectedTrialLanguage?: string | null
}): Promise<void> {
  const { error } = await supabase.from('user_profiles').upsert(
    {
      id: payload.userId,
      username: payload.username?.trim() || null,
      selected_dashboard: payload.selectedDashboard ?? undefined,
      selected_trial_language: payload.selectedTrialLanguage ?? undefined,
    },
    { onConflict: 'id' },
  )
  if (error) throw error
}

export async function subscribeNewsletter(email: string): Promise<void> {
  const normalizedEmail = email.trim().toLowerCase()
  if (!normalizedEmail) throw new Error('Enter your email first.')
  if (!supabaseConfigured) throw new Error('Supabase is not configured on this deployment yet.')

  const { error } = await supabase.from('newsletter_subscribers').upsert(
    { email: normalizedEmail },
    { onConflict: 'email' },
  )
  if (error) throw error
}

export async function submitRating(payload: {
  userId?: string
  rating: number
  feedback?: string
}): Promise<void> {
  if (!supabaseConfigured) throw new Error('Supabase is not configured on this deployment yet.')
  const { error } = await supabase.from('ratings').insert({
    user_id: payload.userId ?? null,
    rating: payload.rating,
    feedback: payload.feedback?.trim() || null,
  })
  if (error) throw error
}

export async function getProgrammingLevel(userId: string): Promise<SkillLevel | null> {
  const local = localStorage.getItem('nexagen:programming-level') as SkillLevel | null
  const { data, error } = await supabase.from('user_programming_level').select('level').eq('user_id', userId).maybeSingle()
  if (error) return local
  return data?.level ?? local
}

export async function setProgrammingLevel(userId: string | undefined, level: SkillLevel): Promise<void> {
  localStorage.setItem('nexagen:programming-level', level)
  if (!userId) return
  await supabase.from('user_programming_level').upsert(
    {
      user_id: userId,
      level,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' },
  )
}

export async function saveProgrammingProgress(payload: {
  userId?: string
  questionId: string
  completed: boolean
  timeTaken: number
}): Promise<void> {
  const row = {
    question_id: payload.questionId,
    completed: payload.completed,
    time_taken: payload.timeTaken,
    created_at: new Date().toISOString(),
  }
  const localRows = JSON.parse(localStorage.getItem('nexagen:programming-progress') ?? '[]') as Array<typeof row>
  localStorage.setItem('nexagen:programming-progress', JSON.stringify([row, ...localRows].slice(0, 250)))
  if (!payload.userId) return
  await supabase.from('user_programming_progress').insert({
    user_id: payload.userId,
    question_id: payload.questionId,
    completed: payload.completed,
    time_taken: payload.timeTaken,
  })
}

export async function getDashboards(): Promise<Dashboard[]> {
  const { data, error } = await supabase
    .from('dashboards')
    .select('*')
    .order('created_at', { ascending: true })

  if (error || !data?.length) return fallbackDashboards
  return data
}

export async function getContentItems(): Promise<ContentItem[]> {
  const { data, error } = await supabase
    .from('content_items')
    .select('*')
    .order('created_at', { ascending: true })

  if (error || !data?.length) return fallbackContent
  return data
}

export async function getSubtopics(): Promise<Subtopic[]> {
  const { data, error } = await supabase
    .from('subtopics')
    .select('*')
    .order('created_at', { ascending: true })

  if (error || !data?.length) return fallbackSubtopics
  return data
}

export async function getUserUnlocks(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('user_unlocks')
    .select('dashboard_id')
    .eq('user_id', userId)

  if (error) return []
  return data.map((row) => row.dashboard_id)
}

export async function getUserSubtopicUnlocks(userId: string): Promise<string[]> {
  if (TEST_MODE) return fallbackSubtopics.map((subtopic) => subtopic.id)

  const { data, error } = await supabase
    .from('user_subtopic_unlocks')
    .select('subtopic_id')
    .eq('user_id', userId)

  if (error) return []
  return data.map((row) => row.subtopic_id)
}

export async function unlockSubtopicForTest(userId: string | undefined, subtopicId: string): Promise<string> {
  if (TEST_MODE) return subtopicId
  if (!userId) throw new Error('Sign in before unlocking subtopics.')

  const { error } = await supabase.from('user_subtopic_unlocks').upsert(
    {
      user_id: userId,
      subtopic_id: subtopicId,
    },
    { onConflict: 'user_id,subtopic_id' },
  )
  if (error) throw error
  return subtopicId
}

export async function getUserLevel(userId: string): Promise<SkillLevel | null> {
  const { data, error } = await supabase.from('user_levels').select('level').eq('user_id', userId).maybeSingle()
  if (error) return null
  return data?.level ?? null
}

export async function setUserLevel(userId: string | undefined, level: SkillLevel): Promise<void> {
  localStorage.setItem('nexagen:piano-level', level)
  if (!userId) return

  await supabase.from('user_levels').upsert(
    {
      user_id: userId,
      level,
    },
    { onConflict: 'user_id' },
  )
}

export async function getCompletedContent(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('progress')
    .select('content_id')
    .eq('user_id', userId)
    .eq('completed', true)

  if (error) return []
  return data.map((row) => row.content_id)
}

export async function setContentCompleted(userId: string, contentId: string, completed: boolean) {
  return supabase.from('progress').upsert(
    {
      user_id: userId,
      content_id: contentId,
      completed,
    },
    { onConflict: 'user_id,content_id' },
  )
}

export async function findSongCache(title: string, artist?: string): Promise<SongCacheRecord | null> {
  let query = supabase.from('song_cache').select('*').ilike('title', title.trim())
  if (artist?.trim()) query = query.ilike('artist', artist.trim())

  const { data, error } = await query.maybeSingle()
  if (error) return null
  return data as SongCacheRecord | null
}

export async function saveSongCache(song: SongCacheRecord): Promise<void> {
  await supabase.from('song_cache').insert({
    title: song.title,
    artist: song.artist,
    key: song.key,
    scale: song.scale,
    progression: song.progression,
    genre: song.genre,
  })
}

export async function trackUserActivity(payload: {
  userId?: string
  action: ActivityAction
  dashboardId?: string | null
  subtopicId?: string | null
}): Promise<void> {
  const activity = {
    action: payload.action,
    dashboard_id: payload.dashboardId ?? null,
    subtopic_id: payload.subtopicId ?? null,
    created_at: new Date().toISOString(),
  }

  const localRows = JSON.parse(localStorage.getItem('nexagen:activity') ?? '[]') as Array<typeof activity>
  localStorage.setItem('nexagen:activity', JSON.stringify([activity, ...localRows].slice(0, 250)))

  if (!payload.userId) return
  await supabase.from('user_activity').insert({
    user_id: payload.userId,
    action: payload.action,
    dashboard_id: payload.dashboardId ?? null,
    subtopic_id: payload.subtopicId ?? null,
  })
}

export async function createPayment(payload: {
  user_id: string
  plan_name: SubscriptionPlan
  selected_dashboard?: string
  phone_number: string
}): Promise<UnlockResponse> {
  const { data, error } = await supabase.functions.invoke<UnlockResponse>('create-payment', {
    body: payload,
  })

  if (error) {
    const response = 'context' in error ? error.context : null
    if (response instanceof Response) {
      const body = (await response.json().catch(() => null)) as UnlockResponse | null
      if (body?.error) throw new Error(withDetails(body.error, body.details))
    }

    const message = error.message.toLowerCase().includes('failed to send')
      ? 'The create-payment Edge Function is not reachable. Deploy it to Supabase and set the function secrets first.'
      : error.message
    throw new Error(message)
  }
  if (data?.error) {
    throw new Error(withDetails(data.error, data.details))
  }
  return data ?? { message: 'Payment initiated' }
}

function normalizeSubscription(row: Record<string, unknown> | null): UserSubscription | null {
  if (!row) return null
  return {
    id: String(row.id),
    user_id: String(row.user_id),
    plan: (row.plan_name ?? row.plan ?? 'starter') as SubscriptionPlan,
    dashboards_access: (row.dashboard_access ?? row.dashboards_access ?? []) as string[],
    language_access: (row.language_access ?? []) as string[],
    status: String(row.status ?? 'active'),
    amount: Number(row.amount ?? 0),
    expires_at: String(row.expires_at),
    created_at: String(row.created_at),
  }
}

function getDeviceFingerprint() {
  const key = 'nexagen:device-fingerprint'
  const existing = localStorage.getItem(key)
  if (existing) return existing
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    crypto.randomUUID(),
  ].join('|')
  localStorage.setItem(key, fingerprint)
  return fingerprint
}

function withDetails(error: string, details: unknown) {
  if (!details) return error
  if (typeof details === 'string') return `${error}: ${details}`

  try {
    return `${error}: ${JSON.stringify(details)}`
  } catch {
    return error
  }
}
