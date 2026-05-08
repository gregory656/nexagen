import { supabase } from '../lib/supabase'
import type { SkillLevel } from '../types/nexagen'

export type AssistantContext = {
  dashboard?: string
  subtopic?: string
  level?: SkillLevel | null
  mode: 'piano' | 'programming' | 'general'
}

export type AssistantIntent =
  | 'Explain this simply'
  | 'Give me a harder question'
  | 'Give me a hint'
  | 'Test me again'
  | 'Summarize this topic'

export type RevisionCard = {
  prompt: string
  type: 'revision' | 'challenge'
  nextReview: string
}

const badgeCatalog = [
  { name: 'Fast Thinker', description: 'Completed timed practice with momentum.' },
  { name: 'Consistent Learner', description: 'Returned for practice and review.' },
  { name: 'Piano Starter', description: 'Completed a piano learning action.' },
  { name: 'Code Warrior', description: 'Completed a programming challenge.' },
]

export async function askLearningAssistant(intent: AssistantIntent, context: AssistantContext, userInput = '') {
  const prompt = [
    `You are NexaGen's learning assistant.`,
    `Mode: ${context.mode}.`,
    `Dashboard: ${context.dashboard ?? 'none'}.`,
    `Subtopic: ${context.subtopic ?? 'none'}.`,
    `User level: ${context.level ?? 'unknown'}.`,
    `Intent: ${intent}.`,
    userInput ? `User note: ${userInput}.` : '',
    'Keep the answer short, practical, and encouraging.',
  ].filter(Boolean).join('\n')

  try {
    const { data, error } = await supabase.functions.invoke<{ reply?: string; error?: string }>('chat-assistant', {
      body: {
        messages: [{ role: 'user', content: prompt }],
      },
    })
    if (error || data?.error) return fallbackAssistantAnswer(intent, context)
    return data?.reply ?? fallbackAssistantAnswer(intent, context)
  } catch {
    return fallbackAssistantAnswer(intent, context)
  }
}

export async function awardXp(userId: string | undefined, amount: number, reason: string) {
  const current = getLocalXp()
  const nextXp = current.xp + amount
  const nextLevel = Math.max(1, Math.floor(nextXp / 120) + 1)
  localStorage.setItem('nexagen:xp', JSON.stringify({ xp: nextXp, level: nextLevel, reason }))

  if (!userId) return { xp: nextXp, level: nextLevel }
  const { data } = await supabase.from('user_xp').select('xp, level').eq('user_id', userId).maybeSingle()
  const dbXp = (data?.xp ?? current.xp) + amount
  const dbLevel = Math.max(1, Math.floor(dbXp / 120) + 1)
  await supabase.from('user_xp').upsert({ user_id: userId, xp: dbXp, level: dbLevel }, { onConflict: 'user_id' })
  return { xp: dbXp, level: dbLevel }
}

export function getLocalXp() {
  return JSON.parse(localStorage.getItem('nexagen:xp') ?? '{"xp":0,"level":1}') as { xp: number; level: number; reason?: string }
}

export async function grantBadge(userId: string | undefined, name: string) {
  const badges = JSON.parse(localStorage.getItem('nexagen:badges') ?? '[]') as string[]
  if (!badges.includes(name)) localStorage.setItem('nexagen:badges', JSON.stringify([...badges, name]))
  if (!userId) return

  const badge = badgeCatalog.find((item) => item.name === name)
  if (!badge) return
  const { data } = await supabase.from('badges').select('id').eq('name', badge.name).maybeSingle()
  const badgeId = data?.id
  if (badgeId) await supabase.from('user_badges').insert({ user_id: userId, badge_id: badgeId })
}

export async function scheduleRevisionLoop(userId: string | undefined, questionId: string, topic: string): Promise<RevisionCard[]> {
  const offsets = [
    { label: '1 hour', ms: 60 * 60 * 1000, interval: 1 },
    { label: '1 day', ms: 24 * 60 * 60 * 1000, interval: 2 },
    { label: '3 days', ms: 3 * 24 * 60 * 60 * 1000, interval: 3 },
  ]
  const cards: RevisionCard[] = [
    { prompt: `Explain ${topic} in your own words.`, type: 'revision', nextReview: offsets[0].label },
    { prompt: `Solve one small ${topic} example without looking.`, type: 'revision', nextReview: offsets[1].label },
    { prompt: `Compare today's ${topic} idea with a related skill.`, type: 'revision', nextReview: offsets[2].label },
    { prompt: `Challenge: teach ${topic} to a beginner in 90 seconds.`, type: 'challenge', nextReview: offsets[2].label },
  ]

  const local = JSON.parse(localStorage.getItem('nexagen:revisions') ?? '[]') as RevisionCard[]
  localStorage.setItem('nexagen:revisions', JSON.stringify([...cards, ...local].slice(0, 80)))

  if (userId) {
    await Promise.all(offsets.map((offset) =>
      supabase.from('revisions').insert({
        user_id: userId,
        question_id: questionId,
        next_review: new Date(Date.now() + offset.ms).toISOString(),
        interval: offset.interval,
      }),
    ))
  }
  return cards
}

function fallbackAssistantAnswer(intent: AssistantIntent, context: AssistantContext) {
  const subject = context.subtopic || context.dashboard || 'this topic'
  if (context.mode === 'piano') {
    if (intent.includes('hint')) return `Listen for the home note first. For ${subject}, play slowly and notice which notes feel stable.`
    if (intent.includes('harder')) return `Harder task: play ${subject} in another key, then name every chord before you press it.`
    if (intent.includes('Test')) return `Quick test: what is the first note, the strongest chord, and the note that creates tension in ${subject}?`
    return `${subject} is a sound-shape. First see it on the keyboard, then hear it, then name it. That loop makes music stick.`
  }
  if (context.mode === 'programming') {
    if (intent.includes('hint')) return `Break ${subject} into input, state, loop/branch, and return value. Solve one tiny case first.`
    if (intent.includes('harder')) return `Harder task: solve ${subject}, then state the time complexity and one edge case.`
    if (intent.includes('Test')) return `Quick test: write the function signature, list edge cases, and explain your algorithm in three sentences.`
    return `${subject} becomes manageable when you define the input, track state clearly, and return one predictable output.`
  }
  return `${subject} matters because it connects practice to progress. Start with one example, then test yourself without notes.`
}
