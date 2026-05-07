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
  expires_at: string
  created_at: string
}

export async function getActiveSubscription(userId: string): Promise<UserSubscription | null> {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .gt('expires_at', new Date().toISOString())
    .order('expires_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) return null
  return data as UserSubscription | null
}

export async function activateTestSubscription(payload: {
  userId: string
  plan: SubscriptionPlan
  dashboardsAccess: string[]
}): Promise<UserSubscription> {
  if (!supabaseConfigured) throw new Error('Supabase is not configured on this deployment yet.')
  const expiresAt = new Date()
  expiresAt.setMonth(expiresAt.getMonth() + 1)

  const { data, error } = await supabase
    .from('subscriptions')
    .insert({
      user_id: payload.userId,
      plan: payload.plan,
      dashboards_access: payload.dashboardsAccess,
      expires_at: expiresAt.toISOString(),
    })
    .select('*')
    .single()

  if (error) throw error
  return data as UserSubscription
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
  dashboard_id: string
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

function withDetails(error: string, details: unknown) {
  if (!details) return error
  if (typeof details === 'string') return `${error}: ${details}`

  try {
    return `${error}: ${JSON.stringify(details)}`
  } catch {
    return error
  }
}
