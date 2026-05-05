import type { User } from '@supabase/supabase-js'

export type ContentType = 'qna' | 'pdf'
export type SkillLevel = 'beginner' | 'intermediate' | 'pro'

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
  subtopic_id?: string | null
  title: string | null
  body: string | null
  answer?: string | null
  explanation?: string | null
  category?: 'theory' | 'practical'
  type: ContentType
  is_locked: boolean
  created_at?: string
}

export type Subtopic = {
  id: string
  dashboard_id: string
  title: string
  description: string | null
  price: number
  is_locked: boolean
  pdf_path?: string | null
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
