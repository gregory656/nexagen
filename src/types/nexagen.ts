import type { User } from '@supabase/supabase-js'

export type ContentType = 'qna' | 'pdf'

export type Dashboard = {
  id: string
  title: string
  description: string | null
  is_locked: boolean
  price: number
  created_at?: string
}

export type ContentItem = {
  id: string
  dashboard_id: string
  title: string | null
  body: string | null
  type: ContentType
  is_locked: boolean
  created_at?: string
}

export type ProgressRow = {
  id: string
  user_id: string
  content_id: string
  completed: boolean
}

export type AuthMode = 'guest' | 'authenticated'

export type AppUser = {
  mode: AuthMode
  user: User | null
}

export type PaymentState = 'idle' | 'pending' | 'success' | 'failed'
