import { supabase } from '../lib/supabase'
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
