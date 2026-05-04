import { supabase } from '../lib/supabase'
import { fallbackContent, fallbackDashboards } from '../data/nexagenContent'
import type { ContentItem, Dashboard } from '../types/nexagen'

type UnlockResponse = {
  payment_id?: string
  invoice_id?: string
  tracking_id?: string
  message?: string
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

export async function getUserUnlocks(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('user_unlocks')
    .select('dashboard_id')
    .eq('user_id', userId)

  if (error) return []
  return data.map((row) => row.dashboard_id)
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

  if (error) throw new Error(error.message)
  return data ?? { message: 'Payment initiated' }
}
