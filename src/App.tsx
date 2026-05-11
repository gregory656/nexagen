import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion'
import {
  ArrowLeft,
  ArrowUp,
  BarChart3,
  BadgeCheck,
  BookOpen,
  BusFront,
  CheckCircle2,
  ChevronDown,
  Code2,
  Compass,
  Copy,
  Coffee,
  CreditCard,
  Crown,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  Flame,
  Headphones,
  HeartHandshake,
  Laptop,
  LockKeyhole,
  LogOut,
  Mail,
  Medal,
  Menu,
  MessageCircle,
  Music2,
  Pause,
  Play,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Terminal,
  Trophy,
  UnlockKeyhole,
  Volume2,
  X,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { Suspense, createContext, lazy, useContext, useEffect, useMemo, useRef, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import * as Tone from 'tone'
import { findCuratedSong, songProgressions, type SongProgression } from './data/songProgressions'
import {
  codeForLanguage,
  programmingLanguages,
  programmingQuestions,
  programmingSubtopics,
  timerByLevel,
  type ProgrammingLanguage,
  type ProgrammingQuestion,
  type ProgrammingSubtopic,
} from './data/programmingContent'
import { useDebouncedValue } from './hooks/useDebouncedValue'
import { supabase, supabaseConfigured } from './lib/supabase'
import { sendContactEmail } from './services/emailService'
import { executeJudge0, judge0Configured, type Judge0Result } from './services/judge0Service'
import {
  askLearningAssistant,
  awardXp,
  getLocalXp,
  grantBadge,
  scheduleRevisionLoop,
  type AssistantIntent,
  type RevisionCard,
} from './services/learningService'
import {
  findSongCache,
  getCompletedContent,
  getContentItems,
  getDashboards,
  getSubtopics,
  getUserLevel,
  getUserSubtopicUnlocks,
  getUserUnlocks,
  getProgrammingLevel,
  saveProgrammingProgress,
  saveSongCache,
  setProgrammingLevel,
  setContentCompleted,
  setUserLevel,
  TEST_MODE,
  activateTestSubscription,
  createPayment,
  getActiveSubscription,
  getUserProfile,
  trackUserActivity,
  saveUserProfile,
  startFreeTrial,
  unlockSubtopicForTest,
  subscribeNewsletter,
  submitRating,
  type SubscriptionPlan,
  type UserSubscription,
} from './services/nexagenService'
import type { AppUser, ContentItem, Dashboard, SkillLevel, Subtopic } from './types/nexagen'

const Editor = lazy(() => import('@monaco-editor/react'))

const imageSizes = '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'

const languageLogoUrls: Record<string, string> = {
  python: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
  javascript: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
  typescript: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
  java: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
  c: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg',
  cpp: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg',
  csharp: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg',
  go: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg',
  rust: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-original.svg',
  dart: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg',
  kotlin: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg',
  swift: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg',
  php: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg',
  ruby: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg',
  sql: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
  bash: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg',
  powershell: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/powershell/powershell-original.svg',
  r: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/r/r-original.svg',
  matlab: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/matlab/matlab-original.svg',
  scala: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scala/scala-original.svg',
}

const partnerLogoUrls: Record<string, string> = {
  Zeraki: '/zeraki.jpeg',
  W3Schools: '/w3schools.jpeg',
  IntaSend: 'https://logo.clearbit.com/intasend.com',
  NCI: 'https://logo.clearbit.com/nci.ac.ke',
  'TopHeights Electricals': 'https://logo.clearbit.com/topheightselectricals.com',
}

const visuals = [
  'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80',
]

const interests = ['Music', 'Programming', 'Operating Systems', 'PowerShell', 'Computer Basics']
const defaultPdfPath = '/javacript.pdf'

function LanguageLogo({ language }: { language: ProgrammingLanguage }) {
  const [failed, setFailed] = useState(false)
  const src = languageLogoUrls[language.id]
  if (!src || failed) return <Code2 className="size-5" />
  return <img alt={`${language.name} logo`} className="size-7 object-contain" decoding="async" loading="lazy" onError={() => setFailed(true)} src={src} />
}

function PartnerLogo({ name }: { name: string }) {
  const [failed, setFailed] = useState(false)
  const src = partnerLogoUrls[name]
  if (!src || failed) return <BadgeCheck className="size-5" />
  return <img alt={`${name} logo`} className="size-7 object-contain" decoding="async" loading="lazy" onError={() => setFailed(true)} src={src} />
}

const availableDashboardSlugs = ['piano-12-keys', 'programming']

const dashboardAccessKey = (dashboard: Dashboard) => {
  const slug = slugForDashboard(dashboard.title)
  return slug.includes('programming') ? 'programming' : slug.includes('piano') ? 'piano-12-keys' : slug
}

const dashboardIsSubscriptionUnlocked = (dashboard: Dashboard, subscription: UserSubscription | null) => {
  if (!subscription) return false
  if (new Date(subscription.expires_at).getTime() <= Date.now()) return false
  const isTrial = subscription.is_trial || subscription.plan === 'free_trial'
  if (!isTrial && (subscription.all_access || subscription.plan === 'pro' || subscription.dashboards_access.includes('all'))) return availableDashboardSlugs.includes(dashboardAccessKey(dashboard))
  return subscription.dashboards_access.includes(dashboardAccessKey(dashboard))
}

const buildEffectiveUnlocks = (dashboards: Dashboard[], unlocks: string[], subscription: UserSubscription | null) =>
  Array.from(new Set([...unlocks, ...dashboards.filter((dashboard) => dashboardIsSubscriptionUnlocked(dashboard, subscription)).map((dashboard) => dashboard.id)]))

const starterLanguageIds = programmingLanguages.slice(0, 10).map((item) => item.id)

const normalizeLanguageAccess = (access: string[]) => {
  const byName = new Map(programmingLanguages.map((item) => [item.name.toLowerCase(), item.id]))
  const byId = new Set(programmingLanguages.map((item) => item.id))
  return access.map((item) => {
    const normalized = item.toLowerCase()
    return byId.has(normalized) ? normalized : byName.get(normalized) ?? normalized
  })
}

const languageLimitForSubscription = (subscription: UserSubscription | null) => {
  if (!subscription || new Date(subscription.expires_at).getTime() <= Date.now()) return 0
  if (subscription.is_trial || subscription.plan === 'free_trial') return 1
  if (subscription.all_access || subscription.plan === 'pro') return programmingLanguages.length
  return subscription.plan === 'starter' ? 10 : programmingLanguages.length
}

const selectedLanguageIdsForSubscription = (subscription: UserSubscription | null) => {
  const limit = languageLimitForSubscription(subscription)
  if (!subscription || limit === 0) return []
  const access = normalizeLanguageAccess(subscription.language_access)
  if (access.includes('all')) return programmingLanguages.map((item) => item.id)
  if (subscription.is_trial || subscription.plan === 'free_trial') return access[0] ? [access[0]] : []
  if (subscription.plan === 'starter') return access.length > 1 ? access.slice(0, 10) : starterLanguageIds
  return access.length ? access : programmingLanguages.map((item) => item.id)
}

type NexaGenState = {
  user: AppUser
  unlocks: string[]
  progress: string[]
  pianoState: {
    level: SkillLevel | null
  }
}

const NexaGenContext = createContext<NexaGenState | null>(null)

function useNexaGenState() {
  const state = useContext(NexaGenContext)
  if (!state) throw new Error('NexaGen state is unavailable')
  return state
}

const iconFor = (title: string) => {
  if (title.includes('Music') || title.includes('Piano') || title.includes('Key')) return Music2
  if (title.includes('Programming')) return Code2
  if (title.includes('PowerShell')) return Terminal
  if (title.includes('Operating') || title.includes('Installing')) return Laptop
  return BookOpen
}

const slugForDashboard = (title: string) =>
  title
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/\(12 keys\)/g, '12 keys')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .replace('installing-and-troubleshooting', 'installing-troubleshooting')
    .replace('find-my-key-and-pitch', 'find-my-key-pitch')
    .replace('piano-12-keys', 'piano-12-keys')

const practiceSongs = [
  {
    title: 'Twinkle Little Star',
    mood: 'Gentle',
    level: 'Beginner',
    progression: 'I I IV I V V I',
    key: 'C major',
    notes: ['C4', 'C4', 'G4', 'G4', 'A4', 'A4', 'G4', 'F4', 'F4', 'E4', 'E4', 'D4', 'D4', 'C4'],
    lesson: 'Perfect for finding steady pulse and hearing home-to-dominant movement.',
  },
  {
    title: 'Happy Steps',
    mood: 'Happy',
    level: 'Beginner',
    progression: 'I IV V I',
    key: 'C major',
    notes: ['C4', 'E4', 'G4', 'C4', 'F4', 'A4', 'G4', 'E4'],
    lesson: 'Bright triads teach the sound of arrival, lift, tension, and return.',
  },
  {
    title: 'Sad Window',
    mood: 'Sad',
    level: 'Beginner',
    progression: 'vi IV I V',
    key: 'C major',
    notes: ['A4', 'E4', 'F4', 'C4', 'E4', 'D4', 'G4', 'C4'],
    lesson: 'A minor start gives emotion while keeping the notes friendly.',
  },
  {
    title: 'Sunday Calm',
    mood: 'Calm',
    level: 'Beginner',
    progression: 'I V vi IV',
    key: 'C major',
    notes: ['C4', 'G4', 'A4', 'F4', 'E4', 'D4', 'C4', 'G4'],
    lesson: 'A classic loop for worship, pop, and reflective practice.',
  },
  {
    title: 'Little Victory',
    mood: 'Uplifting',
    level: 'Intermediate',
    progression: 'I iii IV V',
    key: 'C major',
    notes: ['C4', 'E4', 'G4', 'E4', 'F4', 'A4', 'G4', 'C4'],
    lesson: 'Adds color with the iii chord before resolving through IV and V.',
  },
  {
    title: 'Rainy Evening',
    mood: 'Melancholy',
    level: 'Intermediate',
    progression: 'ii V I vi',
    key: 'C major',
    notes: ['D4', 'F4', 'G4', 'B4', 'C4', 'E4', 'A4', 'E4'],
    lesson: 'Teaches the ii-V pull, a smooth sound used in many emotional songs.',
  },
  {
    title: 'Hope Rising',
    mood: 'Hopeful',
    level: 'Intermediate',
    progression: 'IV V vi I',
    key: 'C major',
    notes: ['F4', 'G4', 'A4', 'C4', 'E4', 'G4', 'C4', 'F4'],
    lesson: 'Starts away from home so the return feels earned.',
  },
  {
    title: 'Soft Gospel Loop',
    mood: 'Warm',
    level: 'Intermediate',
    progression: 'I vi ii V',
    key: 'C major',
    notes: ['C4', 'E4', 'A4', 'C4', 'D4', 'F4', 'G4', 'B4'],
    lesson: 'A gentle circle that prepares learners for richer harmony.',
  },
  {
    title: 'Brave Heart',
    mood: 'Epic',
    level: 'Pro',
    progression: 'vi IV I V',
    key: 'C major',
    notes: ['A4', 'C4', 'F4', 'A4', 'C4', 'G4', 'E4', 'G4'],
    lesson: 'Same pop-emotional loop, but voiced for stronger dramatic movement.',
  },
  {
    title: 'Night Jazz Sketch',
    mood: 'Smooth',
    level: 'Pro',
    progression: 'ii V I iii vi',
    key: 'C major',
    notes: ['D4', 'F4', 'G4', 'B4', 'C4', 'E4', 'E4', 'G4', 'A4', 'C4'],
    lesson: 'A compact jazz-flavored map for hearing guided harmonic travel.',
  },
]

function App() {
  const [onboarded, setOnboarded] = useState(() => localStorage.getItem('nexagen:onboarded') === 'true')
  const [appUser, setAppUser] = useState<AppUser>({ mode: 'guest', user: null })
  const [authOpen, setAuthOpen] = useState(false)
  const [dashboards, setDashboards] = useState<Dashboard[]>([])
  const [subtopics, setSubtopics] = useState<Subtopic[]>([])
  const [content, setContent] = useState<ContentItem[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [unlocks, setUnlocks] = useState<string[]>([])
  const [subtopicUnlocks, setSubtopicUnlocks] = useState<string[]>([])
  const [completed, setCompleted] = useState<string[]>([])
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)
  const [subscriptionLoading, setSubscriptionLoading] = useState(false)
  const [pianoLevel, setPianoLevelState] = useState<SkillLevel | null>(() => localStorage.getItem('nexagen:piano-level') as SkillLevel | null)
  const [programmingLevel, setProgrammingLevelState] = useState<SkillLevel | null>(() => localStorage.getItem('nexagen:programming-level') as SkillLevel | null)
  const [bootLoading, setBootLoading] = useState(true)
  const [bootError, setBootError] = useState('')

  useEffect(() => {
    if (!supabaseConfigured) return

    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) setAppUser({ mode: 'authenticated', user: data.session.user })
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAppUser(session?.user ? { mode: 'authenticated', user: session.user } : { mode: 'guest', user: null })
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBootLoading(true)
    setBootError('')
    Promise.all([getDashboards(), getContentItems(), getSubtopics()])
      .then(([dashboardRows, contentRows, subtopicRows]) => {
        setDashboards(dashboardRows)
        setContent(contentRows)
        setSubtopics(subtopicRows)
        setSelectedId((current) => current ?? dashboardRows[0]?.id ?? null)
      })
      .catch(() => setBootError('We could not load NexaGen content right now. Try again.'))
      .finally(() => setBootLoading(false))
  }, [])

  useEffect(() => {
    if (!appUser.user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUnlocks([])
      setSubtopicUnlocks(TEST_MODE ? subtopics.map((subtopic) => subtopic.id) : [])
      setCompleted([])
      setSubscription(null)
      setSubscriptionLoading(false)
      return
    }

    setSubscriptionLoading(true)
    Promise.all([
      getUserUnlocks(appUser.user.id),
      getUserSubtopicUnlocks(appUser.user.id),
      getCompletedContent(appUser.user.id),
      getUserLevel(appUser.user.id),
      getProgrammingLevel(appUser.user.id),
      getActiveSubscription(appUser.user.id),
    ]).then(([unlockRows, subtopicUnlockRows, completedRows, level, savedProgrammingLevel, activeSubscription]) => {
        setUnlocks(unlockRows)
        setSubtopicUnlocks(subtopicUnlockRows)
        setCompleted(completedRows)
        if (level) setPianoLevelState(level)
        if (savedProgrammingLevel) setProgrammingLevelState(savedProgrammingLevel)
        setSubscription(activeSubscription)
      })
      .finally(() => setSubscriptionLoading(false))
  }, [appUser.user, subtopics])

  const finishOnboarding = (mode: 'auth' | 'guest') => {
    localStorage.setItem('nexagen:onboarded', 'true')
    setOnboarded(true)
    if (mode === 'auth') setAuthOpen(true)
  }

  const selectedDashboard = dashboards.find((dashboard) => dashboard.id === selectedId) ?? dashboards[0]

  const savePianoLevel = async (level: SkillLevel) => {
    setPianoLevelState(level)
    await setUserLevel(appUser.user?.id, level)
  }

  const saveCodeLevel = async (level: SkillLevel) => {
    setProgrammingLevelState(level)
    await setProgrammingLevel(appUser.user?.id, level)
    await trackUserActivity({ userId: appUser.user?.id, action: 'programming_level_set' })
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f7f9fc] text-slate-950">
      <AnimatePresence>
        {!onboarded && <Onboarding onFinish={finishOnboarding} />}
      </AnimatePresence>

      <NexaGenContext.Provider value={{ user: appUser, unlocks, progress: completed, pianoState: { level: pianoLevel } }}>
        <LandingShell
          appUser={appUser}
          authOpen={authOpen}
          completed={completed}
          content={content}
          dashboards={dashboards}
          onAuthOpen={() => setAuthOpen(true)}
          onAuthClose={() => setAuthOpen(false)}
          onCompletedChange={setCompleted}
          onPianoLevelChange={savePianoLevel}
          onProgrammingLevelChange={saveCodeLevel}
          onSelected={setSelectedId}
          onSubscriptionChange={setSubscription}
          selectedDashboard={selectedDashboard}
          pianoLevel={pianoLevel}
          programmingLevel={programmingLevel}
          subtopicUnlocks={subtopicUnlocks}
          subtopics={subtopics}
          onSubtopicUnlock={(id) => setSubtopicUnlocks((current) => Array.from(new Set([...current, id])))}
          unlocks={unlocks}
          subscription={subscription}
          subscriptionLoading={subscriptionLoading}
          bootLoading={bootLoading}
          bootError={bootError}
        />
      </NexaGenContext.Provider>
    </main>
  )
}

function Onboarding({ onFinish }: { onFinish: (mode: 'auth' | 'guest') => void }) {
  const [step, setStep] = useState(0)
  const dragX = useMotionValue(0)
  const rotate = useTransform(dragX, [-220, 220], [-8, 8])

  const slides = [
    {
      title: 'Welcome to NexaGen',
      copy: 'A focused learning space for music mastery, programming basics, systems troubleshooting, and unlockable deep dives.',
      action: 'Begin',
    },
    {
      title: 'Choose Your Interests',
      copy: 'Tune the experience toward what you want to learn first. You can skip and explore everything later.',
      action: 'Continue',
    },
    {
      title: 'Learn, Unlock, Track',
      copy: 'Master all 12 keys, reinforce Q&A, learn shells and troubleshooting, then save progress as your library grows.',
      action: 'Continue',
    },
    {
      title: 'Start Your Session',
      copy: 'Authenticate to save progress and unlock dashboards, or continue as a guest for free modules.',
      action: 'Proceed with Authentication',
    },
  ]

  const current = slides[step]

  return (
    <motion.section
      className="fixed inset-0 z-50 overflow-y-auto bg-[#f8fbff] px-3 py-3 sm:px-4 sm:py-6 md:grid md:place-items-center"
      exit={{ opacity: 0, scale: 1.02 }}
    >
      <motion.div
        className="absolute inset-0 opacity-70"
        style={{
          background:
            'radial-gradient(circle at 20% 15%, rgba(20,184,166,.22), transparent 32%), radial-gradient(circle at 84% 18%, rgba(37,99,235,.18), transparent 30%), radial-gradient(circle at 50% 92%, rgba(245,158,11,.16), transparent 34%)',
        }}
      />
      <motion.div
        className="relative mx-auto grid w-full max-w-6xl items-center gap-4 rounded-[1.5rem] border border-white bg-white/80 p-4 shadow-2xl shadow-slate-200/80 backdrop-blur-xl sm:gap-6 sm:p-5 md:grid-cols-[1.05fr_.95fr] md:gap-8 md:rounded-[2rem] md:p-8"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={(_, info) => {
          if (info.offset.x < -90) setStep((value) => Math.min(value + 1, slides.length - 1))
          if (info.offset.x > 90) setStep((value) => Math.max(value - 1, 0))
        }}
        style={{ x: dragX, rotate }}
      >
        <div className="relative hidden min-h-[200px] overflow-hidden rounded-[1.25rem] bg-slate-950 sm:block md:min-h-[440px] md:rounded-[1.5rem]">
          {visuals.map((src, index) => (
            <motion.img
              alt=""
              animate={{ opacity: index === step % visuals.length ? 1 : 0, scale: index === step % visuals.length ? 1 : 1.08 }}
              className="blur-load absolute inset-0 h-full w-full object-cover"
              decoding="async"
              key={src}
              loading={index === 0 ? 'eager' : 'lazy'}
              sizes={imageSizes}
              src={src}
              transition={{ duration: 0.7 }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/15 to-transparent" />
          <motion.div
            animate={{ rotate: 360 }}
            className="absolute bottom-6 left-6 grid size-24 place-items-center rounded-full border border-white/35 bg-white/15 text-white backdrop-blur"
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="size-9" />
          </motion.div>
        </div>

        <div className="p-0 md:p-4">
          <div className="mb-5 flex gap-2 md:mb-8">
            {slides.map((slide, index) => (
              <button
                aria-label={slide.title}
                className={`h-2 rounded-full transition-all ${index === step ? 'w-12 bg-teal-600' : 'w-3 bg-slate-300'}`}
                key={slide.title}
                onClick={() => setStep(index)}
              />
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              initial={{ opacity: 0, y: 14 }}
              key={current.title}
              transition={{ duration: 0.35 }}
            >
              <p className="mb-2 text-xs font-semibold uppercase tracking-[.16em] text-teal-700 sm:text-sm md:mb-3 md:tracking-[.18em]">NexaGen Learning</p>
              <h1 className="max-w-xl text-3xl font-black leading-tight text-slate-950 sm:text-4xl md:text-6xl">{current.title}</h1>
              <p className="mt-3 max-w-xl text-base leading-7 text-slate-600 md:mt-5 md:text-lg md:leading-8">{current.copy}</p>

              {step === 1 && (
                <div className="mt-5 flex flex-wrap gap-2 md:mt-8 md:gap-3">
                  {interests.map((interest) => (
                    <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm" key={interest}>
                      {interest}
                    </button>
                  ))}
                </div>
              )}

              {step === 2 && (
                <div className="mt-5 grid gap-2 sm:grid-cols-2 md:mt-8 md:gap-3">
                  {['12 keys', 'Music theory', 'Q&A reinforcement', 'Shell troubleshooting', 'PDF ready', 'Progress tracking'].map(
                    (benefit) => (
                      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-sm font-semibold" key={benefit}>
                        <CheckCircle2 className="size-5 text-teal-600" />
                        {benefit}
                      </div>
                    ),
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 grid gap-3 sm:flex sm:flex-wrap md:mt-10">
            {step < slides.length - 1 ? (
              <>
                <button className="w-full rounded-full bg-slate-950 px-6 py-3 font-bold text-white shadow-lg sm:w-auto" onClick={() => setStep(step + 1)}>
                  {current.action}
                </button>
                <button className="w-full rounded-full px-6 py-3 font-bold text-slate-600 sm:w-auto" onClick={() => onFinish('guest')}>
                  Skip
                </button>
              </>
            ) : (
              <>
                <button className="w-full rounded-full bg-slate-950 px-5 py-3 font-bold text-white shadow-lg sm:w-auto sm:px-6" onClick={() => onFinish('auth')}>
                  Proceed with Authentication
                </button>
                <button className="w-full rounded-full border border-slate-200 bg-white px-5 py-3 font-bold text-slate-700 sm:w-auto sm:px-6" onClick={() => onFinish('guest')}>
                  Continue as Guest
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </motion.section>
  )
}

type LandingShellProps = {
  appUser: AppUser
  authOpen: boolean
  completed: string[]
  content: ContentItem[]
  dashboards: Dashboard[]
  onAuthClose: () => void
  onAuthOpen: () => void
  onCompletedChange: (ids: string[]) => void
  onPianoLevelChange: (level: SkillLevel) => Promise<void>
  onProgrammingLevelChange: (level: SkillLevel) => Promise<void>
  onSelected: (id: string) => void
  onSubtopicUnlock: (id: string) => void
  onSubscriptionChange: (subscription: UserSubscription | null) => void
  pianoLevel: SkillLevel | null
  programmingLevel: SkillLevel | null
  selectedDashboard?: Dashboard
  subtopicUnlocks: string[]
  subtopics: Subtopic[]
  subscription: UserSubscription | null
  subscriptionLoading: boolean
  bootLoading: boolean
  bootError: string
  unlocks: string[]
}

function LandingShell(props: LandingShellProps) {
  const {
    appUser,
    authOpen,
    completed,
    content,
    dashboards,
    onAuthClose,
    onAuthOpen,
    onCompletedChange,
    onPianoLevelChange,
    onProgrammingLevelChange,
    onSelected,
    onSubtopicUnlock,
    onSubscriptionChange,
    pianoLevel,
    programmingLevel,
    selectedDashboard,
    subtopicUnlocks,
    subtopics,
    subscription,
    subscriptionLoading,
    bootLoading,
    bootError,
    unlocks,
  } = props
  const [query, setQuery] = useState('')
  const [unlockTarget, setUnlockTarget] = useState<Dashboard | null>(null)
  const [planTarget, setPlanTarget] = useState<Dashboard | null>(null)
  const [planModalMode, setPlanModalMode] = useState<'required' | 'upgrade'>('required')
  const [comingSoonDashboard, setComingSoonDashboard] = useState<Dashboard | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [analyticsOpen, setAnalyticsOpen] = useState(false)
  const [busTripOpen, setBusTripOpen] = useState(false)
  const [focusedDashboardId, setFocusedDashboardId] = useState<string | null>(null)
  const [revisionCards, setRevisionCards] = useState<RevisionCard[]>([])
  const [progressMessage, setProgressMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const autoOpenedSubscriptionRef = useRef<string | null>(null)
  const effectiveUnlocks = useMemo(() => buildEffectiveUnlocks(dashboards, unlocks, subscription), [dashboards, subscription, unlocks])

  const openDashboardWorkspace = (id: string) => {
    const dashboard = dashboards.find((item) => item.id === id)
    if (!dashboard) return
    const accessKey = dashboardAccessKey(dashboard)
    setBusTripOpen(false)
    onSelected(id)
    if (!availableDashboardSlugs.includes(accessKey)) {
      setComingSoonDashboard(dashboard)
      return
    }
    if (!appUser.user) {
      onAuthOpen()
      return
    }
    if (subscriptionLoading) {
      setSuccessMessage('Checking your subscription access...')
      window.setTimeout(() => setSuccessMessage(''), 1200)
      return
    }
    if (!dashboardIsSubscriptionUnlocked(dashboard, subscription)) {
      setPlanModalMode('required')
      setPlanTarget(dashboard)
      return
    }
    setFocusedDashboardId(id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const saveProgress = () => {
    if (!appUser.user) {
      onAuthOpen()
      return
    }
    setProgressMessage('Your progress is now being tracked. Visit Analytics Dashboard to monitor your learning.')
    window.setTimeout(() => setProgressMessage(''), 5200)
  }

  const openUpgradePlans = () => {
    if (!appUser.user) {
      onAuthOpen()
      return
    }
    const targetDashboard = focusedDashboard
      ?? selectedDashboard
      ?? dashboards.find((item) => dashboardAccessKey(item) === 'programming')
      ?? dashboards.find((item) => availableDashboardSlugs.includes(dashboardAccessKey(item)))
      ?? dashboards[0]
    if (!targetDashboard) return
    setPlanModalMode('upgrade')
    setPlanTarget(targetDashboard)
  }

  const selectedContent = useMemo(() => {
    if (!selectedDashboard) return []
    const dashboardSlug = slugForDashboard(selectedDashboard.title)
    return content.filter((item) => item.dashboard_id === selectedDashboard.id || item.dashboard_id === dashboardSlug)
  }, [content, selectedDashboard])

  const focusedDashboard = focusedDashboardId
    ? dashboards.find((dashboard) => dashboard.id === focusedDashboardId)
    : null

  const focusedContent = useMemo(() => {
    if (!focusedDashboard) return []
    const dashboardSlug = slugForDashboard(focusedDashboard.title)
    return content.filter((item) => item.dashboard_id === focusedDashboard.id || item.dashboard_id === dashboardSlug)
  }, [content, focusedDashboard])

  const focusedCompleted = focusedContent.filter((item) => completed.includes(item.id)).length
  const focusedProgress = focusedContent.length ? Math.round((focusedCompleted / focusedContent.length) * 100) : 0

  const selectedSubtopics = useMemo(() => {
    if (!selectedDashboard) return []
    const dashboardSlug = slugForDashboard(selectedDashboard.title)
    return subtopics.filter((subtopic) => subtopic.dashboard_id === selectedDashboard.id || subtopic.dashboard_id === dashboardSlug)
  }, [selectedDashboard, subtopics])

  useEffect(() => {
    if (selectedDashboard) {
      void trackUserActivity({ userId: appUser.user?.id, action: 'dashboard_opened', dashboardId: selectedDashboard.id })
    }
  }, [appUser.user?.id, selectedDashboard])

  useEffect(() => {
    const onRevision = (event: Event) => {
      const detail = (event as CustomEvent<RevisionCard[]>).detail
      setRevisionCards(detail)
    }
    window.addEventListener('nexagen:revision-cards', onRevision)
    return () => window.removeEventListener('nexagen:revision-cards', onRevision)
  }, [])

  useEffect(() => {
    if (!appUser.user || subscriptionLoading || !subscription || focusedDashboardId) return
    if (autoOpenedSubscriptionRef.current === subscription.id) return
    const target = dashboards.find((dashboard) => dashboardIsSubscriptionUnlocked(dashboard, subscription))
    if (!target) return
    autoOpenedSubscriptionRef.current = subscription.id
    onSelected(target.id)
    setFocusedDashboardId(target.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [appUser.user, dashboards, focusedDashboardId, onSelected, subscription, subscriptionLoading])

  if (bootLoading) return <AppSkeleton />

  if (bootError) return <AppErrorState message={bootError} onRetry={() => window.location.reload()} />

  return (
    <>
      <div className="ticker-bar group sticky top-0 z-40 overflow-hidden bg-[#103b4a] py-2 text-sm font-bold text-white shadow-lg">
        <div className="ticker-track flex min-w-max gap-12 whitespace-nowrap">
          {[0, 1].map((item) => (
            <span key={item}>
              Currently only 2 dashboards are available - Piano and Programming - each packed with everything you need to master your favorite skills. More dashboards are coming soon. Subscribe to our newsletter to stay updated.
            </span>
          ))}
        </div>
      </div>
      <header className="sticky top-0 z-30 border-b border-white/70 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <button className="flex items-center gap-3" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
<div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white/30 shadow-lg">
              <img src="/nexagen.jpeg" alt="NexaGen" className="w-full h-full object-cover" />
            </div>
            <span>
              <span className="block text-xl font-black">NexaGen</span>
              <span className="block text-xs font-semibold uppercase tracking-[.18em] text-teal-700">Learn and unlock</span>
            </span>
          </button>
          <div className="hidden items-center gap-1 text-sm font-black text-slate-600 lg:flex">
            {[
              ['Search', '#search'],
              ['Dashboards', '#dashboards'],
              ['Pricing', '#pricing'],
              ['Support', '#support'],
            ].map(([label, href]) => (
              <a className="rounded-full px-3 py-2 transition hover:bg-slate-100 hover:text-slate-950" href={href} key={href}>
                {label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button
              className="relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl border border-pink-300 bg-pink-500 px-4 py-2.5 text-sm font-black text-white shadow-lg shadow-pink-500/40 transition-all duration-300 hover:-translate-y-0.5 hover:bg-pink-400 hover:shadow-xl hover:shadow-pink-500/50 sm:px-5"
              onClick={openUpgradePlans}
            >
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 opacity-70" />
              <Sparkles className="relative z-10 size-4" />
              <span className="relative z-10">Upgrade</span>
              <span className="absolute -right-1 -top-1 size-3 rounded-full bg-white shadow ring-2 ring-pink-300" />
            </button>
            <button
              aria-label="Open menu"
              className="grid size-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-sm"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="size-5" />
            </button>
            {appUser.user ? (
              <>
                <span className="hidden max-w-[220px] truncate rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 sm:inline">
                  {appUser.user.email}
                </span>
                <button
                  aria-label="Sign out"
                  className="grid size-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm"
                  onClick={() => supabase.auth.signOut()}
                >
                  <LogOut className="size-5" />
                </button>
              </>
            ) : (
              <button className="rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-lg" onClick={onAuthOpen}>
                Sign in
              </button>
            )}
          </div>
        </div>
      </header>

      <ProfileSidebar
        appUser={appUser}
        completed={completed}
        dashboards={dashboards}
        onAnalytics={() => {
          setBusTripOpen(false)
          setAnalyticsOpen(true)
          setSidebarOpen(false)
        }}
        onClose={() => setSidebarOpen(false)}
        onAccount={() => {
          setBusTripOpen(false)
          setAnalyticsOpen(false)
          setSidebarOpen(false)
          window.dispatchEvent(new CustomEvent('nexagen:open-account'))
        }}
        onBusTrip={() => {
          setAnalyticsOpen(false)
          setFocusedDashboardId(null)
          setBusTripOpen(true)
          setSidebarOpen(false)
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
        onSelectDashboard={(id) => {
          openDashboardWorkspace(id)
          setSidebarOpen(false)
        }}
        open={sidebarOpen}
        selectedDashboard={selectedDashboard}
        selectedSubtopics={selectedSubtopics}
      />

      <section className="relative overflow-hidden px-4 py-14 md:py-20">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(120deg,#f8fbff_0%,#eefdf8_45%,#fff7ed_100%)]" />
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_.82fr] lg:items-center">
          <div className="self-center text-center lg:text-left">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-white/70 px-4 py-2 text-sm font-bold text-teal-700">
              <ShieldCheck className="size-4" />
              Tech, music, practice, progress
            </p>
            <h1 className="mx-auto max-w-3xl text-5xl font-black leading-[1.02] text-slate-950 md:text-7xl lg:mx-0">Master Tech + Music in One Place</h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600 lg:mx-0">
              NexaGen blends piano fluency, programming foundations, operating systems, troubleshooting, and guided Q&A into one calm learning ecosystem.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
              <a className="premium-action px-6 py-3" href="#dashboards">
                Explore dashboards
              </a>
              <button className="premium-outline-button px-6 py-3" onClick={saveProgress}>
                Save progress
              </button>
            </div>
            {progressMessage && <p className="mt-4 rounded-2xl bg-teal-50 p-4 text-sm font-black text-teal-800 shadow-sm">{progressMessage}</p>}
          </div>
          <div className="relative">
            <img
              alt=""
              className="blur-load h-[420px] w-full rounded-[1.5rem] object-cover shadow-xl shadow-slate-200/70"
              decoding="async"
              fetchPriority="high"
              sizes={imageSizes}
              src={visuals[1]}
            />
            <div className="absolute inset-x-6 bottom-6 rounded-2xl bg-white/85 p-4 text-sm font-bold text-slate-700 shadow-lg backdrop-blur-md">
              Learn, practice, run code, and unlock focused dashboards from one clean workspace.
            </div>
          </div>
        </div>
      </section>

      <GlobalSearch dashboards={dashboards} content={content} onOpenDashboard={openDashboardWorkspace} songs={songProgressions} subtopics={subtopics} />
      <ExploreDashboards dashboards={dashboards} onSelected={openDashboardWorkspace} selectedDashboard={selectedDashboard} unlocks={effectiveUnlocks} />
      {appUser.user ? (
        <PersonalizedHome completed={completed} content={content} dashboards={dashboards} onOpenDashboard={openDashboardWorkspace} subtopics={subtopics} />
      ) : (
        <ContentFeed />
      )}
      <details className="mx-auto max-w-7xl px-4 py-6">
        <summary className="cursor-pointer border-y border-slate-200 py-5 text-center text-sm font-black uppercase tracking-[.16em] text-teal-700">
          Music practice demos
        </summary>
        <SongLandingPlayer />
        <SongPracticeLibrary />
      </details>
      <DailyChallenge appUser={appUser} onOpenDashboard={openDashboardWorkspace} dashboards={dashboards} />
      <ProgrammingValueSection />
      {!subscription && !subscriptionLoading && <SaasPricingSection subscription={subscription} />}
      <LaunchTrustSections appUser={appUser} />
      <ValueSections />

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 lg:grid-cols-[.8fr_1.2fr]" id="dashboards">
        <div>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-2xl font-black">Dashboards</h2>
            <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-slate-600 shadow-sm">
              {appUser.user ? 'Authenticated' : 'Guest'}
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {dashboards.map((dashboard) => {
              const Icon = iconFor(dashboard.title)
              const isUnlocked = !dashboard.is_locked || effectiveUnlocks.includes(dashboard.id)
              return (
                <button
                  className={`rounded-2xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md ${
                    selectedDashboard?.id === dashboard.id ? 'border-teal-400 ring-4 ring-teal-100' : 'border-slate-100'
                  }`}
                  key={dashboard.id}
                  onClick={() => openDashboardWorkspace(dashboard.id)}
                >
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <span className="grid size-12 place-items-center rounded-2xl bg-slate-950 text-white">
                      <Icon className="size-5" />
                    </span>
                    <span className={`rounded-full px-3 py-1 text-xs font-black ${isUnlocked ? 'bg-teal-50 text-teal-700' : 'bg-amber-50 text-amber-700'}`}>
                      {isUnlocked ? 'Open' : <LockKeyhole className="size-4" />}
                    </span>
                  </div>
                  <h3 className="text-lg font-black">{dashboard.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{dashboard.description}</p>
                  <span className="mt-4 inline-flex rounded-full bg-slate-950 px-4 py-2 text-sm font-black text-white">Explore</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-slate-100 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[.16em] text-teal-700">Workspace preview</p>
          <h2 className="mt-2 text-3xl font-black">{selectedDashboard?.title ?? 'Choose a dashboard'}</h2>
          <p className="mt-3 leading-7 text-slate-600">
            Open any dashboard to enter a full-screen learning room with its own content, tools, progress, and a Back button at the top.
          </p>
          <p className="mt-2 text-sm font-bold text-slate-500">{selectedContent.length} content items ready in the selected dashboard.</p>
          {selectedDashboard && (
            <button className="premium-action mt-5 px-5 py-3 text-sm" onClick={() => openDashboardWorkspace(selectedDashboard.id)}>
              Open full-screen dashboard
            </button>
          )}
        </div>
      </section>

      <AnimatePresence>
        {focusedDashboard && (
          <DashboardWorkspace
            appUser={appUser}
            completed={completed}
            dashboard={focusedDashboard}
            items={focusedContent}
            onClose={() => setFocusedDashboardId(null)}
            onCompletedChange={onCompletedChange}
            onPianoLevelChange={onPianoLevelChange}
            onProgrammingLevelChange={onProgrammingLevelChange}
            onSubtopicUnlock={onSubtopicUnlock}
            onUnlock={() => setUnlockTarget(focusedDashboard)}
            pianoLevel={pianoLevel}
            programmingLevel={programmingLevel}
            progress={focusedProgress}
            query={query}
            setQuery={setQuery}
            subtopicUnlocks={subtopicUnlocks}
            subtopics={subtopics}
            subscription={subscription}
            unlocks={effectiveUnlocks}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {busTripOpen && <BusTripBookingPage onClose={() => setBusTripOpen(false)} />}
      </AnimatePresence>

      <HowItWorks
        appUser={appUser}
        completed={completed}
        content={content}
        dashboards={dashboards}
        pianoLevel={pianoLevel}
        subtopicUnlocks={subtopicUnlocks}
        subtopics={subtopics}
        unlocks={effectiveUnlocks}
      />

      <footer className="mx-auto max-w-7xl scroll-mt-28 px-4 py-12 text-slate-800" id="support">
        <div className="grid gap-8 border-t border-slate-200 pt-8 md:grid-cols-[1.1fr_.9fr_.9fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-2xl bg-black text-white">
                <Compass className="size-5" />
              </span>
              <div>
                <h2 className="text-xl font-black">NexaGen</h2>
                <p className="text-sm font-semibold text-slate-500">Learning, practice, and verified progress.</p>
              </div>
            </div>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600">
              NexaGen now uses subscription-ready access. Guests can preview the experience, while saved progress and dashboard access stay tied to authenticated accounts.
            </p>
            <NewsletterSignup />
          </div>
          <div>
            <h3 className="font-black">Contact</h3>
            <div className="mt-4 grid gap-3 text-sm font-semibold text-slate-600">
              <a className="inline-flex items-center gap-2 hover:text-black" href="mailto:nexagen656@gmail.com">
                <MessageCircle className="size-4 text-black" />
                nexagen656@gmail.com
              </a>
              <a className="inline-flex items-center gap-2 hover:text-black" href="tel:+254719637416">
                <Headphones className="size-4 text-black" />
                +254 719 637 416
              </a>
              <span className="inline-flex items-center gap-2">
                <Compass className="size-4 text-black" />
                Nairobi, Kenya
              </span>
            </div>
          </div>
          <div>
            <h3 className="font-black">Social Links</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                ['GitHub', Code2, 'https://github.com/gregory656'],
                ['LinkedIn', Laptop, 'https://www.linkedin.com/'],
                ['Instagram', Sparkles, 'https://www.instagram.com/reddevcode'],
                ['YouTube', Play, 'https://www.youtube.com/'],
              ].map(([label, Icon, href]) => (
                <a
                  aria-label={label as string}
                  className="grid size-11 place-items-center rounded-full border border-slate-200 bg-white text-black shadow-sm transition hover:bg-black hover:text-white"
                  href={href as string}
                  key={label as string}
                  rel="noreferrer"
                  target="_blank"
                >
                  <Icon className="size-5" />
                </a>
              ))}
            </div>
            <p className="mt-4 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm">Payments by IntaSend</p>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-2 border-t border-slate-200 pt-5 text-xs font-semibold text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} NexaGen Technology Ltd. All rights reserved.</span>
          <span className="flex flex-wrap gap-3">
            <a href="#dashboards">Quick navigation</a>
            <a href="#pricing">Pricing</a>
            <a href="#support">Support</a>
            <span>Terms & Privacy </span>
            <span>Powered by GracyAI</span>
          </span>
        </div>
      </footer>

      <ScrollToTopButton />

      <FloatingLearningAssistant
        context={{
          dashboard: focusedDashboard?.title ?? selectedDashboard?.title,
          level: focusedDashboard?.title.toLowerCase().includes('programming') ? programmingLevel : pianoLevel,
          mode: (focusedDashboard?.title ?? selectedDashboard?.title ?? '').toLowerCase().includes('programming')
            ? 'programming'
            : (focusedDashboard?.title ?? selectedDashboard?.title ?? '').toLowerCase().includes('piano')
              ? 'piano'
              : 'general',
          subtopic: selectedSubtopics[0]?.title,
        }}
      />

      <AnimatePresence>
        {authOpen && <AuthModal onClose={onAuthClose} />}
        {analyticsOpen && (
          <AnalyticsDashboard
            completed={completed}
            content={content}
            dashboards={dashboards}
            onClose={() => setAnalyticsOpen(false)}
            subtopics={subtopics}
          />
        )}
        <AccountAutoModal appUser={appUser} dashboards={dashboards} subscription={subscription} onAuthOpen={onAuthOpen} onSubscriptionChange={onSubscriptionChange} />
        {comingSoonDashboard && <ComingSoonModal dashboard={comingSoonDashboard} onClose={() => setComingSoonDashboard(null)} />}
        {planTarget && (
          <PlanSelectionModal
            appUser={appUser}
            dashboard={planTarget}
            dashboards={dashboards}
            mode={planModalMode}
            onAuthOpen={onAuthOpen}
            onClose={() => setPlanTarget(null)}
            onOpenDashboard={(dashboardId, message) => {
              setPlanTarget(null)
              setSuccessMessage(message)
              window.setTimeout(() => {
                setSuccessMessage('')
                setFocusedDashboardId(dashboardId)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }, 1500)
            }}
            onSubscriptionChange={onSubscriptionChange}
          />
        )}
        {successMessage && <SuccessOverlay message={successMessage} />}
        {!!revisionCards.length && <SessionLockIn cards={revisionCards} onClose={() => setRevisionCards([])} />}
        {unlockTarget && (
          <UnlockModal
            dashboard={unlockTarget}
            onClose={() => setUnlockTarget(null)}
            userId={appUser.user?.id}
          />
        )}
      </AnimatePresence>
    </>
  )
}

const busReferralCode = 'GRST416976'
const busReferralUrl = 'https://buupass.com/referrals/GRST416976'

function BusTripBookingPage({ onClose }: { onClose: () => void }) {
  const [copied, setCopied] = useState(false)
  const busTrustImages = ['/buupass1.jpeg', '/buupass2.jpeg']
  const benefits = [
    'Fast online booking',
    'Secure payments',
    'Easy route selection',
    'Trusted bus operators',
    'Convenient travel planning',
    'Mobile-friendly booking experience',
    'Quick ticket access',
  ]

  const copyReferralCode = async () => {
    await navigator.clipboard.writeText(busReferralCode)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2600)
  }

  return (
    <motion.section
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-40 overflow-y-auto bg-[#f8fbff] px-4 py-5 sm:px-6 lg:px-8"
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50" onClick={onClose}>
            <ArrowLeft className="size-4" />
            Back to dashboard
          </button>
          {copied && (
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700 shadow-sm">
              <CheckCircle2 className="size-4" />
              Referral code copied successfully
            </span>
          )}
        </div>

        <div className="overflow-hidden rounded-[1.5rem] border border-white bg-white shadow-xl shadow-slate-200/70">
          <div className="grid gap-0 lg:grid-cols-[1.05fr_.95fr]">
            <div className="p-6 sm:p-8 lg:p-10">
              <div className="relative mb-7 overflow-hidden rounded-[1.25rem] border border-slate-100 shadow-lg shadow-slate-200/70">
                <img alt="BUUPASS booking partner" className="h-52 w-full object-cover sm:h-64" src={busTrustImages[0]} />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/82 via-slate-950/42 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-black text-pink-700 shadow-sm">
                      <BusFront className="size-4" />
                      BUUPASS travel partner
                    </span>
                    <p className="mt-3 max-w-sm text-sm font-bold leading-6 text-white/90">Trusted booking flow with secure ticket access and route planning from a known bus travel platform.</p>
                  </div>
                  <span className="rounded-full border border-white/30 bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-[.16em] text-white backdrop-blur">Partner referral</span>
                </div>
              </div>
              <h1 className="mt-5 text-4xl font-black leading-tight text-slate-950 sm:text-5xl">Book a Bus Trip With Us</h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                Booking a bus has never been this easy.
              </p>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
                We partnered with BUUPASS to bring you comfort, convenience, and faster travel planning directly from our platform.
              </p>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
                Whether you're traveling home, heading back to campus, planning a weekend getaway, or commuting across cities - BUUPASS helps you book your trip quickly and securely.
              </p>

              <div className="mt-8">
                <h2 className="text-xl font-black text-slate-950">Benefits</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {benefits.map((benefit) => (
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3 text-sm font-black text-slate-700" key={benefit}>
                      <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
                        <CheckCircle2 className="size-4" />
                      </span>
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden border-t border-slate-100 bg-slate-950 p-6 text-white sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
              <div className="absolute inset-0 opacity-25" style={{ backgroundImage: `url(${busTrustImages[1]})`, backgroundPosition: 'center', backgroundSize: 'cover' }} />
              <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/90 to-slate-950" />
              <div className="relative rounded-[1.25rem] border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur">
                <p className="text-sm font-bold leading-6 text-pink-100">When booking, enter the referral code exactly as shown below:</p>
                <div className="mt-5 rounded-2xl border border-pink-300/60 bg-white p-5 text-center shadow-lg shadow-pink-500/20">
                  <p className="text-xs font-black uppercase tracking-[.2em] text-slate-500">Referral code</p>
                  <p className="mt-2 break-all text-4xl font-black tracking-wider text-slate-950 sm:text-5xl">{busReferralCode}</p>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-pink-300 bg-pink-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-pink-500/40 transition-all duration-300 hover:bg-pink-400" onClick={() => void copyReferralCode()}>
                    <Copy className="size-4" />
                    Copy Referral Code
                  </button>
                  <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-slate-950 shadow-lg transition hover:bg-pink-50" onClick={() => window.open(busReferralUrl, '_blank')}>
                    <ExternalLink className="size-4" />
                    Book Now
                  </button>
                </div>
              </div>

              <div className="relative mt-5 rounded-[1.25rem] border border-white/10 bg-white/5 p-5 backdrop-blur">
                <div className="mb-4 grid grid-cols-2 gap-3">
                  {busTrustImages.map((src, index) => (
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/10" key={src}>
                      <img alt={`BUUPASS trust visual ${index + 1}`} className="h-24 w-full object-cover" src={src} />
                    </div>
                  ))}
                </div>
                <p className="text-sm font-bold leading-6 text-slate-200">
                  Your booking opens securely on BUUPASS in a new tab, so your NexaGen dashboard stays exactly where you left it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

function DashboardWorkspace({
  appUser,
  completed,
  dashboard,
  items,
  onClose,
  onCompletedChange,
  onPianoLevelChange,
  onProgrammingLevelChange,
  onSubtopicUnlock,
  onUnlock,
  pianoLevel,
  programmingLevel,
  progress,
  query,
  setQuery,
  subtopicUnlocks,
  subtopics,
  subscription,
  unlocks,
}: {
  appUser: AppUser
  completed: string[]
  dashboard: Dashboard
  items: ContentItem[]
  onClose: () => void
  onCompletedChange: (ids: string[]) => void
  onPianoLevelChange: (level: SkillLevel) => Promise<void>
  onProgrammingLevelChange: (level: SkillLevel) => Promise<void>
  onSubtopicUnlock: (id: string) => void
  onUnlock: () => void
  pianoLevel: SkillLevel | null
  programmingLevel: SkillLevel | null
  progress: number
  query: string
  setQuery: (value: string) => void
  subtopicUnlocks: string[]
  subtopics: Subtopic[]
  subscription: UserSubscription | null
  unlocks: string[]
}) {
  return (
    <motion.section
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-0 z-40 overflow-y-auto bg-[#f7f9fc]"
      exit={{ opacity: 0, y: 18 }}
      initial={{ opacity: 0, y: 18 }}
      transition={{ duration: 0.22 }}
    >
      <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <button className="grid size-11 shrink-0 place-items-center rounded-full bg-slate-950 text-white" onClick={onClose}>
              <ArrowLeft className="size-5" />
            </button>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[.16em] text-teal-700">Dashboard workspace</p>
              <h1 className="truncate text-xl font-black sm:text-2xl">{dashboard.title}</h1>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-slate-100 px-3 py-2 text-sm font-black text-slate-700">{progress}% complete</span>
            <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1500px] px-4 py-6">
        <DashboardDetail
          appUser={appUser}
          completed={completed}
          dashboard={dashboard}
          items={items}
          onCompletedChange={onCompletedChange}
          onPianoLevelChange={onPianoLevelChange}
          onProgrammingLevelChange={onProgrammingLevelChange}
          onSubtopicUnlock={onSubtopicUnlock}
          onUnlock={onUnlock}
          pianoLevel={pianoLevel}
          programmingLevel={programmingLevel}
          progress={progress}
          query={query}
          setQuery={setQuery}
          subtopicUnlocks={subtopicUnlocks}
          subtopics={subtopics}
          subscription={subscription}
          unlocks={unlocks}
        />
      </div>
    </motion.section>
  )
}

function ProfileSidebar({
  appUser,
  completed,
  dashboards,
  onAnalytics,
  onAccount,
  onBusTrip,
  onClose,
  onSelectDashboard,
  open,
  selectedDashboard,
  selectedSubtopics,
}: {
  appUser: AppUser
  completed: string[]
  dashboards: Dashboard[]
  onAnalytics: () => void
  onAccount: () => void
  onBusTrip: () => void
  onClose: () => void
  onSelectDashboard: (id: string) => void
  open: boolean
  selectedDashboard?: Dashboard
  selectedSubtopics: Subtopic[]
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            aria-label="Close profile sidebar"
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-sm lg:hidden"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            animate={{ x: 0 }}
            className="fixed left-0 top-0 z-50 flex h-dvh w-[min(88vw,360px)] flex-col border-r border-white/70 bg-white p-5 shadow-2xl shadow-slate-950/15"
            exit={{ x: '-100%' }}
            initial={{ x: '-100%' }}
            transition={{ type: 'spring', bounce: 0.08, duration: 0.35 }}
          >
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,.14),transparent_35%),linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)]" />
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold uppercase tracking-[.16em] text-teal-700">Profile hub</p>
                <h2 className="mt-1 text-2xl font-black">{appUser.user?.email ?? 'Guest learner'}</h2>
                <p className="mt-1 text-sm font-semibold text-slate-500">{completed.length} completed Q&A items</p>
              </div>
              <button aria-label="Close profile sidebar" className="grid size-10 place-items-center rounded-full bg-slate-100" onClick={onClose}>
                <X className="size-5" />
              </button>
            </div>

            <button
              className="mt-5 flex items-center justify-between rounded-2xl border border-teal-100 bg-teal-50 p-4 text-left font-black text-teal-800"
              onClick={onAnalytics}
            >
              <span className="inline-flex items-center gap-2">
                <BarChart3 className="size-5" />
                Analytics Dashboard
              </span>
              <span>{completed.length}</span>
            </button>

            <button
              className="mt-3 flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 text-left font-black text-slate-800"
              onClick={onAccount}
            >
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="size-5" />
                My Account
              </span>
              <ChevronDown className="size-4 -rotate-90" />
            </button>

            <button
              className="mt-3 flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 text-left font-black text-slate-800 shadow-sm transition hover:border-pink-200 hover:bg-pink-50 hover:text-pink-800"
              onClick={onBusTrip}
            >
              <span className="inline-flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-xl bg-pink-100 text-pink-700">
                  <BusFront className="size-4" />
                </span>
                Book a Bus Trip With Us
              </span>
              <ChevronDown className="size-4 -rotate-90" />
            </button>

            <div className="mt-6 min-h-0 flex-1 overflow-auto pr-1">
              <h3 className="mb-3 text-sm font-black uppercase tracking-[.14em] text-slate-500">All 8 dashboards</h3>
              <div className="grid gap-2">
                {dashboards.map((dashboard) => {
                  const Icon = iconFor(dashboard.title)
                  return (
                    <button
                      className={`flex items-center gap-3 rounded-2xl border p-3 text-left ${
                        selectedDashboard?.id === dashboard.id ? 'border-teal-300 bg-teal-50' : 'border-slate-100 bg-slate-50'
                      }`}
                      key={dashboard.id}
                      onClick={() => onSelectDashboard(dashboard.id)}
                    >
                      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-slate-950 text-white">
                        <Icon className="size-4" />
                      </span>
                      <span className="font-black">{dashboard.title}</span>
                    </button>
                  )
                })}
              </div>

              {!!selectedSubtopics.length && (
                <div className="mt-6">
                  <h3 className="mb-3 text-sm font-black uppercase tracking-[.14em] text-slate-500">Subtopics here</h3>
                  <div className="grid gap-2">
                    {selectedSubtopics.slice(0, 12).map((subtopic) => (
                      <button
                        className="rounded-xl bg-slate-50 px-3 py-2 text-left text-sm font-bold text-slate-700"
                        key={subtopic.id}
                        onClick={() => {
                          void trackUserActivity({ userId: appUser.user?.id, action: 'subtopic_opened', dashboardId: selectedDashboard?.id, subtopicId: subtopic.id })
                          onClose()
                        }}
                      >
                        {subtopic.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

function GlobalSearch({
  content,
  dashboards,
  onOpenDashboard,
  songs,
  subtopics,
}: {
  content: ContentItem[]
  dashboards: Dashboard[]
  onOpenDashboard: (id: string) => void
  songs: SongProgression[]
  subtopics: Subtopic[]
}) {
  const [term, setTerm] = useState('')
  const query = useDebouncedValue(term.trim().toLowerCase())
  const results = useMemo(() => {
    if (!query) return null
    return {
      dashboards: dashboards.filter((item) => `${item.title} ${item.description}`.toLowerCase().includes(query)).slice(0, 4),
      subtopics: subtopics.filter((item) => `${item.title} ${item.description}`.toLowerCase().includes(query)).slice(0, 5),
      questions: content.filter((item) => `${item.title} ${item.body}`.toLowerCase().includes(query)).slice(0, 5),
      songs: songs.filter((item) => `${item.title} ${item.artist} ${item.genre}`.toLowerCase().includes(query)).slice(0, 4),
    }
  }, [content, dashboards, query, songs, subtopics])

  return (
    <section className="mx-auto max-w-7xl scroll-mt-28 px-4 py-6" id="search">
      <div className="rounded-[1.5rem] border border-slate-100 bg-white p-4 shadow-sm">
        <label className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
          <Search className="size-5 text-teal-700" />
          <input
            className="w-full bg-transparent font-semibold outline-none"
            onChange={(event) => setTerm(event.target.value)}
            placeholder="Search dashboards, subtopics, questions, songs..."
            value={term}
          />
        </label>
        {results && (
          <div className="mt-4 grid gap-3 lg:grid-cols-4">
            <SearchGroup title="Dashboards">
              {results.dashboards.map((item) => (
                <button className="rounded-xl bg-slate-50 p-3 text-left text-sm font-bold" key={item.id} onClick={() => onOpenDashboard(item.id)}>
                  {item.title}
                </button>
              ))}
              {!results.dashboards.length && <EmptyState compact message="No dashboard found." />}
            </SearchGroup>
            <SearchGroup title="Subtopics">
              {results.subtopics.map((item) => <div className="rounded-xl bg-slate-50 p-3 text-sm font-bold" key={item.id}>{item.title}</div>)}
              {!results.subtopics.length && <EmptyState compact message="No matching subtopics." />}
            </SearchGroup>
            <SearchGroup title="Questions">
              {results.questions.map((item) => <div className="rounded-xl bg-slate-50 p-3 text-sm font-bold" key={item.id}>{item.title}</div>)}
              {!results.questions.length && <EmptyState compact message="No matching questions." />}
            </SearchGroup>
            <SearchGroup title="Songs">
              {results.songs.map((item) => <div className="rounded-xl bg-slate-50 p-3 text-sm font-bold" key={item.title}>{item.title} - {item.artist}</div>)}
              {!results.songs.length && <EmptyState compact message="No song suggestions yet." />}
            </SearchGroup>
          </div>
        )}
      </div>
    </section>
  )
}

function EmptyState({ compact = false, message }: { compact?: boolean; message: string }) {
  return (
    <div className={`${compact ? 'rounded-xl p-3 text-xs' : 'rounded-2xl p-5 text-sm'} border border-dashed border-slate-200 bg-slate-50 font-bold text-slate-500`}>
      {message}
    </div>
  )
}

function AppSkeleton() {
  return (
    <main className="min-h-screen bg-[#f7f9fc] px-4 py-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="skeleton h-16 rounded-2xl" />
        <div className="grid gap-5 lg:grid-cols-[.9fr_1.1fr]">
          <div className="space-y-4">
            <div className="skeleton h-12 rounded-2xl" />
            <div className="skeleton h-32 rounded-2xl" />
            <div className="skeleton h-12 w-64 rounded-full" />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="skeleton h-72 rounded-[1.5rem]" />
            <div className="skeleton h-72 rounded-[1.5rem]" />
            <div className="skeleton h-72 rounded-[1.5rem]" />
          </div>
        </div>
      </div>
    </main>
  )
}

function AppErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f9fc] p-4">
      <div className="max-w-md rounded-[1.5rem] border border-slate-100 bg-white p-6 text-center shadow-xl">
        <ShieldCheck className="mx-auto size-10 text-teal-700" />
        <h1 className="mt-3 text-2xl font-black">We could not load this content right now.</h1>
        <p className="mt-2 leading-7 text-slate-600">{message}</p>
        <button className="mt-5 rounded-full bg-slate-950 px-5 py-3 font-black text-white" onClick={onRetry}>Retry</button>
      </div>
    </main>
  )
}

function ScrollToTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 520)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          aria-label="Scroll to top"
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="fixed bottom-24 right-5 z-50 grid size-12 place-items-center rounded-full bg-teal-600 text-white shadow-[0_0_28px_rgba(13,148,136,.45)] ring-1 ring-white/40"
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.94 }}
        >
          <ArrowUp className="size-5" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

function SearchGroup({ children, title }: { children: ReactNode; title: string }) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-black uppercase tracking-[.14em] text-slate-500">{title}</h3>
      <div className="grid gap-2">{children}</div>
    </div>
  )
}

function PersonalizedHome({
  completed,
  content,
  dashboards,
  onOpenDashboard,
  subtopics,
}: {
  completed: string[]
  content: ContentItem[]
  dashboards: Dashboard[]
  onOpenDashboard: (id: string) => void
  subtopics: Subtopic[]
}) {
  const xp = getLocalXp()
  const recent = (JSON.parse(localStorage.getItem('nexagen:activity') ?? '[]') as Array<{ action: string; dashboard_id?: string }>).slice(0, 4)
  const nextDashboard = dashboards.find((dashboard) => {
    const slug = slugForDashboard(dashboard.title)
    return content.some((item) => (item.dashboard_id === dashboard.id || item.dashboard_id === slug) && !completed.includes(item.id))
  }) ?? dashboards[0]
  const weakAreas = [
    completed.length < Math.max(2, content.length * 0.15) ? 'Completion consistency' : 'Timed speed',
    programmingQuestions.length ? 'Algorithm explanation' : 'Problem solving',
    subtopics.length ? 'Subtopic review' : 'Topic recall',
  ]

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="rounded-[1.5rem] border border-slate-100 bg-white p-5 shadow-xl shadow-slate-200/60 md:p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[.16em] text-teal-700">Personalized dashboard</p>
            <h2 className="mt-2 text-3xl font-black">Continue Learning</h2>
            <p className="mt-3 leading-7 text-slate-600">Your home now reacts to progress, recent practice, and next useful steps.</p>
          </div>
          <div className="rounded-2xl bg-slate-950 px-5 py-4 text-white">
            <p className="text-sm font-bold text-slate-300">XP Level</p>
            <p className="text-3xl font-black">{xp.level}</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-4">
          <InfoPanel title="Recommended Next Topic" value={nextDashboard?.title ?? 'Explore NexaGen'} action="Open" onClick={() => nextDashboard && onOpenDashboard(nextDashboard.id)} />
          <InfoPanel title="Weak Areas" value={weakAreas.join(', ')} />
          <InfoPanel title="Recently Practiced" value={recent.length ? recent.map((item) => item.action.replaceAll('_', ' ')).join(', ') : 'Start one practice session'} />
          <InfoPanel title="Progress" value={`${completed.length}/${content.length || 0} Q&A complete`} />
        </div>
      </div>
    </section>
  )
}

function InfoPanel({ action, onClick, title, value }: { action?: string; onClick?: () => void; title: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-sm font-bold text-slate-500">{title}</p>
      <p className="mt-2 min-h-16 font-black leading-6 text-slate-900">{value}</p>
      {action && <button className="mt-3 rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:scale-[1.02] active:scale-95" onClick={onClick}>{action}</button>}
    </div>
  )
}

function DailyChallenge({ appUser, dashboards, onOpenDashboard }: { appUser: AppUser; dashboards: Dashboard[]; onOpenDashboard: (id: string) => void }) {
  const [claimed, setClaimed] = useState(localStorage.getItem('nexagen:daily-challenge') === new Date().toDateString())
  const [coins, setCoins] = useState<Array<{ id: number; left: number }>>([])
  const piano = dashboards.find((item) => item.title.toLowerCase().includes('piano'))
  const programming = dashboards.find((item) => item.title.toLowerCase().includes('programming'))

  const claim = async () => {
    localStorage.setItem('nexagen:daily-challenge', new Date().toDateString())
    setClaimed(true)
    setCoins(Array.from({ length: 9 }, (_, index) => ({ id: Date.now() + index, left: 16 + index * 8 })))
    playCoinSound()
    window.setTimeout(() => setCoins([]), 1100)
    await awardXp(appUser.user?.id, 35, 'daily challenge')
    await grantBadge(appUser.user?.id, 'Consistent Learner')
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="relative overflow-hidden rounded-[1.5rem] border border-teal-100 bg-teal-50 p-5 md:p-7">
        {coins.map((coin) => (
          <motion.span
            animate={{ opacity: [0, 1, 0], y: [20, -65, -95], scale: [0.7, 1, 0.85] }}
            className="pointer-events-none absolute bottom-6 grid size-6 place-items-center rounded-full bg-gradient-to-br from-amber-200 to-amber-500 text-xs font-black text-amber-950 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            key={coin.id}
            style={{ left: `${coin.left}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            +
          </motion.span>
        ))}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[.16em] text-teal-700">Daily Challenge</p>
            <h2 className="mt-2 flex items-center gap-2 text-3xl font-black"><Trophy className="size-7 text-amber-600" /> One piano task, one coding task</h2>
            <p className="mt-3 leading-7 text-slate-700">Play a C major chord progression, then solve one timed programming prompt. Bonus XP when both are done.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {piano && <button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-emerald-200" onClick={() => onOpenDashboard(piano.id)}>Piano Task</button>}
            {programming && <button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-emerald-200" onClick={() => onOpenDashboard(programming.id)}>Code Task</button>}
            <button className="inline-flex animate-pulse items-center gap-2 rounded-full bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 px-4 py-2 text-sm font-black text-amber-950 shadow-xl shadow-amber-300/60 disabled:animate-none disabled:opacity-70" disabled={claimed} onClick={claim}>
              <Flame className="size-4" />
              {claimed ? 'XP claimed' : '+35 XP'}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

function playCoinSound() {
  const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AudioContextClass) return
  const context = new AudioContextClass()
  ;[880, 1174, 1568].forEach((frequency, index) => {
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    oscillator.type = 'triangle'
    oscillator.frequency.value = frequency
    gain.gain.setValueAtTime(0.0001, context.currentTime + index * 0.06)
    gain.gain.exponentialRampToValueAtTime(0.18, context.currentTime + index * 0.06 + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + index * 0.06 + 0.16)
    oscillator.connect(gain)
    gain.connect(context.destination)
    oscillator.start(context.currentTime + index * 0.06)
    oscillator.stop(context.currentTime + index * 0.06 + 0.18)
  })
}

function FloatingLearningAssistant({ context }: { context: Parameters<typeof askLearningAssistant>[1] }) {
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [messages, setMessages] = useState<Array<{ from: 'assistant' | 'user'; text: string }>>([
    { from: 'assistant', text: 'Ask for a hint, a harder question, a simple explanation, or a quick test.' },
  ])
  const intents: AssistantIntent[] = ['Explain this simply', 'Give me a harder question', 'Give me a hint', 'Test me again', 'Summarize this topic']

  const ask = async (intent: AssistantIntent) => {
    setMessages((current) => [...current, { from: 'user', text: intent }])
    setBusy(true)
    const answer = await askLearningAssistant(intent, context)
    setMessages((current) => [...current, { from: 'assistant', text: answer }])
    setBusy(false)
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="mb-3 w-[min(92vw,380px)] rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-2xl"
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold uppercase tracking-[.16em] text-teal-700">NexaGen Assistant</p>
                <h3 className="font-black">{context.dashboard ?? 'Learning context'}</h3>
              </div>
              <button className="grid size-9 place-items-center rounded-full bg-slate-100" onClick={() => setOpen(false)}><X className="size-4" /></button>
            </div>
            <div className="max-h-72 space-y-2 overflow-auto rounded-2xl bg-slate-50 p-3">
              {messages.map((message, index) => (
                <div className={`rounded-2xl p-3 text-sm leading-6 ${message.from === 'assistant' ? 'bg-white text-slate-700' : 'bg-slate-950 text-white'}`} key={`${message.from}-${index}`}>
                  {message.text}
                </div>
              ))}
              {busy && <div className="rounded-2xl bg-white p-3 text-sm font-bold text-slate-500">Thinking...</div>}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {intents.map((intent) => (
                <button className="rounded-full bg-slate-100 px-3 py-2 text-xs font-black text-slate-700 transition hover:bg-teal-50 hover:text-teal-800 active:scale-95" key={intent} onClick={() => ask(intent)}>
                  {intent}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        className="grid size-14 place-items-center rounded-full bg-slate-950 text-white shadow-2xl transition hover:scale-105 active:scale-95"
        onClick={() => setOpen((value) => !value)}
      >
        <MessageCircle className="size-6" />
      </button>
    </div>
  )
}

function ExploreDashboards({
  dashboards,
  onSelected,
  selectedDashboard,
  unlocks,
}: {
  dashboards: Dashboard[]
  onSelected: (id: string) => void
  selectedDashboard?: Dashboard
  unlocks: string[]
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[.16em] text-teal-700">Explore Dashboards</p>
          <h2 className="mt-2 text-3xl font-black">Choose your learning room</h2>
        </div>
        <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm">No pricing section</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {dashboards.map((dashboard) => {
          const Icon = iconFor(dashboard.title)
          const isUnlocked = !dashboard.is_locked || unlocks.includes(dashboard.id)
          return (
            <button
              className={`min-h-40 rounded-2xl border bg-white p-4 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
                selectedDashboard?.id === dashboard.id ? 'border-teal-400 ring-4 ring-teal-100' : 'border-slate-100'
              }`}
              key={dashboard.id}
              onClick={() => onSelected(dashboard.id)}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="grid size-11 place-items-center rounded-2xl bg-slate-950 text-white">
                  <Icon className="size-5" />
                </span>
                <span className="text-xs font-black text-slate-500">{isUnlocked ? 'Open' : 'Locked'}</span>
              </div>
              <h3 className="mt-4 text-base font-black">{dashboard.title}</h3>
              <span className="mt-4 inline-flex rounded-full bg-slate-950 px-3 py-2 text-xs font-black text-white">Explore</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

function AnalyticsDashboard({
  completed,
  content,
  dashboards,
  onClose,
  subtopics,
}: {
  completed: string[]
  content: ContentItem[]
  dashboards: Dashboard[]
  onClose: () => void
  subtopics: Subtopic[]
}) {
  const { pianoState } = useNexaGenState()
  const activity = JSON.parse(localStorage.getItem('nexagen:activity') ?? '[]') as Array<{ action: string; created_at: string }>
  const programmingProgress = JSON.parse(localStorage.getItem('nexagen:programming-progress') ?? '[]') as Array<{ completed: boolean; time_taken: number }>
  const xp = getLocalXp()
  const badges = JSON.parse(localStorage.getItem('nexagen:badges') ?? '[]') as string[]
  const programmingAttempts = programmingProgress.length
  const programmingCompleted = programmingProgress.filter((row) => row.completed).length
  const dashboardRows = dashboards.map((dashboard) => {
    const dashboardSlug = slugForDashboard(dashboard.title)
    const items = content.filter((item) => item.dashboard_id === dashboard.id || item.dashboard_id === dashboardSlug)
    const done = items.filter((item) => completed.includes(item.id)).length
    return { name: dashboard.title.replace(' Dashboard', ''), completion: items.length ? Math.round((done / items.length) * 100) : 0 }
  })
  const subtopicRows = subtopics.slice(0, 10).map((subtopic, index) => ({
    name: subtopic.title.slice(0, 14),
    progress: completed.length ? Math.min(100, 20 + ((index * 13 + completed.length * 7) % 80)) : 0,
  }))
  const activityRows = Array.from({ length: 7 }, (_, index) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - index))
    const key = date.toISOString().slice(0, 10)
    return {
      day: date.toLocaleDateString(undefined, { weekday: 'short' }),
      actions: activity.filter((row) => row.created_at?.slice(0, 10) === key).length,
    }
  })
  const stats = [
    ['Q&A completed', completed.length],
    ['Piano level', pianoState.level ?? 'untested'],
    ['Tracked actions', activity.length],
    ['Dashboards', dashboards.length],
  ]
  const languagesUsed = JSON.parse(localStorage.getItem('nexagen:programming-languages-used') ?? '[]') as string[]
  const programmingStats = [
    ['Questions attempted', programmingAttempts],
    ['Success rate', programmingAttempts ? `${Math.round((programmingCompleted / programmingAttempts) * 100)}%` : '0%'],
    ['Avg time', programmingAttempts ? `${Math.round(programmingProgress.reduce((sum, row) => sum + row.time_taken, 0) / programmingAttempts)}s` : '0s'],
    ['Languages used', new Set(languagesUsed).size],
  ]
  const radarRows = [
    { skill: 'Rhythm', value: Math.min(100, 35 + activity.filter((row) => row.action === 'piano_interaction').length * 8) },
    { skill: 'Theory', value: Math.min(100, 25 + completed.length * 5) },
    { skill: 'Coding', value: Math.min(100, 25 + programmingCompleted * 18) },
    { skill: 'Problem solving', value: Math.min(100, 30 + programmingAttempts * 10) },
  ]

  return (
    <motion.div animate={{ opacity: 1 }} className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/35 p-4 backdrop-blur-sm" exit={{ opacity: 0 }} initial={{ opacity: 0 }}>
      <motion.section
        animate={{ y: 0, scale: 1 }}
        className="mx-auto my-6 w-full max-w-6xl rounded-[1.5rem] bg-white p-5 shadow-2xl md:p-7"
        exit={{ y: 20, scale: 0.98 }}
        initial={{ y: 20, scale: 0.98 }}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[.16em] text-teal-700">Analytics Dashboard</p>
            <h2 className="mt-2 text-3xl font-black">Progress insights</h2>
          </div>
          <button className="grid size-11 place-items-center rounded-full bg-slate-100" onClick={onClose}>
            <X className="size-5" />
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-4">
          {stats.map(([label, value]) => (
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4" key={label}>
              <p className="text-sm font-bold text-slate-500">{label}</p>
              <p className="mt-2 text-2xl font-black">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          {programmingStats.map(([label, value]) => (
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4" key={label}>
              <p className="text-sm font-bold text-blue-700">{label}</p>
              <p className="mt-2 text-2xl font-black">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
            <p className="text-sm font-bold text-amber-700">XP</p>
            <p className="mt-2 text-2xl font-black">{xp.xp} XP / Level {xp.level}</p>
          </div>
          <div className="rounded-2xl border border-amber-100 bg-white p-4">
            <p className="text-sm font-bold text-slate-500">Badges</p>
            <p className="mt-2 text-2xl font-black">{badges.length || 0}</p>
          </div>
          <div className="rounded-2xl border border-amber-100 bg-white p-4">
            <p className="text-sm font-bold text-slate-500">Accuracy Tracking</p>
            <p className="mt-2 text-2xl font-black">{programmingAttempts ? Math.round((programmingCompleted / programmingAttempts) * 100) : completed.length ? 100 : 0}%</p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <ChartCard title="Progress Overview">
            <ResponsiveContainer height={260} width="100%">
              <BarChart data={dashboardRows}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completion" fill="#0f766e" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title="Subtopic Progress">
            <ResponsiveContainer height={260} width="100%">
              <BarChart data={subtopicRows} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" tick={{ fontSize: 11 }} type="category" width={100} />
                <Tooltip />
                <Bar dataKey="progress" fill="#2563eb" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title="Activity Graph">
            <ResponsiveContainer height={260} width="100%">
              <LineChart data={activityRows}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line dataKey="actions" stroke="#0f766e" strokeWidth={3} type="monotone" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title="Completion Stats">
            <div className="grid h-[260px] place-items-center rounded-2xl bg-slate-50 text-center">
              <div>
                <p className="text-6xl font-black text-slate-950">{content.length ? Math.round((completed.length / content.length) * 100) : 0}%</p>
                <p className="mt-3 font-bold text-slate-500">{completed.length} of {content.length} Q&A items complete</p>
              </div>
            </div>
          </ChartCard>
          <ChartCard title="Skill Radar">
            <ResponsiveContainer height={260} width="100%">
              <RadarChart data={radarRows}>
                <PolarGrid />
                <PolarAngleAxis dataKey="skill" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar dataKey="value" fill="#0f766e" fillOpacity={0.35} stroke="#0f766e" strokeWidth={2} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title="Badges">
            <div className="grid min-h-[260px] content-start gap-3 rounded-2xl bg-slate-50 p-4">
              {(badges.length ? badges : ['Piano Starter', 'Code Warrior', 'Fast Thinker']).map((badge) => (
                <div className="flex items-center gap-3 rounded-2xl bg-white p-3 font-black" key={badge}>
                  <Medal className="size-5 text-amber-600" />
                  {badge}
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      </motion.section>
    </motion.div>
  )
}

function ChartCard({ children, title }: { children: ReactNode; title: string }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-lg font-black">{title}</h3>
      {children}
    </div>
  )
}

function SessionLockIn({ cards, onClose }: { cards: RevisionCard[]; onClose: () => void }) {
  return (
    <Modal onClose={onClose}>
      <p className="text-sm font-bold uppercase tracking-[.16em] text-teal-700">Smart learning loop</p>
      <h2 className="mt-2 text-2xl font-black">You are improving. Let us lock it in.</h2>
      <p className="mt-2 leading-7 text-slate-600">These revision prompts are scheduled for 1 hour, 1 day, and 3 days.</p>
      <div className="mt-5 grid gap-2">
        {cards.map((card, index) => (
          <div className={`rounded-2xl p-3 ${card.type === 'challenge' ? 'bg-amber-50 text-amber-900' : 'bg-slate-50 text-slate-700'}`} key={`${card.prompt}-${index}`}>
            <p className="font-black">{card.type === 'challenge' ? 'Challenge' : `Revision ${index + 1}`}</p>
            <p className="mt-1 text-sm font-semibold leading-6">{card.prompt}</p>
            <p className="mt-1 text-xs font-black uppercase tracking-[.12em] opacity-70">Review: {card.nextReview}</p>
          </div>
        ))}
      </div>
    </Modal>
  )
}

function SongLandingPlayer() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const timers = useRef<number[]>([])
  const song = practiceSongs[selectedIndex]

  const stop = () => {
    timers.current.forEach((timer) => window.clearTimeout(timer))
    timers.current = []
    setPlaying(false)
  }

  const playSong = (loop = false) => {
    stop()
    setPlaying(true)
    song.notes.forEach((noteName, index) => {
      const timer = window.setTimeout(() => {
        const note = pianoNotes.find((item) => item.note === noteName)
        setActiveStep(index)
        if (note) playSynthNote(note)
        if (index === song.notes.length - 1) {
          if (loop) {
            const loopTimer = window.setTimeout(() => playSong(true), 650)
            timers.current.push(loopTimer)
          } else {
            setPlaying(false)
          }
        }
      }, index * 430)
      timers.current.push(timer)
    })
  }

  useEffect(() => {
    const starter = window.setTimeout(() => playSong(false), 700)
    return () => {
      window.clearTimeout(starter)
      stop()
    }
  }, [])

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="rounded-[1.5rem] border border-slate-100 bg-white p-5 shadow-xl shadow-slate-200/60">
        <div className="grid gap-5 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[.16em] text-teal-700">Piano Keys Playback</p>
            <h2 className="mt-2 text-3xl font-black">{song.title}</h2>
            <p className="mt-3 leading-7 text-slate-600">
              {song.mood} song in {song.key}. Progression: <span className="font-black text-slate-900">{song.progression}</span>
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 font-bold text-white" onClick={() => playSong(true)}>
                {playing ? <Volume2 className="size-5" /> : <Play className="size-5" />}
                Continue
              </button>
              <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 font-bold text-slate-800" onClick={stop}>
                <Pause className="size-5" />
                Stop
              </button>
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-500">
              Browsers may wait for your first tap before allowing sound, so this player is ready the moment you interact.
            </p>
          </div>

          <div>
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
              {practiceSongs.map((item, index) => (
                <button
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-black ${selectedIndex === index ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700'}`}
                  key={item.title}
                  onClick={() => {
                    stop()
                    setSelectedIndex(index)
                    setActiveStep(0)
                  }}
                >
                  {item.mood}
                </button>
              ))}
            </div>
            <div className="flex min-h-20 items-center gap-2 overflow-x-auto rounded-2xl bg-slate-50 p-3">
              {song.notes.map((noteName, index) => (
                <span
                  className={`grid size-12 shrink-0 place-items-center rounded-xl text-sm font-black ${activeStep === index ? 'bg-teal-600 text-white' : 'bg-white text-slate-700'}`}
                  key={`${song.title}-${noteName}-${index}`}
                >
                  {noteName.replace('4', '')}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function SongPracticeLibrary() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[.16em] text-teal-700">Song-based learning</p>
          <h2 className="mt-2 text-3xl font-black">10 practice songs with progressions</h2>
        </div>
        <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm">
          Sad, happy, calm, gospel, jazz
        </span>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {practiceSongs.map((song) => (
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm" key={song.title}>
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h3 className="font-black">{song.title}</h3>
                <p className="mt-1 text-sm font-bold text-teal-700">{song.mood} - {song.level}</p>
              </div>
              <Music2 className="size-5 shrink-0 text-slate-500" />
            </div>
            <p className="rounded-xl bg-slate-50 px-3 py-2 text-sm font-black text-slate-700">{song.progression}</p>
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">{song.lesson}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function SaasPricingSection({ subscription }: { subscription: UserSubscription | null }) {
  const activePlan = subscription ? `${subscription.plan.toUpperCase()} active until ${new Date(subscription.expires_at).toLocaleDateString()}` : 'Choose a plan before opening a dashboard'

  const plans = [
    {
      plan: 'starter' as const,
      name: 'Starter Pass',
      price: 'KES 100',
      accent: 'from-slate-300 via-slate-100 to-slate-500',
      icon: Medal,
      iconClass: 'text-slate-800',
      features: ['Access to 1 dashboard of choice', 'Full Q&A content', 'Practice environment', 'Progress tracking', 'Monthly new questions'],
    },
    {
      plan: 'pro' as const,
      name: 'Pro Access',
      price: 'KES 150',
      accent: 'from-amber-300 via-yellow-400 to-amber-600',
      icon: Crown,
      iconClass: 'text-amber-950',
      features: ['Access to all available dashboards', 'Unlimited Q&A', 'Full coding IDE access', 'Full piano practice environment', 'Priority access to new content', 'Monthly new challenges'],
    },
  ]

  return (
    <section className="mx-auto max-w-7xl px-4 py-16" id="pricing">
      <div className="mx-auto mb-10 max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[.16em] text-teal-700">SaaS Access</p>
          <h2 className="mt-2 text-3xl font-black">Simple monthly plans</h2>
          <p className="mt-3 leading-7 text-slate-600">New challenges every month. Endless questions. Continuous growth.</p>
        <span className="mt-5 inline-flex rounded-full border border-teal-100 bg-white px-4 py-2 text-sm font-black text-teal-800">{activePlan}</span>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {plans.map((item) => {
          const PlanIcon = item.icon
          return (
          <div className={`relative overflow-hidden rounded-[1.5rem] border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md ${item.plan === 'pro' ? 'border-amber-200' : 'border-slate-100'}`} key={item.name}>
            {item.plan === 'pro' && (
              <span className="pro-savings-badge absolute right-5 top-5 rounded-full px-3 py-1 text-xs font-black text-amber-900">
                Save KES 50 with Pro Access
              </span>
            )}
            <div className={`mb-5 grid size-14 place-items-center rounded-2xl bg-gradient-to-br ${item.accent} text-white shadow-sm`}>
              <PlanIcon className={`size-7 ${item.iconClass}`} />
            </div>
            <h3 className="text-2xl font-black">{item.name}</h3>
            <p className="mt-2 text-4xl font-black">{item.price}<span className="text-base font-bold text-slate-500"> / month</span></p>
            <div className="mt-5 grid gap-3">
              {item.features.map((feature) => (
                <span className="flex items-center gap-3 text-sm font-bold text-slate-700" key={feature}>
                  <CheckCircle2 className="size-5 text-teal-600" />
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )})}
      </div>
    </section>
  )
}

function LaunchTrustSections({ appUser }: { appUser: AppUser }) {
  const partners = [
    { name: 'Zeraki', description: 'Education technology solutions', image: '/zeraki.jpeg', proof: 'Learning ecosystem reference' },
    { name: 'W3Schools', description: 'Programming reference and tutorials', image: '/w3schools.jpeg', proof: 'Developer learning benchmark' },
    { name: 'IntaSend', description: 'Payment infrastructure', proof: 'Secure checkout readiness' },
    { name: 'NCI', description: 'Certification and training', proof: 'Training pathway support' },
    { name: 'TopHeights Electricals', description: 'Technical and engineering support partner', proof: 'Practical engineering collaboration' },
  ]
  const featuredPartners = partners.filter((partner) => partner.image)
  const supportPartners = partners.filter((partner) => !partner.image)

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-[.16em] text-teal-700">Certifications</p>
          <h2 className="mt-2 text-3xl font-black">Certifications Coming Soon</h2>
          <div className="mt-6 border-y border-teal-100 bg-teal-50/50 p-6 text-center">
            <BadgeCheck className="mx-auto size-14 text-teal-700" />
            <h3 className="mt-3 text-2xl font-black">NexaGen Certificate</h3>
            <p className="mt-2 text-sm font-bold text-slate-500">Official certifications are currently in development with our partners.</p>
          </div>
          <p className="mt-5 text-sm font-bold text-slate-700">NexaGen is a licensed business operating under registered compliance.</p>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-[.16em] text-teal-700">Partners and stakeholders</p>
          <h2 className="mt-2 text-3xl font-black">Built with launch credibility in mind</h2>
          <p className="mt-3 leading-7 text-slate-600">These references are shaped into the experience as credibility anchors: education, coding standards, payments, certification, and technical support.</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {featuredPartners.map((partner) => (
              <div className="group relative min-h-64 overflow-hidden rounded-[1.25rem] border border-slate-100 bg-slate-950 shadow-lg shadow-slate-200/60" key={partner.name}>
                <img alt={`${partner.name} trust reference`} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" src={partner.image} />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/68 to-slate-950/18" />
                <div className="relative flex h-full min-h-64 flex-col justify-end p-5 text-white">
                  <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3 py-2 text-xs font-black uppercase tracking-[.14em] backdrop-blur">
                    <BadgeCheck className="size-4 text-emerald-300" />
                    {partner.proof}
                  </span>
                  <h3 className="text-2xl font-black">{partner.name}</h3>
                  <p className="mt-2 text-sm font-bold leading-6 text-white/78">{partner.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {supportPartners.map((partner) => (
              <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-teal-200 hover:shadow-md" key={partner.name}>
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-slate-950 text-white">
                    <PartnerLogo name={partner.name} />
                  </span>
                  <h3 className="font-black">{partner.name}</h3>
                </div>
                <p className="mt-3 text-xs font-black uppercase tracking-[.12em] text-teal-700">{partner.proof}</p>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">{partner.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <ContactLaunchCard />
        <SupportLaunchCard />
        <RatingLaunchCard userId={appUser.user?.id} />
      </div>
    </section>
  )
}

function ContactLaunchCard() {
  const [form, setForm] = useState({ name: '', email: '', message: '', website: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const mountedAt = useRef(0)

  useEffect(() => {
    mountedAt.current = Date.now()
  }, [])

  const submit = async () => {
    if (form.website) return
    if (Date.now() - mountedAt.current < 1200) {
      setStatus('error')
      setMessage('Please try again in a moment.')
      return
    }
    if (!form.name.trim() || !/^\S+@\S+\.\S+$/.test(form.email) || !form.message.trim()) {
      setStatus('error')
      setMessage('Enter your name, a valid email, and a message.')
      return
    }
    setStatus('loading')
    setMessage('')
    try {
      await sendContactEmail({
        name: form.name,
        email: form.email,
        type: 'landing-contact',
        subject: 'NexaGen landing page contact',
        message: form.message,
      })
      setStatus('success')
      setMessage('Message sent. We will get back to you soon.')
      setForm({ name: '', email: '', message: '', website: '' })
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Could not send message right now.')
    }
  }

  return (
    <div className="rounded-[1.25rem] border border-slate-100 bg-white p-5 shadow-sm">
      <Mail className="size-7 text-teal-700" />
      <h3 className="mt-3 text-xl font-black">Contact NexaGen</h3>
      <a className="mt-4 flex items-center gap-2 rounded-2xl bg-teal-50 px-4 py-3 font-bold text-teal-800" href="https://wa.me/254719637416" rel="noreferrer" target="_blank">
        <MessageCircle className="size-5" />
        +254 719 637 416
      </a>
      <div className="mt-4 grid gap-3">
        <input className="hidden" onChange={(event) => setForm({ ...form, website: event.target.value })} tabIndex={-1} value={form.website} />
        <input className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-teal-400" onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Name" value={form.name} />
        <input className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-teal-400" onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="Email" value={form.email} />
        <textarea className="min-h-24 rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-teal-400" onChange={(event) => setForm({ ...form, message: event.target.value })} placeholder="Message" value={form.message} />
        <button className="premium-action px-5 py-3" disabled={status === 'loading'} onClick={() => void submit()}>
          {status === 'loading' ? <Sparkles className="size-4 animate-spin" /> : <Send className="size-4" />}
          {status === 'loading' ? 'Sending...' : 'Send'}
        </button>
        {message && (
          <p className={`rounded-2xl p-3 text-sm font-bold ${status === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  )
}

function SupportLaunchCard() {
  return (
    <div className="rounded-[1.25rem] border border-slate-100 bg-white p-5 shadow-sm">
      <Coffee className="size-7 text-amber-700" />
      <h3 className="mt-3 text-xl font-black">Support the Team</h3>
      <p className="mt-3 leading-7 text-slate-600">Buy the developers and engineers a coffee.</p>
      <button className="premium-action-alt mt-5 w-full px-5 py-3">Support Us</button>
      <div className="mt-6 rounded-2xl bg-slate-50 p-4">
        <HeartHandshake className="size-6 text-teal-700" />
        <h4 className="mt-2 font-black">Work With Us</h4>
        <button className="mt-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-800">Request Collaboration</button>
      </div>
    </div>
  )
}

function RatingLaunchCard({ userId }: { userId?: string }) {
  const [rating, setRating] = useState(5)
  const [feedback, setFeedback] = useState('')
  const [message, setMessage] = useState('')

  const save = async () => {
    try {
      await submitRating({ userId, rating, feedback })
      setMessage('Thank you. Your rating was saved.')
      setFeedback('')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not save rating.')
    }
  }

  return (
    <div className="rounded-[1.25rem] border border-slate-100 bg-white p-5 shadow-sm">
      <Star className="size-7 text-amber-500" />
      <h3 className="mt-3 text-xl font-black">Rate NexaGen</h3>
      <div className="mt-4 flex gap-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <button className={`grid size-10 place-items-center rounded-full ${value <= rating ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-400'}`} key={value} onClick={() => setRating(value)}>
            <Star className="size-5 fill-current" />
          </button>
        ))}
      </div>
      <textarea className="mt-4 min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-teal-400" onChange={(event) => setFeedback(event.target.value)} placeholder="Optional feedback" value={feedback} />
      <button className="mt-3 w-full rounded-full bg-slate-950 px-5 py-3 font-black text-white" onClick={save}>Save rating</button>
      {message && <p className="mt-3 rounded-2xl bg-slate-50 p-3 text-sm font-bold text-slate-600">{message}</p>}
    </div>
  )
}

function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const save = async () => {
    try {
      await subscribeNewsletter(email)
      setEmail('')
      setMessage('Subscribed. We will share dashboard updates soon.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not subscribe right now.')
    }
  }

  return (
    <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input className="min-w-0 flex-1 rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-teal-300" onChange={(event) => setEmail(event.target.value)} placeholder="Email for launch updates" value={email} />
        <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-3 text-sm font-black text-white" onClick={save}>
          <Mail className="size-4" />
          Subscribe
        </button>
      </div>
      {message && <p className="mt-2 text-xs font-bold text-slate-500">{message}</p>}
    </div>
  )
}

function ContentFeed() {
  const blocks = [
    ['Why Learn Piano?', 'Piano trains timing, pattern recognition, listening, and confidence. It is music plus problem-solving in a very honest machine.'],
    ['Why Programming Matters', 'Programming teaches you how to turn ideas into working systems, automate boring work, and understand the digital tools around you.'],
    ['How NexaGen Helps You', 'You learn in dashboards, test your level, practice with real interaction, and track progress inside small subtopics instead of giant locked walls.'],
    ['Student Journey Logs', 'A learner can begin with one key, one chord, or one shell command, then grow into repeatable practice habits with visible progress.'],
    ['Daily Insights', 'Small daily lessons compound. Ten focused minutes on scales or code logic beats one chaotic marathon every few weeks.'],
  ]

  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <div className="mb-10 text-center">
          <p className="text-sm font-bold uppercase tracking-[.16em] text-teal-700">Learning hub</p>
          <h2 className="mt-2 text-3xl font-black">A simpler path into practical learning</h2>
          <p className="mx-auto mt-3 max-w-2xl leading-7 text-slate-600">Start with the area that matters today, then move naturally into practice, progress, and deeper dashboard work.</p>
      </div>
      <div className="divide-y divide-slate-200 border-y border-slate-200">
        {blocks.map(([title, copy]) => (
          <details className="group py-5" key={title}>
            <summary className="flex items-center justify-between gap-4 text-left text-lg font-black transition hover:text-teal-700">
              {title}
              <ChevronDown className="size-5 shrink-0 transition group-open:rotate-180" />
            </summary>
            <p className="mt-3 max-w-3xl leading-7 text-slate-600">{copy}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

function ProgrammingValueSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-bold uppercase tracking-[.16em] text-teal-700">Why Learn Programming with NexaGen?</p>
        <h2 className="mt-2 text-3xl font-black">Practice like interviews are coming</h2>
      </div>
        <div className="mt-10 grid gap-6 md:grid-cols-4">
          {[
            ['Timed pressure', 'Reveal logic trains recall before comfort takes over.'],
            ['Real editor', 'Monaco gives a focused VS Code-style coding surface.'],
            ['Language range', 'Compare syntax and concepts across 20 languages.'],
            ['Progress loops', 'Attempts, completions, time, and language use feed analytics.'],
          ].map(([title, copy]) => (
            <div className="border-t border-slate-200 pt-5" key={title}>
              <h3 className="font-black">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p>
            </div>
          ))}
        </div>
    </section>
  )
}

function ValueSections() {
  return (
    <section className="border-y border-slate-200 bg-white px-4 py-16">
      <div className="mx-auto mb-10 max-w-3xl text-center">
        <p className="text-sm font-bold uppercase tracking-[.16em] text-teal-700">FAQ</p>
        <h2 className="mt-2 text-3xl font-black">Why NexaGen?</h2>
      </div>
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
        {[
          ['Why NexaGen?', 'Each paid subtopic is priced like a focused mini-class: clear Q&A, practice prompts, progress, and a path to the next skill.'],
          ['What You Gain', 'You get structured learning, real practice tools, level detection, PDF-ready content fields, and a library that can keep expanding.'],
          ['Real Outcomes', 'Understand all 12 keys, build code confidence, solve computer basics faster, and track what you have actually completed.'],
        ].map(([title, copy]) => (
          <div className="border-l-2 border-teal-200 pl-5" key={title}>
            <h3 className="text-xl font-black">{title}</h3>
            <p className="mt-3 leading-7 text-slate-600">{copy}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function HowItWorks({
  appUser,
  completed,
  content,
  dashboards,
  pianoLevel,
  subtopicUnlocks,
  subtopics,
  unlocks,
}: {
  appUser: AppUser
  completed: string[]
  content: ContentItem[]
  dashboards: Dashboard[]
  pianoLevel: SkillLevel | null
  subtopicUnlocks: string[]
  subtopics: Subtopic[]
  unlocks: string[]
}) {
  const unlockedDashboards = dashboards.filter((dashboard) => !dashboard.is_locked || unlocks.includes(dashboard.id)).length
  const unlockedSubtopics = TEST_MODE ? subtopics.length : subtopicUnlocks.length
  const completionPercent = content.length ? Math.round((completed.length / content.length) * 100) : 0
  const practiceSongsCount = practiceSongs.length
  const systemSteps = [
    {
      title: 'Unlock',
      icon: UnlockKeyhole,
      metric: `${unlockedDashboards}/${dashboards.length || 0}`,
      label: 'dashboards open',
      body:
        'NexaGen is moving from one big dashboard lock into granular access. A learner can unlock only the subtopic they need, test piano content in TEST_MODE, and later pay per learning unit without losing the wider map.',
      bullets: ['Dashboard access state', 'Subtopic-level unlocks', 'KES 100 pricing model', 'Future free bonus unlocks after milestones'],
    },
    {
      title: 'Learn',
      icon: BookOpen,
      metric: `${content.length}`,
      label: 'learning items',
      body:
        'Learning is split into readable Q&A, explanations, theory notes, PDFs, song context, visual maps, solfege, and level guidance. The system is not just showing content; it is organizing the learner by topic, level, and intent.',
      bullets: ['Theory and practical Q&A', 'Beginner to Pro level detection', 'PDF-ready resource slots', 'Visual Do-Re-Mi pattern maps'],
    },
    {
      title: 'Practice',
      icon: Volume2,
      metric: `${practiceSongsCount}`,
      label: 'song drills',
      body:
        'Practice is where NexaGen becomes alive. Learners can play the piano, follow guided note strips, repeat progressions, listen to moods, and connect every subtopic to the keyboard instead of only reading words.',
      bullets: ['Playable piano engine', 'Guided patterns', 'Happy, sad, calm and jazz songs', 'Subtopic-specific practice focus'],
    },
    {
      title: 'Progress',
      icon: CheckCircle2,
      metric: `${completionPercent}%`,
      label: 'completion',
      body:
        'Progress turns study into a visible journey. Signed-in learners can mark content complete, keep their piano level, track unlocked areas, and see how much of the library they have already converted into skill.',
      bullets: ['Completion percentage', 'Saved piano level', 'Unlocked learning library', 'Subtopic-by-subtopic learning history'],
    },
  ]

  const trackerRows = [
    ['Account mode', appUser.user ? 'Signed in' : 'Guest preview', appUser.user ? 'Progress saving enabled' : 'Sign in to save completion'],
    ['Piano level', pianoLevel ?? 'Not tested', 'Beginner, Intermediate, or Pro after the 10-question test'],
    ['Subtopics', `${unlockedSubtopics}/${subtopics.length || 0} available`, TEST_MODE ? 'TEST_MODE gives full access for review' : 'Unlocks are stored per subtopic'],
    ['Content progress', `${completed.length}/${content.length || 0} complete`, 'Marked Q&A items feed the completion percentage'],
  ]

  return (
    <section className="bg-slate-950 px-4 py-14 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[.16em] text-teal-300">Learning operating system</p>
            <h2 className="mt-3 max-w-3xl text-4xl font-black leading-tight md:text-5xl">How NexaGen Works</h2>
            <p className="mt-4 max-w-3xl leading-8 text-slate-300">
              NexaGen is a real learning system: it controls access, structures knowledge, creates practice paths,
              and turns every completed Q&A, piano drill, visual pattern, and song progression into trackable progress.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ['Dashboards', dashboards.length],
              ['Subtopics', subtopics.length],
              ['Q&A Items', content.length],
              ['Songs', practiceSongsCount],
            ].map(([label, value]) => (
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4" key={label}>
                <p className="text-3xl font-black">{value}</p>
                <p className="mt-1 text-sm font-bold text-slate-300">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-4 xl:grid-cols-4">
          {systemSteps.map((step, index) => {
            const Icon = step.icon
            return (
              <div className="rounded-2xl border border-white/10 bg-white p-5 text-slate-950 shadow-xl shadow-black/20" key={step.title}>
                <div className="flex items-start justify-between gap-3">
                  <span className="grid size-12 place-items-center rounded-2xl bg-slate-950 text-white">
                    <Icon className="size-5" />
                  </span>
                  <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-black text-teal-700">Step {index + 1}</span>
                </div>
                <h3 className="mt-5 text-2xl font-black">{step.title}</h3>
                <div className="mt-3 flex items-end gap-2">
                  <span className="text-4xl font-black">{step.metric}</span>
                  <span className="pb-1 text-sm font-bold text-slate-500">{step.label}</span>
                </div>
                <p className="mt-4 min-h-32 leading-7 text-slate-600">{step.body}</p>
                <div className="mt-5 grid gap-2">
                  {step.bullets.map((bullet) => (
                    <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700" key={bullet}>
                      <CheckCircle2 className="size-4 text-teal-600" />
                      {bullet}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1.05fr_.95fr]">
          <div className="rounded-2xl border border-white/10 bg-white p-5 text-slate-950 shadow-xl shadow-black/20">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[.16em] text-teal-700">Live learner tracker</p>
                <h3 className="mt-2 text-2xl font-black">System status</h3>
              </div>
              <span className="rounded-full bg-slate-950 px-4 py-2 text-sm font-black text-white">
                {TEST_MODE ? 'TEST_MODE active' : 'Payment mode'}
              </span>
            </div>
            <div className="mt-5 grid gap-3">
              {trackerRows.map(([label, value, detail]) => (
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4" key={label}>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h4 className="font-black">{label}</h4>
                    <span className="rounded-full bg-white px-3 py-1 text-sm font-black text-slate-700">{value}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white p-5 text-slate-950 shadow-xl shadow-black/20">
            <p className="text-sm font-bold uppercase tracking-[.16em] text-teal-700">Journey pipeline</p>
            <h3 className="mt-2 text-2xl font-black">From curiosity to skill</h3>
            <div className="mt-6 space-y-4">
              {[
                ['Pick a dashboard', 'Choose piano, music theory, programming, OS skills, or troubleshooting.'],
                ['Open a subtopic', 'Study one precise skill area without being overwhelmed by the whole library.'],
                ['Use the practice engine', 'Play patterns, songs, progressions, and guided notes until the concept becomes physical.'],
                ['Mark proof of work', 'Save completed Q&A and watch the tracker convert learning into visible progress.'],
              ].map(([title, detail], index) => (
                <div className="grid grid-cols-[auto_1fr] gap-3" key={title}>
                  <span className="grid size-10 place-items-center rounded-full bg-slate-950 text-sm font-black text-white">{index + 1}</span>
                  <div>
                    <h4 className="font-black">{title}</h4>
                    <p className="mt-1 leading-6 text-slate-500">{detail}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl bg-teal-50 p-4">
              <h4 className="font-black text-teal-900">What this means</h4>
              <p className="mt-2 leading-7 text-teal-800">
                Happy Learning
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function DashboardDetail({
  appUser,
  completed,
  dashboard,
  items,
  onCompletedChange,
  onPianoLevelChange,
  onProgrammingLevelChange,
  onSubtopicUnlock,
  onUnlock,
  pianoLevel,
  programmingLevel,
  progress,
  query,
  setQuery,
  subtopicUnlocks,
  subtopics,
  subscription,
  unlocks,
}: {
  appUser: AppUser
  completed: string[]
  dashboard: Dashboard
  items: ContentItem[]
  onCompletedChange: (ids: string[]) => void
  onPianoLevelChange: (level: SkillLevel) => Promise<void>
  onProgrammingLevelChange: (level: SkillLevel) => Promise<void>
  onSubtopicUnlock: (id: string) => void
  onUnlock: () => void
  pianoLevel: SkillLevel | null
  programmingLevel: SkillLevel | null
  progress: number
  query: string
  setQuery: (value: string) => void
  subtopicUnlocks: string[]
  subtopics: Subtopic[]
  subscription: UserSubscription | null
  unlocks: string[]
}) {
  const isUnlocked = !dashboard.is_locked || unlocks.includes(dashboard.id)
  const isPianoDashboard = slugForDashboard(dashboard.title) === 'piano-12-keys'
  const isProgrammingDashboard = dashboard.title.toLowerCase().includes('programming')
  const dashboardSubtopics = subtopics.filter((subtopic) => subtopic.dashboard_id === dashboard.id || subtopic.dashboard_id === 'piano-12-keys')
  const debouncedQuery = useDebouncedValue(query.toLowerCase())
  const visibleItems = items.filter((item) => `${item.title} ${item.body}`.toLowerCase().includes(debouncedQuery))

  const toggleCompleted = async (itemId: string) => {
    if (!appUser.user) return
    const nextCompleted = completed.includes(itemId) ? completed.filter((id) => id !== itemId) : [...completed, itemId]
    onCompletedChange(nextCompleted)
    await setContentCompleted(appUser.user.id, itemId, nextCompleted.includes(itemId))
    if (nextCompleted.includes(itemId)) {
      await trackUserActivity({ userId: appUser.user.id, action: 'question_completed', dashboardId: dashboard.id })
      await awardXp(appUser.user.id, 15, 'completed question')
      const cards = await scheduleRevisionLoop(appUser.user.id, itemId, dashboard.title)
      window.dispatchEvent(new CustomEvent('nexagen:revision-cards', { detail: cards }))
    }
  }

  if (!isUnlocked) {
    return (
      <article className="relative overflow-hidden rounded-[1.5rem] border border-amber-100 bg-white p-6 text-center shadow-xl shadow-slate-200/70">
        <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-amber-100 text-amber-700">
          <LockKeyhole className="size-8" />
        </div>
        <p className="mt-5 text-sm font-bold uppercase tracking-[.16em] text-teal-700">Subscription access</p>
        <h2 className="mt-2 text-3xl font-black">{dashboard.title}</h2>
        <p className="mx-auto mt-3 max-w-xl leading-7 text-slate-600">
          This dashboard now unlocks through Starter Pass or Pro Access. Payments are paused, so use the pricing section to activate a test subscription first.
        </p>
        <button className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 font-black text-white shadow-lg" onClick={onUnlock}>
          <CreditCard className="size-5" />
          View test access
        </button>
      </article>
    )
  }

  if (isPianoDashboard) {
    return (
      <PianoDashboard
        appUser={appUser}
        completed={completed}
        dashboard={dashboard}
        items={items}
        onCompletedChange={onCompletedChange}
        onPianoLevelChange={onPianoLevelChange}
        onSubtopicUnlock={onSubtopicUnlock}
        pianoLevel={pianoLevel}
        query={query}
        setQuery={setQuery}
        subtopicUnlocks={subtopicUnlocks}
        subtopics={dashboardSubtopics}
      />
    )
  }

  if (isProgrammingDashboard) {
    return (
      <ProgrammingDashboard
        appUser={appUser}
        dashboard={dashboard}
        onProgrammingLevelChange={onProgrammingLevelChange}
        programmingLevel={programmingLevel}
        subscription={subscription}
      />
    )
  }

  return (
    <article className="relative overflow-hidden rounded-[1.5rem] border border-slate-100 bg-white p-5 shadow-xl shadow-slate-200/70 md:p-7">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="mb-2 text-sm font-bold uppercase tracking-[.16em] text-teal-700">Dashboard detail</p>
          <h2 className="text-3xl font-black">{dashboard.title}</h2>
          <p className="mt-3 max-w-2xl leading-7 text-slate-600">{dashboard.description}</p>
        </div>
        {!isUnlocked && (
          <button className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 font-bold text-white shadow-lg" onClick={onUnlock}>
            <UnlockKeyhole className="size-5" />
            Unlock for KES {dashboard.price}
          </button>
        )}
      </div>

      <div className="mt-7 grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <div className="mb-2 flex justify-between text-sm font-bold text-slate-600">
            <span>Progress</span>
            <span>{appUser.user ? `${progress}%` : 'Guest mode'}</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-teal-500 transition-all" style={{ width: `${appUser.user ? progress : 0}%` }} />
          </div>
        </div>
        <label className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-3">
          <Search className="size-4 text-slate-500" />
          <input
            className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400 md:w-56"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search Q&A"
            value={query}
          />
        </label>
      </div>

      <div className={`mt-7 space-y-3 ${isUnlocked ? '' : 'select-none blur-[3px]'}`}>
        <PdfResource dashboard={dashboard} isUnlocked={isUnlocked} />
        {visibleItems.map((item) => (
          <QnaItem
            appUser={appUser}
            completed={completed.includes(item.id)}
            item={item}
            key={item.id}
            onToggle={() => toggleCompleted(item.id)}
          />
        ))}
        {!visibleItems.length && <EmptyState message="No content matched that search. Try a different keyword." />}
      </div>

      {!isUnlocked && (
        <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-amber-100 bg-white/90 p-5 text-center shadow-xl backdrop-blur">
          <LockKeyhole className="mx-auto mb-2 size-6 text-amber-600" />
          <p className="font-bold text-slate-900">This dashboard unlocks after backend-verified M-Pesa payment.</p>
          <p className="mt-1 text-sm text-slate-500">Guests must sign in before unlocking.</p>
        </div>
      )}
    </article>
  )
}

function PdfResource({ dashboard, isUnlocked }: { dashboard: Dashboard; isUnlocked: boolean }) {
  const pdfName = dashboard.title.includes('Programming') ? 'JavaScript Q&A PDF' : `${dashboard.title} Q&A PDF`

  return (
    <div className="rounded-2xl border border-teal-100 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-teal-50 text-teal-700">
            <FileText className="size-5" />
          </span>
          <div>
            <h3 className="font-black">{pdfName}</h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              View or download the unlocked questions and answers PDF.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            aria-disabled={!isUnlocked}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${
              isUnlocked ? 'bg-slate-950 text-white' : 'pointer-events-none bg-slate-100 text-slate-400'
            }`}
            href={defaultPdfPath}
            rel="noreferrer"
            target="_blank"
          >
            <Eye className="size-4" />
            View
          </a>
          <a
            aria-disabled={!isUnlocked}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${
              isUnlocked ? 'border border-slate-200 bg-white text-slate-800' : 'pointer-events-none bg-slate-100 text-slate-400'
            }`}
            download
            href={defaultPdfPath}
          >
            <Download className="size-4" />
            Download
          </a>
        </div>
      </div>
    </div>
  )
}

function ProgrammingDashboard({
  appUser,
  dashboard,
  onProgrammingLevelChange,
  programmingLevel,
  subscription,
}: {
  appUser: AppUser
  dashboard: Dashboard
  onProgrammingLevelChange: (level: SkillLevel) => Promise<void>
  programmingLevel: SkillLevel | null
  subscription: UserSubscription | null
}) {
  const [welcomeOpen, setWelcomeOpen] = useState(!programmingLevel)
  const [level, setLevel] = useState<SkillLevel>(programmingLevel ?? 'beginner')
  const allowedLanguageIds = useMemo(() => selectedLanguageIdsForSubscription(subscription), [subscription])
  const languageLimit = languageLimitForSubscription(subscription)
  const hasAllLanguages = allowedLanguageIds.length === programmingLanguages.length
  const initialLanguage = programmingLanguages.find((item) => allowedLanguageIds.includes(item.id)) ?? programmingLanguages[0]
  const [language, setLanguage] = useState<ProgrammingLanguage>(initialLanguage)
  const activeLanguage = allowedLanguageIds.includes(language.id) ? language : initialLanguage
  const [subtopic, setSubtopic] = useState<ProgrammingSubtopic>(programmingSubtopics[0])
  const [questionIndex, setQuestionIndex] = useState(0)
  const [expandedProgrammingSubtopicId, setExpandedProgrammingSubtopicId] = useState<string | null>(null)
  const [languageMessage, setLanguageMessage] = useState('')
  const workbenchRef = useRef<HTMLDivElement | null>(null)
  const activeQuestions = useMemo(() => {
    const exact = programmingQuestions.filter((item) => item.level === level && item.subtopicId === subtopic.id)
    const languageHasFullRotation = ['python', 'javascript', 'typescript'].includes(activeLanguage.id)
    if (exact.length && !languageHasFullRotation) return exact.slice(0, 1)
    return exact.length ? exact : programmingQuestions.filter((item) => item.level === level)
  }, [activeLanguage.id, level, subtopic.id])
  const question = activeQuestions[questionIndex] ?? activeQuestions[0] ?? programmingQuestions[0]
  const expandedProgrammingSubtopic = programmingSubtopics.find((item) => item.id === expandedProgrammingSubtopicId) ?? null
  const planLabel = !subscription
    ? 'No plan'
    : subscription.is_trial || subscription.plan === 'free_trial'
      ? 'Free trial'
      : subscription.plan === 'starter'
        ? 'Starter Pass'
        : 'Pro Access'
  const languageRule = hasAllLanguages
    ? 'Pro Access unlocks every language.'
    : languageLimit === 1
      ? 'Free trial unlocks only your chosen language. Upgrade to Starter for 10 languages or Pro for all.'
      : `Starter Pass allows ${languageLimit} languages. The remaining languages stay locked.`

  const moveQuestion = (direction: 1 | -1) => {
    setQuestionIndex((current) => {
      const total = activeQuestions.length || 1
      return (current + direction + total) % total
    })
  }

  const chooseLevel = async (nextLevel: SkillLevel) => {
    setLevel(nextLevel)
    setQuestionIndex(0)
    setWelcomeOpen(false)
    await onProgrammingLevelChange(nextLevel)
  }

  return (
    <article className="relative overflow-hidden rounded-[1.5rem] border border-slate-100 bg-white p-5 shadow-xl shadow-slate-200/70 md:p-7">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="mb-2 text-sm font-bold uppercase tracking-[.16em] text-teal-700">Premium programming dashboard</p>
          <h2 className="text-3xl font-black">{dashboard.title}</h2>
          <p className="mt-3 max-w-3xl leading-7 text-slate-600">
            Interview prep, real coding, language comparison, timers, explanations, and practical repetition in one focused workspace.
          </p>
        </div>
        <button className="rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white" onClick={() => setWelcomeOpen(true)}>
          Change level
        </button>
      </div>

      <section className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-4">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-xl font-black">Choose a language</h3>
            <p className="mt-1 text-sm font-semibold text-slate-500">{languageRule}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-white px-3 py-1 text-sm font-black text-slate-700">{level} mode</span>
            <span className="rounded-full bg-teal-700 px-3 py-1 text-sm font-black text-white">{planLabel}: {allowedLanguageIds.length}/{programmingLanguages.length}</span>
          </div>
        </div>
        {languageMessage && <p className="mb-4 rounded-2xl bg-amber-50 p-3 text-sm font-black text-amber-800">{languageMessage}</p>}
        <div className="grid max-h-[520px] gap-3 overflow-auto pr-1 sm:grid-cols-2 xl:grid-cols-5">
          {programmingLanguages.map((item) => {
            const selected = activeLanguage.id === item.id
            const locked = !allowedLanguageIds.includes(item.id)
            return (
            <button
              aria-pressed={selected}
              className={`rounded-2xl border bg-white p-4 text-left shadow-sm transition ${
                selected ? 'border-teal-400 ring-4 ring-teal-100' : locked ? 'border-slate-100 opacity-60' : 'border-slate-100 hover:border-teal-200'
              }`}
              key={item.id}
              onClick={() => {
                if (locked) {
                  setLanguageMessage('This language is locked on your current plan. See plans to unlock more languages.')
                  return
                }
                setLanguageMessage('')
                setLanguage(item)
                window.setTimeout(() => workbenchRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
              }}
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <span className="grid size-11 place-items-center rounded-2xl bg-white text-slate-950 shadow-sm ring-1 ring-slate-200">
                  <LanguageLogo language={item} />
                </span>
                <span className={`grid size-6 place-items-center rounded-md border text-xs font-black ${
                  selected ? 'border-teal-600 bg-teal-600 text-white' : locked ? 'border-slate-300 bg-slate-100 text-slate-400' : 'border-slate-300 bg-white text-slate-500'
                }`}>
                  {locked ? <LockKeyhole className="size-3" /> : selected ? <CheckCircle2 className="size-4" /> : ''}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-black">{item.name}</h4>
                <span className="text-xs font-black text-teal-700">{item.useCases[0]}</span>
              </div>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{item.description}</p>
              <p className="mt-3 text-xs font-bold text-slate-500">{locked ? 'Locked. See plans for more languages.' : item.frameworks.join(' / ')}</p>
            </button>
            )
          })}
        </div>
        <div className="mt-5 rounded-2xl border border-slate-100 bg-white p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[.16em] text-teal-700">{activeLanguage.name} learning feed</p>
              <h3 className="mt-1 text-2xl font-black">{activeLanguage.project}</h3>
              <p className="mt-2 max-w-4xl leading-7 text-slate-600">{activeLanguage.description}</p>
            </div>
            <span className="rounded-full bg-slate-950 px-4 py-2 text-sm font-black text-white">{activeLanguage.useCases.join(' / ')}</span>
          </div>
          <div className="mt-4 grid gap-3 lg:grid-cols-4">
            <div className="rounded-xl bg-slate-50 p-3">
              <h4 className="font-black">Strengths</h4>
              <ul className="mt-2 space-y-1 text-sm leading-6 text-slate-600">
                {activeLanguage.strengths.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <h4 className="font-black">Learn First</h4>
              <ul className="mt-2 space-y-1 text-sm leading-6 text-slate-600">
                {activeLanguage.learnFirst.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <h4 className="font-black">Avoid</h4>
              <ul className="mt-2 space-y-1 text-sm leading-6 text-slate-600">
                {activeLanguage.pitfalls.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
            <div className="rounded-xl bg-teal-50 p-3">
              <h4 className="font-black">Interview Focus</h4>
              <p className="mt-2 text-sm leading-6 text-slate-700">{activeLanguage.interviewFocus}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-teal-100 bg-teal-50 p-4" ref={workbenchRef}>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[.16em] text-teal-700">Active programming path</p>
            <h3 className="mt-1 text-2xl font-black">{activeLanguage.name} / {subtopic.title}</h3>
            <p className="mt-2 leading-7 text-slate-700">
              Pick a subtopic, solve the timed challenge, then reveal the answer and explanation when the lock expires.
            </p>
          </div>
          <span className="rounded-full bg-white px-4 py-2 text-sm font-black text-slate-700">{timerByLevel[level]}s timer</span>
        </div>
      </section>

      <section className="mt-4 grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
        <div className="rounded-2xl border border-slate-100 bg-white p-4">
          <h3 className="text-xl font-black">Subtopics</h3>
          <div className="mt-4 grid gap-2">
            {programmingSubtopics.map((item) => (
              <button
                className={`rounded-xl border p-3 text-left ${subtopic.id === item.id ? 'border-teal-300 bg-teal-50' : 'border-slate-100 bg-slate-50'}`}
                key={item.id}
                onClick={() => {
                  setSubtopic(item)
                  setLevel(item.level)
                  setQuestionIndex(0)
                  setExpandedProgrammingSubtopicId(item.id)
                }}
              >
                <span className="block font-black">{item.title}</span>
                <span className="text-xs font-bold uppercase tracking-[.12em] text-slate-500">{item.level}</span>
              </button>
            ))}
          </div>
        </div>
        <ProgrammingIde
          appUser={appUser}
          currentQuestion={Math.min(questionIndex + 1, activeQuestions.length || 1)}
          key={`${activeLanguage.id}-${level}-${question.id}`}
          language={activeLanguage}
          level={level}
          onMoveQuestion={moveQuestion}
          question={question}
          questionCount={activeQuestions.length || 1}
          subtopic={subtopic}
        />
      </section>

      <AnimatePresence>
        {expandedProgrammingSubtopic && (
          <motion.section
            animate={{ opacity: 1, y: 0 }}
            className="fixed inset-0 z-[80] overflow-y-auto bg-white text-slate-950"
            exit={{ opacity: 0, y: 20 }}
            initial={{ opacity: 0, y: 20 }}
          >
            <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
              <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[.18em] text-slate-500">Programming subtopic</p>
                  <h2 className="text-2xl font-black">{activeLanguage.name} / {expandedProgrammingSubtopic.title}</h2>
                </div>
                <button
                  aria-label="Close subtopic"
                  className="grid size-11 place-items-center rounded-full bg-black text-white"
                  onClick={() => setExpandedProgrammingSubtopicId(null)}
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>
            <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 xl:grid-cols-[360px_minmax(0,1fr)]">
              <aside className="space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <p className="text-sm font-bold uppercase tracking-[.16em] text-slate-500">{activeLanguage.name} feed</p>
                  <h3 className="mt-2 text-2xl font-black">{activeLanguage.project}</h3>
                  <p className="mt-3 leading-7 text-slate-700">{activeLanguage.description}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <h4 className="font-black">Learn First</h4>
                  <ul className="mt-3 space-y-2 text-sm font-semibold leading-6 text-slate-600">
                    {activeLanguage.learnFirst.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <h4 className="font-black">Avoid</h4>
                  <ul className="mt-3 space-y-2 text-sm font-semibold leading-6 text-slate-600">
                    {activeLanguage.pitfalls.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              </aside>
              <main>
                <ProgrammingIde
                  appUser={appUser}
                  currentQuestion={Math.min(questionIndex + 1, activeQuestions.length || 1)}
                  key={`fullscreen-${activeLanguage.id}-${level}-${question.id}`}
                  language={activeLanguage}
                  level={level}
                  onMoveQuestion={moveQuestion}
                  question={question}
                  questionCount={activeQuestions.length || 1}
                  subtopic={expandedProgrammingSubtopic}
                />
              </main>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <LanguageCompare level={level} />

      <AnimatePresence>
        {welcomeOpen && <ProgrammingWelcomeModal onChooseLevel={chooseLevel} onClose={() => setWelcomeOpen(false)} />}
      </AnimatePresence>
    </article>
  )
}

function ProgrammingWelcomeModal({
  onChooseLevel,
  onClose,
}: {
  onChooseLevel: (level: SkillLevel) => void
  onClose: () => void
}) {
  return (
    <Modal onClose={onClose}>
      <p className="text-sm font-bold uppercase tracking-[.16em] text-teal-700">Welcome to Programming</p>
      <h2 className="mt-2 text-3xl font-black">We will not just teach you. We will challenge you.</h2>
      <p className="mt-3 leading-7 text-slate-600">
        Solve real interview questions, write real code, compare languages, and build problem-solving instincts. By the end, you should be able to pass interviews, build projects, and think like a developer.
      </p>
      <div className="mt-5 grid gap-2">
        {[
          ['beginner', 'Simple syntax and logic', '30-60 sec'],
          ['intermediate', 'Problem solving and DS basics', '60-120 sec'],
          ['pro', 'Algorithms and system thinking', '2-5 min'],
        ].map(([value, copy, timer]) => (
          <button className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-left" key={value} onClick={() => onChooseLevel(value as SkillLevel)}>
            <span className="block text-lg font-black capitalize">{value}</span>
            <span className="mt-1 block text-sm font-semibold text-slate-600">{copy} - timer {timer}</span>
          </button>
        ))}
      </div>
    </Modal>
  )
}

function ProgrammingIde({
  appUser,
  currentQuestion,
  language,
  level,
  onMoveQuestion,
  question,
  questionCount,
  subtopic,
}: {
  appUser: AppUser
  currentQuestion: number
  language: ProgrammingLanguage
  level: SkillLevel
  onMoveQuestion: (direction: 1 | -1) => void
  question: ProgrammingQuestion
  questionCount: number
  subtopic: ProgrammingSubtopic
}) {
  const initialSeconds = timerByLevel[level]
  const [code, setCode] = useState(codeForLanguage(language.id, question.starter))
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds)
  const [revealed, setRevealed] = useState(false)
  const [output, setOutput] = useState('Console ready. Run code when you are ready.')
  const [executionStatus, setExecutionStatus] = useState<Judge0Result['status'] | 'idle' | 'running'>(judge0Configured() ? 'idle' : 'error')
  const [executionLabel, setExecutionLabel] = useState(judge0Configured() ? 'Ready' : 'Runner offline')
  const [hintOpen, setHintOpen] = useState(false)

  useEffect(() => {
    if (revealed) return
    const timer = window.setInterval(() => {
      setSecondsLeft((value) => {
        if (value <= 1) {
          window.clearInterval(timer)
          setRevealed(true)
          return 0
        }
        return value - 1
      })
    }, 1000)
    return () => window.clearInterval(timer)
  }, [revealed, question.id])

  const runCode = async () => {
    rememberProgrammingLanguage(language.name)
    await trackUserActivity({ userId: appUser.user?.id, action: 'programming_question_attempted' })
    setExecutionStatus('running')
    setExecutionLabel('Running code')
    setOutput('Submitting code to Judge0...')
    const result = await executeJudge0(language, code)
    setExecutionStatus(result.status)
    setExecutionLabel(result.statusText)
    setOutput(result.output)
  }

  const complete = async () => {
    rememberProgrammingLanguage(language.name)
    const timeTaken = initialSeconds - secondsLeft
    setRevealed(true)
    await saveProgrammingProgress({ userId: appUser.user?.id, questionId: question.id, completed: true, timeTaken })
    await trackUserActivity({ userId: appUser.user?.id, action: 'programming_question_completed', subtopicId: subtopic.id })
    await awardXp(appUser.user?.id, secondsLeft > initialSeconds * 0.35 ? 30 : 20, 'programming challenge')
    await grantBadge(appUser.user?.id, secondsLeft > initialSeconds * 0.35 ? 'Fast Thinker' : 'Code Warrior')
    const cards = await scheduleRevisionLoop(appUser.user?.id, question.id, subtopic.title)
    window.dispatchEvent(new CustomEvent('nexagen:revision-cards', { detail: cards }))
  }

  const reset = () => {
    setCode(codeForLanguage(language.id, question.starter))
    setSecondsLeft(initialSeconds)
    setRevealed(false)
    setHintOpen(false)
    setExecutionStatus(judge0Configured() ? 'idle' : 'error')
    setExecutionLabel(judge0Configured() ? 'Ready' : 'Runner offline')
    setOutput('Reset complete. Timer restarted.')
  }

  const explanation = buildCodeExplanation(code, language.name)

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4" onContextMenu={(event) => event.preventDefault()} onPaste={(event) => {
      if (!revealed) event.preventDefault()
    }}>
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[.16em] text-teal-700">{language.name} / {subtopic.title}</p>
          <h3 className="mt-1 text-xl font-black">{question.question}</h3>
          <p className="mt-2 text-sm font-bold text-slate-500">Challenge {currentQuestion} of {questionCount}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-sm font-black ${revealed ? 'bg-teal-50 text-teal-700' : 'bg-amber-50 text-amber-700'}`}>
          {revealed ? 'Answer unlocked' : `${secondsLeft}s locked`}
        </span>
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <CodeEditor height="clamp(320px, 55vh, 520px)" language={language.monaco} onChange={(value) => setCode(value ?? '')} value={code} options={{ minimap: { enabled: false }, fontSize: 14, wordWrap: 'on' }} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button className="premium-action px-4 py-2 text-sm" disabled={executionStatus === 'running'} onClick={runCode}>
          {executionStatus === 'running' ? <Sparkles className="size-4 animate-spin" /> : <Play className="size-4" />}
          {executionStatus === 'running' ? 'Executing...' : 'Run Code'}
        </button>
        <button className="premium-outline-button px-4 py-2 text-sm" onClick={reset}>Try Again</button>
        <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700" onClick={() => setHintOpen(!hintOpen)}>Show Hint</button>
        <button className="ripple rounded-full bg-teal-700 px-4 py-2 text-sm font-bold text-white" onClick={complete}>Start Challenge</button>
        <button className="premium-outline-button px-4 py-2 text-sm" onClick={() => onMoveQuestion(-1)}>Previous</button>
        <button className="premium-action-alt px-4 py-2 text-sm" onClick={() => onMoveQuestion(1)}>Next</button>
      </div>
      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-xl shadow-slate-950/20">
        <div className="flex flex-col gap-2 border-b border-white/10 px-4 py-3 text-xs font-black uppercase tracking-[.14em] text-slate-300 sm:flex-row sm:items-center sm:justify-between">
          <span className="inline-flex items-center gap-2">
            <Terminal className="size-4 text-cyan-300" />
            Execution Terminal
          </span>
          <span className={`rounded-full px-3 py-1 ${
            executionStatus === 'success' ? 'bg-emerald-400/15 text-emerald-200'
              : executionStatus === 'running' ? 'bg-cyan-400/15 text-cyan-200'
                : executionStatus === 'idle' ? 'bg-white/10 text-slate-200'
                  : 'bg-rose-400/15 text-rose-200'
          }`}>
            {executionLabel}
          </span>
        </div>
        <pre className="min-h-28 whitespace-pre-wrap p-4 font-mono text-sm leading-6 text-slate-100">{output}</pre>
      </div>
      {hintOpen && <p className="mt-3 rounded-2xl bg-amber-50 p-4 font-semibold leading-7 text-amber-900">{question.hint}</p>}
      {revealed && (
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4">
            <h4 className="font-black">Correct solution</h4>
            <pre className="mt-3 max-h-72 overflow-auto rounded-xl bg-slate-950 p-4 text-sm text-white">{codeForLanguage(language.id, question.answer)}</pre>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <h4 className="font-black">AI-assisted explanation</h4>
            <p className="mt-3 leading-7 text-slate-600">{question.explanation}</p>
            <p className="mt-3 leading-7 text-slate-600">{explanation}</p>
            <p className="mt-3 font-bold text-teal-700">Improvement suggestion: name variables for intent, handle edge cases, and mention time complexity during interviews.</p>
          </div>
        </div>
      )}
    </div>
  )
}

function LanguageCompare({ level }: { level: SkillLevel }) {
  const [left, setLeft] = useState(programmingLanguages[0])
  const [right, setRight] = useState(programmingLanguages[1])
  const [revealed, setRevealed] = useState(false)
  const sample = programmingQuestions.find((item) => item.level === level) ?? programmingQuestions[0]

  return (
    <section className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[.16em] text-teal-700">Compare Languages</p>
          <h3 className="text-xl font-black">Same idea, two syntaxes</h3>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <select className="rounded-xl border border-slate-200 px-3 py-2 font-bold" onChange={(event) => setLeft(programmingLanguages.find((item) => item.id === event.target.value) ?? left)} value={left.id}>
            {programmingLanguages.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
          <select className="rounded-xl border border-slate-200 px-3 py-2 font-bold" onChange={(event) => setRight(programmingLanguages.find((item) => item.id === event.target.value) ?? right)} value={right.id}>
            {programmingLanguages.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </div>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {[left, right].map((language) => (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white" key={language.id}>
            <div className="flex items-center justify-between bg-white px-4 py-3">
              <h4 className="font-black">{language.name}</h4>
              <span className="text-xs font-bold text-slate-500">Hello, variables, loops, functions, OOP</span>
            </div>
            <CodeEditor height="260px" language={language.monaco} defaultValue={codeForLanguage(language.id, sample.starter)} options={{ minimap: { enabled: false }, fontSize: 13 }} />
          </div>
        ))}
      </div>
      <button className="mt-4 rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white" onClick={() => setRevealed(true)}>Reveal comparison</button>
      {revealed && (
        <div className="mt-4 rounded-2xl bg-white p-4">
          <h4 className="font-black">Correct solutions and differences</h4>
          <p className="mt-3 leading-7 text-slate-600">
            {left.name} and {right.name} can solve the same problem, but they differ in type strictness, standard library style, runtime model, and how much ceremony is required. In interviews, explain the algorithm first, then translate it into the language’s idioms.
          </p>
        </div>
      )}
    </section>
  )
}

function buildCodeExplanation(code: string, language: string) {
  const lineCount = code.split('\n').filter(Boolean).length
  if (!code.trim()) return `No ${language} code yet. Start with the function shape, then add one small decision at a time.`
  return `Your ${language} code currently has ${lineCount} meaningful lines. Read it top to bottom: define inputs, store working state, loop or branch, then return a result. Runtime errors usually come from missing variables, wrong types, or returning too early.`
}

function CodeEditor(props: {
  defaultValue?: string
  height: string
  language: string
  onChange?: (value?: string) => void
  options?: Record<string, unknown>
  value?: string
}) {
  return (
    <Suspense fallback={<div className="skeleton grid h-[260px] place-items-center rounded-2xl bg-slate-950 font-bold text-white">Loading editor...</div>}>
      <Editor {...props} theme="vs-dark" />
    </Suspense>
  )
}

function rememberProgrammingLanguage(language: string) {
  const current = JSON.parse(localStorage.getItem('nexagen:programming-languages-used') ?? '[]') as string[]
  localStorage.setItem('nexagen:programming-languages-used', JSON.stringify(Array.from(new Set([language, ...current])).slice(0, 20)))
}

const levelQuestions = [
  ['Which note comes after C on white keys?', 'D', 'The white-key alphabet moves C, D, E, F, G, A, B, then repeats.'],
  ['How many unique piano keys are in one octave?', '12', 'Seven white keys plus five black keys give the full 12-key map.'],
  ['What is a semitone?', 'The smallest step on the piano', 'Move to the very next key, white or black. That is one semitone.'],
  ['What notes form C major?', 'C E G', 'A major triad uses root, major third, and perfect fifth.'],
  ['What changes a major chord into minor?', 'Flatten the third', 'C major is C E G. C minor is C Eb G. Small shift, big mood.'],
  ['What is an inversion?', 'Same chord, different bass note', 'Inversions keep the chord notes but rearrange their order.'],
  ['What is the I-IV-V progression in C?', 'C F G', 'Those are the first, fourth, and fifth scale-degree chords in C major.'],
  ['What does ear training improve?', 'Recognizing notes and patterns by sound', 'Your ear starts predicting where the music wants to go.'],
  ['What is sight reading?', 'Playing from written music', 'You turn notation into sound in real time. Calmly, ideally.'],
  ['What does transposing mean?', 'Moving music to another key', 'Same musical idea, new starting note.'],
]

const solfegeSteps = [
  ['Do', 'C', 'Home'],
  ['Re', 'D', 'Lift'],
  ['Mi', 'E', 'Bright'],
  ['Fa', 'F', 'Lean'],
  ['Sol', 'G', 'Open'],
  ['La', 'A', 'Warm'],
  ['Ti', 'B', 'Pull'],
  ['Do', 'C', 'Resolve'],
]

const visualProfiles = [
  {
    match: ['Basics', 'Keys'],
    color: 'bg-teal-500',
    pattern: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C4'],
    formula: 'Do Re Mi Fa Sol La Ti Do',
    focus: 'See the keyboard as repeating neighborhoods: white notes name the street, black notes show the shortcuts.',
  },
  {
    match: ['Major Scales', 'Scales Practice'],
    color: 'bg-sky-500',
    pattern: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C4'],
    formula: 'W W H W W W H',
    focus: 'Major scales move by whole and half steps. The pattern stays the same even when the starting note changes.',
  },
  {
    match: ['Minor Scales'],
    color: 'bg-indigo-500',
    pattern: ['A4', 'B4', 'C4', 'D4', 'E4', 'F4', 'G4', 'A4'],
    formula: 'W H W W H W W',
    focus: 'Minor color comes from the lowered third. Listen for the softer center before trying to play fast.',
  },
  {
    match: ['Chords (Major)', 'Harmony'],
    color: 'bg-emerald-500',
    pattern: ['C4', 'E4', 'G4', 'C4'],
    formula: '1 3 5',
    focus: 'Major chords stack root, third, and fifth. Play broken first, then together.',
  },
  {
    match: ['Chords (Minor)'],
    color: 'bg-violet-500',
    pattern: ['C4', 'D#4', 'G4', 'C4'],
    formula: '1 b3 5',
    focus: 'Minor chords keep the fifth but lower the third. That one note changes the entire emotional color.',
  },
  {
    match: ['Progressions', 'Improvisation', 'Playing by Ear', 'Song Practice'],
    color: 'bg-amber-500',
    pattern: ['C4', 'F4', 'G4', 'C4'],
    formula: 'I IV V I',
    focus: 'Progressions are musical gravity. Hear home, movement, tension, and return.',
  },
  {
    match: ['Ear Training', 'Sight Reading', 'Performance'],
    color: 'bg-rose-500',
    pattern: ['C4', 'E4', 'D4', 'F4', 'E4', 'G4'],
    formula: 'Hear -> Name -> Play',
    focus: 'Train the loop: hear a shape, name it, then confirm it on the piano.',
  },
  {
    match: ['Finger', 'Rhythm', 'Arpeggios'],
    color: 'bg-cyan-500',
    pattern: ['C4', 'E4', 'G4', 'E4', 'C4'],
    formula: 'Slow -> Even -> Relaxed',
    focus: 'Technique is motion quality. Stay relaxed, keep timing even, and let speed arrive later.',
  },
]

const visualProfileFor = (title = '') => {
  return visualProfiles.find((profile) => profile.match.some((word) => title.includes(word))) ?? visualProfiles[0]
}

function PianoDashboard({
  appUser,
  completed,
  dashboard,
  items,
  onCompletedChange,
  onPianoLevelChange,
  onSubtopicUnlock,
  pianoLevel,
  query,
  setQuery,
  subtopicUnlocks,
  subtopics,
}: {
  appUser: AppUser
  completed: string[]
  dashboard: Dashboard
  items: ContentItem[]
  onCompletedChange: (ids: string[]) => void
  onPianoLevelChange: (level: SkillLevel) => Promise<void>
  onSubtopicUnlock: (id: string) => void
  pianoLevel: SkillLevel | null
  query: string
  setQuery: (value: string) => void
  subtopicUnlocks: string[]
  subtopics: Subtopic[]
}) {
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [selectedSubtopicId, setSelectedSubtopicId] = useState(subtopics[0]?.id ?? '')
  const [expandedSubtopicId, setExpandedSubtopicId] = useState<string | null>(null)
  const selectedSubtopic = subtopics.find((subtopic) => subtopic.id === selectedSubtopicId) ?? subtopics[0]
  const expandedSubtopic = subtopics.find((subtopic) => subtopic.id === expandedSubtopicId) ?? null
  const visualProfile = visualProfileFor(selectedSubtopic?.title)
  const selectedItems = items
    .filter((item) => item.subtopic_id === selectedSubtopic?.id)
    .filter((item) => `${item.title} ${item.body}`.toLowerCase().includes(query.toLowerCase()))
  const expandedItems = expandedSubtopic ? items.filter((item) => item.subtopic_id === expandedSubtopic.id) : []
  const selectedCompleted = selectedItems.filter((item) => completed.includes(item.id)).length
  const subtopicProgress = selectedItems.length ? Math.round((selectedCompleted / selectedItems.length) * 100) : 0

  const scoreTest = async () => {
    const score = levelQuestions.reduce((total, [, answer], index) => {
      return answers[index]?.trim().toLowerCase() === answer.toLowerCase() ? total + 1 : total
    }, 0)
    const level: SkillLevel = score <= 3 ? 'beginner' : score <= 7 ? 'intermediate' : 'pro'
    await onPianoLevelChange(level)
  }

  const unlock = async (subtopicId: string) => {
    const unlockedId = await unlockSubtopicForTest(appUser.user?.id, subtopicId)
    onSubtopicUnlock(unlockedId)
  }

  const toggleCompleted = async (itemId: string) => {
    if (!appUser.user) return
    const nextCompleted = completed.includes(itemId) ? completed.filter((id) => id !== itemId) : [...completed, itemId]
    onCompletedChange(nextCompleted)
    await setContentCompleted(appUser.user.id, itemId, nextCompleted.includes(itemId))
    if (nextCompleted.includes(itemId)) {
      await trackUserActivity({ userId: appUser.user.id, action: 'question_completed', dashboardId: dashboard.id, subtopicId: selectedSubtopic?.id })
      await awardXp(appUser.user.id, 15, 'completed piano question')
      await grantBadge(appUser.user.id, 'Piano Starter')
      const cards = await scheduleRevisionLoop(appUser.user.id, itemId, selectedSubtopic?.title ?? dashboard.title)
      window.dispatchEvent(new CustomEvent('nexagen:revision-cards', { detail: cards }))
    }
  }

  return (
    <>
    <article className="relative overflow-hidden rounded-[1.5rem] border border-slate-100 bg-white p-5 shadow-xl shadow-slate-200/70 md:p-7">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="mb-2 text-sm font-bold uppercase tracking-[.16em] text-teal-700">Advanced piano dashboard</p>
          <h2 className="text-3xl font-black">{dashboard.title}</h2>
          <p className="mt-3 max-w-3xl leading-7 text-slate-600">
            Think piano is hard? Not here. You will understand all 12 keys, play instead of only reading, and train your ear with a dashboard that lets you test every subtopic before paid unlocking goes live.
          </p>
        </div>
        <div className="rounded-2xl border border-teal-100 bg-teal-50 p-4 text-sm font-bold text-teal-800">
          {TEST_MODE ? 'TEST_MODE: every piano subtopic is available' : 'Subtopics unlock individually'}
        </div>
      </div>

      <div className="mt-7 grid gap-4 lg:grid-cols-[1fr_.9fr]">
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-black">Piano instincts test</h3>
              <p className="mt-1 text-sm text-slate-500">10 questions detect Beginner, Intermediate, or Pro.</p>
            </div>
            <span className="rounded-full bg-white px-3 py-1 text-sm font-black text-slate-700">{pianoLevel ?? 'untested'}</span>
          </div>
          <div className="grid max-h-80 gap-3 overflow-auto pr-1">
            {levelQuestions.map(([question, answer, explanation], index) => (
              <details className="rounded-xl bg-white p-3" key={question}>
                <summary className="font-bold">{index + 1}. {question}</summary>
                <input
                  className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-400"
                  onChange={(event) => setAnswers((current) => ({ ...current, [index]: event.target.value }))}
                  placeholder="Your answer"
                  value={answers[index] ?? ''}
                />
                <p className="mt-2 text-sm text-slate-500">Answer: {answer}. {explanation}</p>
              </details>
            ))}
          </div>
          <button className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 font-bold text-white" onClick={scoreTest}>
            <CheckCircle2 className="size-5" />
            Score level
          </button>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-4">
          <div className="mb-4 flex items-center gap-2">
            <Volume2 className="size-5 text-teal-700" />
            <h3 className="text-xl font-black">Practice piano</h3>
          </div>
          <PianoEngine guidedNotes={visualProfile.pattern} practiceTitle={selectedSubtopic?.title ?? 'Piano practice'} />
        </div>
      </div>

      <section className="mt-7 rounded-2xl border border-slate-100 bg-slate-50 p-4">
        <h3 className="text-xl font-black">Free piano theory</h3>
        <p className="mt-2 leading-7 text-slate-600">
          The piano evolved from earlier keyboard instruments into acoustic grands, uprights, digital pianos, stage keyboards, and MIDI controllers. Its 12-key repeating layout makes harmony visible, which is why it remains one of the clearest tools for learning music.
        </p>
      </section>

      <div className="mt-7 grid gap-5 lg:grid-cols-[.85fr_1.15fr]">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-xl font-black">20 piano subtopics</h3>
            <span className="text-sm font-bold text-slate-500">KES 100 each after test mode</span>
          </div>
          <div className="grid max-h-[620px] gap-3 overflow-auto pr-1">
            {subtopics.map((subtopic) => {
              const isUnlocked = TEST_MODE || subtopicUnlocks.includes(subtopic.id)
              return (
                <button
                  className={`rounded-2xl border bg-white p-4 text-left shadow-sm ${selectedSubtopic?.id === subtopic.id ? 'border-teal-400 ring-4 ring-teal-100' : 'border-slate-100'}`}
                  key={subtopic.id}
                  onClick={() => {
                    setSelectedSubtopicId(subtopic.id)
                    setExpandedSubtopicId(subtopic.id)
                    void trackUserActivity({ userId: appUser.user?.id, action: 'subtopic_opened', dashboardId: dashboard.id, subtopicId: subtopic.id })
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-black">{subtopic.title}</h4>
                      <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">{subtopic.description}</p>
                    </div>
                    {isUnlocked ? <UnlockKeyhole className="size-5 text-teal-700" /> : <LockKeyhole className="size-5 text-amber-600" />}
                  </div>
                  {!isUnlocked && (
                    <span className="mt-3 inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-700" onClick={() => unlock(subtopic.id)}>
                      Unlock inside subtopic
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[.16em] text-teal-700">Practice mode</p>
              <h3 className="text-2xl font-black">{selectedSubtopic?.title}</h3>
            </div>
            <label className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-3">
              <Search className="size-4 text-slate-500" />
              <input className="w-full bg-transparent text-sm font-semibold outline-none md:w-52" onChange={(event) => setQuery(event.target.value)} placeholder="Search this subtopic" value={query} />
            </label>
          </div>
          <div className="mt-5">
            <div className="mb-2 flex justify-between text-sm font-bold text-slate-600">
              <span>Completion</span>
              <span>{appUser.user ? `${subtopicProgress}%` : 'Sign in to save'}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-teal-500 transition-all" style={{ width: `${appUser.user ? subtopicProgress : 0}%` }} />
            </div>
          </div>
          <VisualPracticeLab profile={visualProfile} subtopicTitle={selectedSubtopic?.title ?? 'Piano practice'} />
          <SongPracticeCoach />
          <FindYourSong />
          <div className="mt-5 space-y-3">
            <PdfResource dashboard={{ ...dashboard, title: selectedSubtopic?.title ?? dashboard.title }} isUnlocked />
            {selectedItems.map((item) => (
              <QnaItem appUser={appUser} completed={completed.includes(item.id)} item={item} key={item.id} onToggle={() => toggleCompleted(item.id)} />
            ))}
            {!selectedItems.length && <EmptyState message="No cards match this subtopic search yet." />}
          </div>
        </div>
      </div>
    </article>
    <AnimatePresence>
      {expandedSubtopic && (
        <motion.section
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-0 z-[80] overflow-y-auto bg-white text-slate-950"
          exit={{ opacity: 0, y: 20 }}
          initial={{ opacity: 0, y: 20 }}
        >
          <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[.18em] text-slate-500">Piano subtopic</p>
                <h2 className="text-2xl font-black">{expandedSubtopic.title}</h2>
              </div>
              <button
                aria-label="Close subtopic"
                className="grid size-11 place-items-center rounded-full bg-black text-white"
                onClick={() => setExpandedSubtopicId(null)}
              >
                <X className="size-5" />
              </button>
            </div>
          </div>
          <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 xl:grid-cols-[.85fr_1.15fr]">
            <aside className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-sm font-bold uppercase tracking-[.16em] text-slate-500">Description</p>
                <p className="mt-3 leading-7 text-slate-700">{expandedSubtopic.description}</p>
              </div>
              <VisualPracticeLab profile={visualProfileFor(expandedSubtopic.title)} subtopicTitle={expandedSubtopic.title} />
              <PdfResource dashboard={{ ...dashboard, title: expandedSubtopic.title }} isUnlocked />
            </aside>
            <main>
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[.16em] text-slate-500">Full Content</p>
                  <h3 className="text-3xl font-black">{expandedItems.length} learning cards</h3>
                </div>
                <span className="rounded-full border border-slate-200 px-4 py-2 text-sm font-black text-slate-700">
                  Theory + practical flow
                </span>
              </div>
              <div className="grid gap-3">
                {expandedItems.map((item) => (
                  <QnaItem appUser={appUser} completed={completed.includes(item.id)} item={item} key={item.id} onToggle={() => toggleCompleted(item.id)} />
                ))}
              </div>
            </main>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
    </>
  )
}

function VisualPracticeLab({
  profile,
  subtopicTitle,
}: {
  profile: (typeof visualProfiles)[number]
  subtopicTitle: string
}) {
  const patternLabels = profile.pattern.map((note) => note.replace('4', ''))

  return (
    <section className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[.16em] text-teal-700">Visual practice map</p>
          <h4 className="mt-1 text-xl font-black">{subtopicTitle}</h4>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-sm font-black text-slate-700">{profile.formula}</span>
      </div>

      <div className="mt-4 rounded-2xl bg-white p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h5 className="font-black">Mini keyboard visualization</h5>
          <span className="text-sm font-bold text-slate-500">C Major scale</span>
        </div>
        <MiniKeyboard highlighted={['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4']} />
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_.75fr]">
        <div className="rounded-2xl bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <h5 className="font-black">Do Re Mi path</h5>
            <Music2 className="size-5 text-teal-700" />
          </div>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
            {solfegeSteps.map(([syllable, note, feeling], index) => (
              <div className="min-h-28 rounded-2xl border border-slate-100 bg-slate-50 p-3 text-center" key={`${syllable}-${index}`}>
                <div className={`mx-auto grid size-10 place-items-center rounded-full text-sm font-black text-white ${index === 7 ? 'bg-slate-950' : profile.color}`}>
                  {index + 1}
                </div>
                <p className="mt-2 text-lg font-black">{syllable}</p>
                <p className="text-sm font-bold text-slate-500">{note}</p>
                <p className="mt-1 text-xs font-semibold text-slate-400">{feeling}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-4">
          <h5 className="font-black">What to notice</h5>
          <p className="mt-3 leading-7 text-slate-600">{profile.focus}</p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {['Look', 'Play', 'Listen'].map((step) => (
              <span className="rounded-xl bg-slate-50 px-3 py-3 text-center text-sm font-black text-slate-700" key={step}>
                {step}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-white p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h5 className="font-black">Pattern strip</h5>
          <span className="text-sm font-bold text-slate-500">Play this on the piano above</span>
        </div>
        <div className="flex min-h-24 items-center gap-2 overflow-x-auto pb-2">
          {patternLabels.map((note, index) => (
            <div className="flex items-center gap-2" key={`${note}-${index}`}>
              <div className={`grid size-14 shrink-0 place-items-center rounded-2xl text-lg font-black text-white ${profile.color}`}>
                {note}
              </div>
              {index < patternLabels.length - 1 && <div className="h-1 w-8 shrink-0 rounded-full bg-slate-200" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function SongPracticeCoach() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [activeStep, setActiveStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const timers = useRef<number[]>([])
  const song = practiceSongs[selectedIndex]

  const stop = () => {
    timers.current.forEach((timer) => window.clearTimeout(timer))
    timers.current = []
    setPlaying(false)
  }

  const play = () => {
    stop()
    setPlaying(true)
    song.notes.forEach((noteName, index) => {
      const timer = window.setTimeout(() => {
        const note = pianoNotes.find((item) => item.note === noteName)
        setActiveStep(index)
        if (note) playSynthNote(note)
        if (index === song.notes.length - 1) setPlaying(false)
      }, index * 460)
      timers.current.push(timer)
    })
  }

  useEffect(() => () => stop(), [])

  return (
    <section className="mt-5 rounded-2xl border border-slate-100 bg-white p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[.16em] text-teal-700">Learn by song</p>
          <h4 className="mt-1 text-xl font-black">{song.title}</h4>
          <p className="mt-2 leading-7 text-slate-600">{song.lesson}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white" onClick={play}>
            <Play className="size-4" />
            Play
          </button>
          <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700" onClick={stop}>
            <Pause className="size-4" />
            Stop
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[.8fr_1.2fr]">
        <div className="grid max-h-72 gap-2 overflow-auto pr-1">
          {practiceSongs.map((item, index) => (
            <button
              className={`rounded-2xl border p-3 text-left ${selectedIndex === index ? 'border-teal-400 bg-teal-50' : 'border-slate-100 bg-slate-50'}`}
              key={item.title}
              onClick={() => {
                stop()
                setSelectedIndex(index)
                setActiveStep(0)
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-black">{item.title}</span>
                <span className="rounded-full bg-white px-2 py-1 text-xs font-black text-slate-600">{item.level}</span>
              </div>
              <p className="mt-1 text-sm font-bold text-teal-700">{item.mood} - {item.progression}</p>
            </button>
          ))}
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h5 className="font-black">{song.mood} progression</h5>
              <p className="text-sm font-bold text-slate-500">{song.key} - {song.progression}</p>
            </div>
            <span className="rounded-full bg-white px-3 py-1 text-sm font-black text-slate-700">{playing ? 'playing' : 'ready'}</span>
          </div>
          <div className="flex min-h-24 items-center gap-2 overflow-x-auto pb-2">
            {song.notes.map((noteName, index) => (
              <button
                className={`grid size-12 shrink-0 place-items-center rounded-xl text-sm font-black ${activeStep === index ? 'bg-teal-600 text-white' : 'bg-white text-slate-700'}`}
                key={`${song.title}-coach-${noteName}-${index}`}
                onClick={() => {
                  const note = pianoNotes.find((item) => item.note === noteName)
                  setActiveStep(index)
                  if (note) playSynthNote(note)
                }}
              >
                {noteName.replace('4', '')}
              </button>
            ))}
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {song.progression.split(' ').map((symbol, index) => (
              <button
                className="shrink-0 rounded-xl bg-white px-4 py-2 text-sm font-black text-slate-700"
                key={`${song.title}-chord-${symbol}-${index}`}
                onClick={() => void playSynthChord(romanToChord(symbol))}
              >
                {symbol}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function MiniKeyboard({ highlighted }: { highlighted: string[] }) {
  return (
    <div className="relative h-28 overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 p-2">
      <div className="grid h-full grid-cols-7 gap-1">
        {pianoNotes.filter((note) => !note.black).map((note) => (
          <div
            className={`flex items-end justify-center rounded-b-lg border border-slate-300 pb-2 text-xs font-black ${
              highlighted.includes(note.note) ? 'bg-teal-100 text-teal-800' : 'bg-white text-slate-500'
            }`}
            key={`mini-${note.note}`}
          >
            {note.label}
          </div>
        ))}
      </div>
      {pianoNotes.filter((note) => note.black).map((note) => (
        <div
          className={`absolute top-2 z-10 h-16 w-[10%] rounded-b-md text-center text-[10px] font-black text-white ${
            highlighted.includes(note.note) ? 'bg-teal-600' : 'bg-slate-950'
          }`}
          key={`mini-${note.note}`}
          style={{ left: note.left }}
        >
          {note.label}
        </div>
      ))}
    </div>
  )
}

const genres = ['Gospel', 'Bongo', 'Pop', 'Jazz', 'Afrobeat', 'RnB', 'Classical', 'Hip Hop', 'EDM', 'Others']

function FindYourSong() {
  const { user } = useNexaGenState()
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [genre, setGenre] = useState('Gospel')
  const [result, setResult] = useState<SongProgression | null>(songProgressions[0])
  const [message, setMessage] = useState('Curated harmony dataset ready. Spotify/harmony API adapter can replace this lookup when keys are configured.')
  const [audioUrl, setAudioUrl] = useState('')
  const [audioName, setAudioName] = useState('')
  const [audioMessage, setAudioMessage] = useState('')
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const search = async () => {
    if (!title.trim()) {
      setMessage('Enter a song title to search.')
      return
    }

    await trackUserActivity({ userId: user.user?.id, action: 'song_search' })
    const cached = await findSongCache(title, artist)
    if (cached) {
      setResult({
        title: cached.title,
        artist: cached.artist ?? 'Cached result',
        genre: cached.genre ?? genre,
        key: cached.key,
        scale: cached.scale,
        progression: cached.progression,
        confidence: 84,
        notes: cached.progression.flatMap((symbol) => romanToNotes(symbol)),
        chords: cached.progression.map((symbol) => romanToChord(symbol)),
      })
      setMessage('Loaded from Supabase song cache.')
      return
    }

    const curated = findCuratedSong(title, artist, genre)
    const fallback = curated ?? buildGenreFallback(title, artist, genre)
    setResult(fallback)
    setMessage(curated ? 'Matched in the curated song progression dataset.' : 'No exact match yet. Loaded a genre-safe practice progression with lower confidence.')

    await saveSongCache({
      title: fallback.title,
      artist: fallback.artist,
      key: fallback.key,
      scale: fallback.scale,
      progression: fallback.progression,
      genre: fallback.genre,
    }).catch(() => undefined)
  }

  const importMp3 = async (file: File | undefined) => {
    if (!file) return
    if (!file.name.toLowerCase().endsWith('.mp3')) {
      setAudioMessage('Please upload an .mp3 file.')
      return
    }
    if (audioUrl) URL.revokeObjectURL(audioUrl)
    const nextUrl = URL.createObjectURL(file)
    setAudioUrl(nextUrl)
    setAudioName(file.name)
    setAudioMessage('Analyzing the first 10 seconds...')
    try {
      const analysis = await analyzeMp3Key(file)
      const progression = analysis.mode === 'minor' ? ['i', 'VI', 'III', 'VII'] : ['I', 'V', 'vi', 'IV']
      const nextResult: SongProgression = {
        title: file.name.replace(/\.mp3$/i, ''),
        artist: 'Imported MP3',
        genre: 'Audio import',
        key: analysis.key,
        scale: analysis.scale,
        progression,
        confidence: analysis.confidence,
        notes: progression.flatMap((symbol) => romanToNotes(symbol)),
        chords: progression.map((symbol) => romanToChord(symbol)),
      }
      setResult(nextResult)
      setMessage(
        analysis.confidence < 58
          ? 'We couldn’t confidently detect the key. Try another section of the song.'
          : 'Imported MP3 analyzed from the first 10 seconds.',
      )
      setAudioMessage(`Key to play from: ${analysis.key}. ${analysis.summary}`)
    } catch {
      setAudioMessage('We couldn’t confidently detect the key. Try another section of the song.')
    }
  }

  return (
    <section className="mt-5 rounded-2xl border border-slate-100 bg-white p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[.16em] text-teal-700">Find Your Song</p>
          <h4 className="mt-1 text-xl font-black">Song search to key and progression</h4>
          <p className="mt-2 leading-7 text-slate-600">{message}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_.7fr_auto]">
        <input className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-teal-400" onChange={(event) => setTitle(event.target.value)} placeholder="Song name" value={title} />
        <input className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-teal-400" onChange={(event) => setArtist(event.target.value)} placeholder="Artist optional" value={artist} />
        <select className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-teal-400" onChange={(event) => setGenre(event.target.value)} value={genre}>
          {genres.map((item) => <option key={item}>{item}</option>)}
        </select>
        <button className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 font-bold text-white" onClick={search}>
          <Search className="size-4" />
          Search
        </button>
      </div>

      <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-black text-amber-800">Import Your Music (.mp3)</p>
            <p className="mt-1 text-sm font-semibold text-slate-600">{audioMessage || 'Upload an MP3 to detect key, pitch center, and a suggested progression.'}</p>
          </div>
          <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white">
            <Download className="size-4" />
            Upload MP3
            <input accept=".mp3,audio/mpeg" className="sr-only" onChange={(event) => void importMp3(event.target.files?.[0])} type="file" />
          </label>
        </div>
        {audioUrl && (
          <div className="mt-4 rounded-2xl bg-white p-3">
            <p className="mb-2 text-sm font-black text-slate-700">{audioName}</p>
            <audio className="hidden" ref={audioRef} src={audioUrl} />
            <div className="flex flex-wrap gap-2">
              <button className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-bold text-white" onClick={() => void audioRef.current?.play()}>
                <Play className="size-4" />
                Play
              </button>
              <button className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-800" onClick={() => audioRef.current?.pause()}>
                <Pause className="size-4" />
                Pause
              </button>
              <button className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white" onClick={() => {
                if (!audioRef.current) return
                audioRef.current.pause()
                audioRef.current.currentTime = 0
              }}>
                <X className="size-4" />
                Stop
              </button>
            </div>
          </div>
        )}
      </div>

      {result && (
        <div className="mt-5 grid gap-4 xl:grid-cols-[.8fr_1.2fr]">
          <div className="rounded-2xl bg-slate-50 p-4">
            <h5 className="text-lg font-black">{result.title}</h5>
            <p className="mt-1 text-sm font-bold text-slate-500">{result.artist} - {result.genre}</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {[
                ['Key', result.key],
                ['Scale', result.scale],
                ['Progression', result.progression.join(' - ')],
                ['Confidence', `${result.confidence}%`],
              ].map(([label, value]) => (
                <div className="rounded-xl bg-white p-3" key={label}>
                  <p className="text-xs font-black uppercase tracking-[.12em] text-slate-400">{label}</p>
                  <p className="mt-1 font-black text-slate-800">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {result.progression.map((chord, index) => (
                <button
                  className="rounded-xl bg-white px-4 py-2 text-sm font-black text-slate-700"
                  key={`${result.title}-${chord}-${index}`}
                  onClick={() => {
                    const notes = result.chords[index] ?? romanToChord(chord)
                    void playSynthChord(notes)
                  }}
                >
                  {chord}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <PianoEngine chordSequence={result.chords} guidedNotes={result.notes} practiceTitle={`${result.title} practice mode`} />
          </div>
        </div>
      )}
    </section>
  )
}

async function analyzeMp3Key(file: File) {
  const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AudioContextClass) throw new Error('Audio analysis unavailable.')
  const context = new AudioContextClass()
  const buffer = await context.decodeAudioData(await file.arrayBuffer())
  const sampleRate = buffer.sampleRate
  const length = Math.min(buffer.length, sampleRate * 10)
  const channel = buffer.getChannelData(0).slice(0, length)
  const chroma = new Array(12).fill(0)
  const size = 4096
  for (let offset = 0; offset + size < channel.length; offset += size) {
    const segment = channel.slice(offset, offset + size)
    const zeroCrossings = segment.reduce((count, value, index) => index && Math.sign(value) !== Math.sign(segment[index - 1]) ? count + 1 : count, 0)
    const frequency = Math.max(55, Math.min(1760, (zeroCrossings * sampleRate) / (2 * size)))
    const midi = Math.round(69 + 12 * Math.log2(frequency / 440))
    chroma[((midi % 12) + 12) % 12] += segment.reduce((sum, value) => sum + Math.abs(value), 0)
  }
  const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
  const majorProfile = [6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88]
  const minorProfile = [6.33, 2.68, 3.52, 5.38, 2.6, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17]
  const score = (profile: number[], root: number) => profile.reduce((sum, value, index) => sum + value * chroma[(index + root) % 12], 0)
  const candidates = keys.flatMap((key, index) => [
    { key: `${key} Major`, mode: 'major' as const, score: score(majorProfile, index), root: index },
    { key: `${key} Minor`, mode: 'minor' as const, score: score(minorProfile, index), root: index },
  ]).sort((a, b) => b.score - a.score)
  const best = candidates[0]
  const second = candidates[1]
  const confidence = Math.max(35, Math.min(92, Math.round(((best.score - second.score) / Math.max(best.score, 1)) * 210 + 45)))
  const scaleSteps = best.mode === 'minor' ? [0, 2, 3, 5, 7, 8, 10] : [0, 2, 4, 5, 7, 9, 11]
  return {
    key: best.key,
    mode: best.mode,
    confidence,
    scale: scaleSteps.map((step) => keys[(best.root + step) % 12]).join(' '),
    summary: `Detected Key: ${best.key}. Suggested song structure: intro, verse loop, chorus lift, return to home chord.`,
  }
}

function buildGenreFallback(title: string, artist: string, genre: string): SongProgression {
  const progression = genre === 'Jazz' ? ['ii', 'V', 'I', 'vi'] : genre === 'Afrobeat' ? ['i', 'VII', 'VI', 'VII'] : ['I', 'V', 'vi', 'IV']
  return {
    title: title.trim(),
    artist: artist.trim() || 'Unknown artist',
    genre,
    key: genre === 'Afrobeat' ? 'A Minor' : 'C Major',
    scale: genre === 'Afrobeat' ? 'A B C D E F G' : 'C D E F G A B',
    progression,
    confidence: 58,
    notes: progression.flatMap((symbol) => romanToNotes(symbol)),
    chords: progression.map((symbol) => romanToChord(symbol)),
  }
}

function romanToNotes(symbol: string) {
  return romanToChord(symbol).slice(0, 2)
}

function romanToChord(symbol: string) {
  const map: Record<string, string[]> = {
    I: ['C4', 'E4', 'G4'],
    i: ['A4', 'C4', 'E4'],
    ii: ['D4', 'F4', 'A4'],
    iii: ['E4', 'G4', 'B4'],
    IV: ['F4', 'A4', 'C4'],
    V: ['G4', 'B4', 'D4'],
    vi: ['A4', 'C4', 'E4'],
    VI: ['F4', 'A4', 'C4'],
    VII: ['G4', 'B4', 'D4'],
  }
  return map[symbol] ?? ['C4', 'E4', 'G4']
}

const pianoNotes = [
  { note: 'C4', label: 'C', key: 'A', freq: 261.63, black: false },
  { note: 'C#4', label: 'C#', key: 'W', freq: 277.18, black: true, left: '8%' },
  { note: 'D4', label: 'D', key: 'S', freq: 293.66, black: false },
  { note: 'D#4', label: 'D#', key: 'E', freq: 311.13, black: true, left: '22%' },
  { note: 'E4', label: 'E', key: 'D', freq: 329.63, black: false },
  { note: 'F4', label: 'F', key: 'F', freq: 349.23, black: false },
  { note: 'F#4', label: 'F#', key: 'T', freq: 369.99, black: true, left: '51%' },
  { note: 'G4', label: 'G', key: 'G', freq: 392, black: false },
  { note: 'G#4', label: 'G#', key: 'Y', freq: 415.3, black: true, left: '65%' },
  { note: 'A4', label: 'A', key: 'H', freq: 440, black: false },
  { note: 'A#4', label: 'A#', key: 'U', freq: 466.16, black: true, left: '79%' },
  { note: 'B4', label: 'B', key: 'J', freq: 493.88, black: false },
]

let toneSynth: Tone.PolySynth | null = null

async function playSynthNote(note: (typeof pianoNotes)[number]) {
  try {
    if (Tone.getContext().state !== 'running') await Tone.start()
    toneSynth ??= new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle8' },
      envelope: { attack: 0.008, decay: 0.16, sustain: 0.28, release: 0.65 },
    }).toDestination()
    toneSynth.triggerAttackRelease(note.note, '8n')
  } catch {
    playFallbackNote(note)
  }
}

async function playSynthChord(notes: string[], duration = '2n') {
  try {
    if (Tone.getContext().state !== 'running') await Tone.start()
    toneSynth ??= new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle8' },
      envelope: { attack: 0.008, decay: 0.2, sustain: 0.35, release: 0.85 },
    }).toDestination()
    toneSynth.triggerAttackRelease(notes, duration)
  } catch {
    notes.forEach((noteName) => {
      const note = pianoNotes.find((item) => item.note === noteName)
      if (note) playFallbackNote(note)
    })
  }
}

function playFallbackNote(note: (typeof pianoNotes)[number]) {
  const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AudioContextClass) return
  const context = new AudioContextClass()
  const oscillator = context.createOscillator()
  const gain = context.createGain()
  oscillator.type = 'triangle'
  oscillator.frequency.value = note.freq
  gain.gain.setValueAtTime(0.0001, context.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.45, context.currentTime + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.8)
  oscillator.connect(gain)
  gain.connect(context.destination)
  oscillator.start()
  oscillator.stop(context.currentTime + 0.82)
}

function PianoEngine({
  chordSequence = [],
  guidedNotes = [],
  practiceTitle = 'Piano practice',
}: {
  chordSequence?: string[][]
  guidedNotes?: string[]
  practiceTitle?: string
}) {
  const [activeNotes, setActiveNotes] = useState<string[]>(['C4'])
  const [stepIndex, setStepIndex] = useState(0)
  const timers = useRef<number[]>([])

  const playNote = (note: (typeof pianoNotes)[number]) => {
    setActiveNotes([note.note])
    void playSynthNote(note)
    void trackUserActivity({ action: 'piano_interaction' })
  }

  const playGuidedPattern = () => {
    timers.current.forEach((timer) => window.clearTimeout(timer))
    timers.current = []
    guidedNotes.forEach((noteName, index) => {
      const timer = window.setTimeout(() => {
        const note = pianoNotes.find((item) => item.note === noteName)
        if (!note) return
        setStepIndex(index)
        playNote(note)
      }, index * 520)
      timers.current.push(timer)
    })
  }

  const playChordSequence = () => {
    timers.current.forEach((timer) => window.clearTimeout(timer))
    timers.current = []
    chordSequence.forEach((chord, index) => {
      const timer = window.setTimeout(() => {
        setStepIndex(index)
        setActiveNotes(chord)
        void playSynthChord(chord, '2n')
      }, index * 760)
      timers.current.push(timer)
    })
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const note = pianoNotes.find((item) => item.key.toLowerCase() === event.key.toLowerCase())
      if (note) playNote(note)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      timers.current.forEach((timer) => window.clearTimeout(timer))
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 rounded-2xl bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="inline-flex items-center gap-2 font-black"><Headphones className="size-5 text-teal-700" /> {activeNotes.join(' + ')}</span>
        <span className="text-sm font-bold text-slate-500">{practiceTitle}</span>
      </div>
      {!!(guidedNotes.length || chordSequence.length) && (
        <div className="mb-4 rounded-2xl border border-slate-100 bg-white p-3">
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm font-black text-slate-700">{chordSequence.length ? 'Guided chord playback' : 'Guided pattern'}</span>
            <div className="flex flex-wrap gap-2">
              {!!guidedNotes.length && (
                <button className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white" onClick={playGuidedPattern}>
                  <Volume2 className="size-4" />
                  Play pattern
                </button>
              )}
              {!!chordSequence.length && (
                <button className="inline-flex items-center justify-center gap-2 rounded-full bg-teal-700 px-4 py-2 text-sm font-bold text-white" onClick={playChordSequence}>
                  <Play className="size-4" />
                  Play chords
                </button>
              )}
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {(chordSequence.length ? chordSequence.map((chord) => chord.join('+')) : guidedNotes).map((noteName, index) => (
              <button
                className={`grid size-11 shrink-0 place-items-center rounded-xl text-sm font-black transition ${stepIndex === index ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700'}`}
                key={`${noteName}-${index}`}
                onClick={() => {
                  if (chordSequence.length) {
                    setStepIndex(index)
                    setActiveNotes(chordSequence[index])
                    void playSynthChord(chordSequence[index])
                    return
                  }
                  const note = pianoNotes.find((item) => item.note === noteName)
                  if (note) {
                    setStepIndex(index)
                    playNote(note)
                  }
                }}
              >
                {noteName.replace('4', '')}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="mb-3 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white">
        Tap, click, or use A W S E D F T G Y H U J
      </div>
      <div className="relative h-56 w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 p-2">
        <div className="grid h-full grid-cols-7 gap-1">
          {pianoNotes.filter((note) => !note.black).map((note) => (
            <button
              className={`flex items-end justify-center rounded-b-xl border border-slate-300 bg-white pb-4 text-sm font-black shadow-inner transition ${activeNotes.includes(note.note) ? 'bg-teal-100 text-teal-800' : 'text-slate-700'}`}
              key={note.note}
              onClick={() => playNote(note)}
            >
              {note.label}
            </button>
          ))}
        </div>
        {pianoNotes.filter((note) => note.black).map((note) => (
          <button
            className={`absolute top-2 z-10 h-32 w-[10%] rounded-b-lg bg-slate-950 text-xs font-black text-white shadow-xl transition ${activeNotes.includes(note.note) ? 'bg-teal-600' : ''}`}
            key={note.note}
            onClick={() => playNote(note)}
            style={{ left: note.left }}
          >
            {note.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function QnaItem({
  appUser,
  completed,
  item,
  onToggle,
}: {
  appUser: AppUser
  completed: boolean
  item: ContentItem
  onToggle: () => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
      <button className="flex w-full items-center justify-between gap-4 text-left" onClick={() => setOpen(!open)}>
        <span>
          <span className="block font-black">{item.title}</span>
          <span className="mt-1 block text-xs font-bold text-teal-700">{open ? 'Hide guide' : 'Read More'}</span>
        </span>
        <ChevronDown className={`size-5 shrink-0 transition ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden" exit={{ height: 0, opacity: 0 }} initial={{ height: 0, opacity: 0 }}>
            <p className="mt-4 leading-7 text-slate-600">{item.body}</p>
            <button
              className={`mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${
                completed ? 'bg-teal-100 text-teal-800' : 'bg-white text-slate-700'
              }`}
              disabled={!appUser.user}
              onClick={onToggle}
            >
              <CheckCircle2 className="size-4" />
              {appUser.user ? (completed ? 'Completed' : 'Mark complete') : 'Sign in to save'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function PlanSelectionModal({
  appUser,
  dashboard,
  dashboards,
  mode = 'required',
  onAuthOpen,
  onClose,
  onOpenDashboard,
  onSubscriptionChange,
}: {
  appUser: AppUser
  dashboard: Dashboard
  dashboards: Dashboard[]
  mode?: 'required' | 'upgrade'
  onAuthOpen: () => void
  onClose: () => void
  onOpenDashboard: (dashboardId: string, message: string) => void
  onSubscriptionChange: (subscription: UserSubscription | null) => void
}) {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | 'free_trial' | null>('free_trial')
  const [language, setLanguage] = useState(programmingLanguages[0]?.id ?? 'javascript')
  const [paymentPlan, setPaymentPlan] = useState<SubscriptionPlan | null>(null)
  const [phone, setPhone] = useState('')
  const [busy, setBusy] = useState('')
  const [message, setMessage] = useState('')
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'sending' | 'sent' | 'waiting' | 'success' | 'error'>('idle')
  const [fallbackDashboardId, setFallbackDashboardId] = useState<string | null>(null)
  const paymentPanelRef = useRef<HTMLDivElement | null>(null)
  const dashboardOptions = dashboards
    .filter((item) => availableDashboardSlugs.includes(dashboardAccessKey(item)))
    .map((item) => ({ id: item.id, label: item.title, value: dashboardAccessKey(item) }))
  const programmingDashboardId = dashboardOptions.find((item) => item.value === 'programming')?.id ?? dashboard.id
  const starterTargetDashboardId = programmingDashboardId

  const validateChoice = () => {
    return true
  }

  const runTrial = async () => {
    if (!appUser.user) {
      onAuthOpen()
      return
    }
    if (!validateChoice()) return
    if (!language) {
      setMessage('Free trial allows only 1 language. Choose your favorite language first.')
      return
    }
    setSelectedPlan('free_trial')
    setBusy('free-trial')
    setMessage('')
    try {
      const saved = await startFreeTrial({
        userId: appUser.user.id,
        dashboard: 'programming',
        language,
      })
      onSubscriptionChange(saved)
      const chosenLanguage = programmingLanguages.find((item) => item.id === language)?.name ?? 'your language'
      setMessage(`Free trial started with ${chosenLanguage}. Other languages are locked until you upgrade.`)
      onOpenDashboard(programmingDashboardId, 'Free trial started. Redirecting you to your dashboard...')
    } catch (error) {
      const rawMessage = error instanceof Error ? error.message : 'Could not start free trial.'
      setMessage(rawMessage.toLowerCase().includes('already') ? 'This device has already used a free trial. Choose a paid plan to continue learning.' : rawMessage)
    } finally {
      setBusy('')
    }
  }

  const targetDashboardForPlan = (plan: SubscriptionPlan) => plan === 'pro' ? programmingDashboardId : starterTargetDashboardId

  const pollForSubscription = async (plan: SubscriptionPlan) => {
    if (!appUser.user) return
    const targetDashboardId = targetDashboardForPlan(plan)
    setFallbackDashboardId(targetDashboardId)
    setPaymentStatus('waiting')
    setMessage('Waiting for payment confirmation. Do not close this window while payment is processing.')
    const startedAt = Date.now()
    const poll = window.setInterval(async () => {
      const activeSubscription = await getActiveSubscription(appUser.user!.id)
      if (activeSubscription) {
        window.clearInterval(poll)
        setPaymentStatus('success')
        onSubscriptionChange(activeSubscription)
        setMessage('Payment confirmed successfully. Unlocking your access and redirecting to your dashboard...')
        window.setTimeout(() => {
          onOpenDashboard(targetDashboardId, 'Payment confirmed successfully. Redirecting you to your dashboard...')
        }, 1200)
        return
      }
      if (Date.now() - startedAt > 120000) {
        window.clearInterval(poll)
        setPaymentStatus('error')
        setMessage('STK Push was sent, but confirmation is taking longer than expected. If you completed payment, use the fallback link or refresh your account in a moment.')
      }
    }, 3000)
  }

  const refreshSubscription = async () => {
    if (!appUser.user) {
      onAuthOpen()
      return
    }
    setBusy('subscription-refresh')
    setMessage('')
    try {
      const activeSubscription = await getActiveSubscription(appUser.user.id)
      if (!activeSubscription) {
        setPaymentStatus('error')
        setMessage('No active subscription is attached to this signed-in email yet. If M-Pesa confirmed payment, send the unlock request below.')
        return
      }
      onSubscriptionChange(activeSubscription)
      setPaymentStatus('success')
      const targetDashboardId = activeSubscription.plan === 'pro' ? programmingDashboardId : starterTargetDashboardId
      onOpenDashboard(targetDashboardId, 'Subscription found. Redirecting you to your dashboard...')
    } catch (error) {
      setPaymentStatus('error')
      setMessage(error instanceof Error ? error.message : 'Could not refresh subscription status.')
    } finally {
      setBusy('')
    }
  }

  const unlock = async (plan: SubscriptionPlan) => {
    if (!appUser.user) {
      onAuthOpen()
      return
    }
    if (!validateChoice()) return
    if (!phone.trim()) {
      setMessage('Enter your M-Pesa phone number to continue.')
      return
    }
    setBusy(`${plan}-unlock`)
    setPaymentStatus('sending')
    setMessage('')
    try {
      await createPayment({
        user_id: appUser.user.id,
        plan_name: plan,
        selected_dashboard: plan === 'pro' ? 'all' : 'programming',
        phone_number: normalizeMpesaPhone(phone),
      })
      setPaymentStatus('sent')
      setMessage('STK Push sent. Check your phone for the M-Pesa prompt and enter your PIN to complete payment.')
      void pollForSubscription(plan)
    } catch (error) {
      setPaymentStatus('error')
      setMessage(error instanceof Error ? error.message : 'Could not start payment.')
    } finally {
      setBusy('')
    }
  }

  const openPaymentPanel = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan)
    if (!validateChoice()) return
    setPaymentPlan(plan)
    setPaymentStatus('idle')
    setMessage('')
    window.setTimeout(() => paymentPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  return (
    <Modal onClose={onClose}>
      <div className="max-h-[calc(100dvh-9rem)] overflow-y-auto pr-1">
      <p className="text-sm font-bold uppercase tracking-[.16em] text-teal-700">Choose your plan</p>
      <h2 className="mt-2 text-2xl font-black">{mode === 'upgrade' ? 'Upgrade or change your plan' : 'Plan selection is required before dashboards'}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        {mode === 'upgrade'
          ? 'Move from free trial to Starter or Pro, or change your active access. Pro unlocks all languages.'
          : 'Plans last 1 month. New challenges added every month. Don’t miss out.'}
      </p>
      {appUser.user?.email && (
        <p className="mt-3 rounded-2xl border border-teal-100 bg-teal-50 p-3 text-sm font-black text-teal-900">
          Payment and unlock will be attached to: {appUser.user.email}
        </p>
      )}

      <div className="mt-5 grid gap-3 md:grid-cols-[.8fr_1.2fr]">
        <div className="rounded-2xl border border-teal-100 bg-teal-50 px-4 py-3">
          <p className="text-xs font-black uppercase tracking-[.14em] text-teal-700">Starter access</p>
          <p className="mt-1 text-sm font-bold text-slate-700">Starter opens the Programming dashboard with the first 10 languages. Pro opens every available dashboard.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-3">
          <p className="mb-2 text-xs font-black uppercase tracking-[.14em] text-teal-700">Free trial language</p>
          <p className="mb-3 text-sm font-bold text-slate-600">In the free plan you can only choose 1 language. Choose your favorite language.</p>
          <div className="grid max-h-48 gap-2 overflow-auto pr-1 sm:grid-cols-2">
            {programmingLanguages.map((item) => (
              <label
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 text-sm font-black ${
                  language === item.id ? 'border-teal-300 bg-teal-50 text-teal-900' : 'border-slate-100 bg-slate-50 text-slate-700'
                }`}
                key={item.id}
              >
                <input
                  checked={language === item.id}
                  className="size-4 accent-teal-600"
                  onChange={() => setLanguage(item.id)}
                  type="checkbox"
                />
                {item.name}
              </label>
            ))}
          </div>
          <button className="premium-action-success mt-3 w-full px-4 py-2 text-sm" disabled={busy === 'free-trial'} onClick={() => void runTrial()}>
            {busy === 'free-trial' ? 'Starting...' : 'Start Free Trial'}
          </button>
        </div>
      </div>

      {paymentPlan && (
        <div ref={paymentPanelRef} className="mt-5 overflow-hidden rounded-2xl border border-cyan-100 bg-gradient-to-br from-cyan-50 via-white to-violet-50 p-4 shadow-xl shadow-cyan-100/60">
          <button
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm transition hover:text-cyan-700"
            onClick={() => {
              setPaymentPlan(null)
              setPaymentStatus('idle')
              setMessage('')
            }}
          >
            <ArrowLeft className="size-4" />
            Back to plans
          </button>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="font-black text-slate-950">{paymentPlan === 'pro' ? 'Unlock Pro Access' : 'Unlock Starter Pass'}</p>
              <p className="mt-1 text-sm font-bold text-slate-600">Check your phone for the M-Pesa STK Push. Enter your M-Pesa PIN to complete payment.</p>
            </div>
            <PaymentStatusPill status={paymentStatus} />
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
            <input className="rounded-2xl border border-cyan-100 bg-white px-4 py-3 font-bold outline-none focus:border-cyan-400" onChange={(event) => setPhone(event.target.value)} placeholder="M-Pesa phone, e.g. 2547XXXXXXXX" value={phone} />
            <button className="premium-action px-5 py-3" disabled={busy === `${paymentPlan}-unlock` || paymentStatus === 'waiting'} onClick={() => void unlock(paymentPlan)}>
              {busy === `${paymentPlan}-unlock` ? <Sparkles className="size-4 animate-spin" /> : <CreditCard className="size-4" />}
              {busy === `${paymentPlan}-unlock` ? 'Sending STK...' : 'Send STK Push'}
            </button>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {[
              ['1', 'STK Push sent to your phone'],
              ['2', 'Enter your M-Pesa PIN'],
              ['3', 'NexaGen unlocks automatically'],
            ].map(([step, copy]) => (
              <div className="rounded-2xl bg-white/80 p-3 text-xs font-black text-slate-600 shadow-sm" key={step}>
                <span className="mr-2 inline-grid size-6 place-items-center rounded-full bg-cyan-100 text-cyan-700">{step}</span>
                {copy}
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs font-bold text-slate-500">Do not close this window while payment is processing.</p>
          {fallbackDashboardId && paymentStatus !== 'idle' && (
            <div className="mt-3 flex flex-wrap gap-3">
              <button className="text-sm font-black text-cyan-700 hover:text-violet-700" disabled={busy === 'subscription-refresh'} onClick={() => void refreshSubscription()}>
                {busy === 'subscription-refresh' ? 'Checking...' : 'Refresh subscription status'}
              </button>
              <button className="text-sm font-black text-slate-600 hover:text-violet-700" onClick={() => onOpenDashboard(fallbackDashboardId, 'Opening your dashboard...')}>
                Open dashboard again
              </button>
            </div>
          )}
          {(paymentStatus === 'waiting' || paymentStatus === 'error') && (
            <PaymentUnlockHelpForm
              defaultEmail={appUser.user?.email ?? ''}
              defaultError={message || 'M-Pesa/IntaSend confirmed but dashboard did not unlock.'}
              defaultPlan={paymentPlan}
            />
          )}
        </div>
      )}

      <div className="mt-5 grid gap-3">
        <PlanMiniCard
          busy={busy}
          features={['Programming dashboard access', 'First 10 programming languages', 'Saved until expiry', 'Progress tracking', 'Monthly challenges']}
          name="Starter Pass"
          onSelect={() => {
            setSelectedPlan('starter')
            setPaymentPlan(null)
            setMessage('')
          }}
          onUnlock={() => openPaymentPanel('starter')}
          price="KES 100/month"
          selected={selectedPlan === 'starter'}
          note="Paid Starter unlocks 10 programming languages."
        />
        <PlanMiniCard
          busy={busy}
          features={['Unlock all dashboards', 'All programming languages', 'All piano topics', 'Unlimited challenges', 'Full coding IDE and piano engine']}
          name="Pro Access"
          onSelect={() => {
            setSelectedPlan('pro')
            setPaymentPlan(null)
            setMessage('')
          }}
          onUnlock={() => openPaymentPanel('pro')}
          price="KES 150/month"
          selected={selectedPlan === 'pro'}
          note="Paid Pro unlocks every dashboard and language."
        />
      </div>
      {selectedPlan && (
        <p className="mt-4 rounded-2xl bg-slate-50 p-3 text-sm font-bold text-slate-600">
          {selectedPlan === 'free_trial'
            ? 'Free trial unlocks only the one language you choose above. Upgrade any time for more access.'
            : selectedPlan === 'starter'
            ? 'Starter Pass unlocks the Programming dashboard and the first 10 programming languages. Free trial starts without a phone number.'
            : 'Pro Access unlocks every dashboard. Free trial starts without a phone number.'}
        </p>
      )}
      {message && <p className="mt-4 rounded-2xl bg-amber-50 p-3 text-sm font-bold text-amber-800">{message}</p>}
      </div>
    </Modal>
  )
}

function PaymentUnlockHelpForm({
  defaultEmail,
  defaultError,
  defaultPlan,
}: {
  defaultEmail: string
  defaultError: string
  defaultPlan: SubscriptionPlan | null
}) {
  const [email, setEmail] = useState(defaultEmail)
  const [plan, setPlan] = useState<SubscriptionPlan>(defaultPlan ?? 'starter')
  const [errorText, setErrorText] = useState(defaultError)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [message, setMessage] = useState('')

  useEffect(() => {
    setEmail(defaultEmail)
  }, [defaultEmail])

  useEffect(() => {
    setErrorText(defaultError)
  }, [defaultError])

  useEffect(() => {
    if (defaultPlan) setPlan(defaultPlan)
  }, [defaultPlan])

  const submit = async () => {
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setStatus('error')
      setMessage('Enter the signed-in email first.')
      return
    }
    setStatus('sending')
    setMessage('')
    try {
      await sendContactEmail({
        name: 'NexaGen payment unlock request',
        email: email.trim(),
        type: 'payment-unlock-help',
        subject: `Payment unlock issue: ${plan}`,
        message: `Signed-in email: ${email.trim()}\nPlan: ${plan}\nError: ${errorText.trim() || 'Dashboard did not unlock after confirmed STK payment.'}\n\nPlease verify payment_logs/subscriptions and unlock this account.`,
      })
      setStatus('sent')
      setMessage('Unlock request sent. We will verify the paid STK and attach access to this email.')
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Could not send unlock request.')
    }
  }

  return (
    <div className="mt-4 rounded-2xl border border-amber-100 bg-white p-4">
      <p className="text-sm font-black text-slate-950">Still locked after payment?</p>
      <p className="mt-1 text-xs font-bold text-slate-500">First refresh, then sign out and sign in. If it still fails, send this unlock request.</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_.6fr]">
        <input className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold outline-none focus:border-teal-400" onChange={(event) => setEmail(event.target.value)} placeholder="Signed-in email" value={email} />
        <select className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold outline-none focus:border-teal-400" onChange={(event) => setPlan(event.target.value as SubscriptionPlan)} value={plan}>
          <option value="starter">Starter Pass</option>
          <option value="pro">Pro Access</option>
        </select>
      </div>
      <textarea className="mt-2 min-h-20 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold outline-none focus:border-teal-400" onChange={(event) => setErrorText(event.target.value)} value={errorText} />
      <button className="premium-action mt-2 px-4 py-2 text-sm" disabled={status === 'sending'} onClick={() => void submit()}>
        {status === 'sending' ? <Sparkles className="size-4 animate-spin" /> : <Mail className="size-4" />}
        {status === 'sending' ? 'Sending...' : 'Send unlock request'}
      </button>
      {message && <p className={`mt-2 text-xs font-black ${status === 'sent' ? 'text-emerald-700' : 'text-amber-700'}`}>{message}</p>}
    </div>
  )
}

function PaymentStatusPill({ status }: { status: 'idle' | 'sending' | 'sent' | 'waiting' | 'success' | 'error' }) {
  const config = {
    idle: ['Ready', 'bg-white text-slate-700', CreditCard],
    sending: ['Sending STK', 'bg-cyan-100 text-cyan-800', Sparkles],
    sent: ['Payment sent', 'bg-blue-100 text-blue-800', Send],
    waiting: ['Waiting confirmation', 'bg-amber-100 text-amber-800', Sparkles],
    success: ['Confirmed', 'bg-emerald-100 text-emerald-800', CheckCircle2],
    error: ['Needs attention', 'bg-rose-100 text-rose-800', X],
  } as const
  const [label, className, Icon] = config[status]
  const spinning = status === 'sending' || status === 'waiting'

  return (
    <span className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-2 text-xs font-black ${className}`}>
      <Icon className={`size-4 ${spinning ? 'animate-spin' : ''}`} />
      {label}
    </span>
  )
}

function normalizeMpesaPhone(value: string) {
  const digits = value.replace(/\D/g, '')
  if (digits.startsWith('07') && digits.length === 10) return `254${digits.slice(1)}`
  if (digits.startsWith('7') && digits.length === 9) return `254${digits}`
  return digits
}

function PlanMiniCard({ busy, features, name, onSelect, onUnlock, price, selected, note }: {
  busy: string
  features: string[]
  name: string
  onSelect: () => void
  onUnlock: () => void
  price: string
  selected: boolean
  note: string
}) {
  const plan = name.toLowerCase().includes('pro') ? 'pro' : 'starter'
  const Icon = plan === 'pro' ? Crown : Medal
  const iconClasses = plan === 'pro'
    ? 'bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-600 text-amber-950'
    : 'bg-gradient-to-br from-slate-300 via-slate-100 to-slate-500 text-slate-800'
  return (
    <div className={`rounded-2xl border p-4 transition ${selected ? 'border-teal-300 bg-teal-50 ring-4 ring-teal-100' : 'border-slate-100 bg-slate-50'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className={`grid size-11 place-items-center rounded-xl shadow-sm ${iconClasses}`}>
            <Icon className="size-6" />
          </span>
          <div>
            <h3 className="font-black">{name}</h3>
            <p className="text-sm font-bold text-slate-500">{price}</p>
          </div>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-black ${plan === 'pro' ? 'pro-savings-badge text-amber-900' : 'bg-white text-teal-700'}`}>
          {selected ? 'Selected' : note}
        </span>
      </div>
      <div className="mt-3 grid gap-1">
        {features.map((feature) => <span className="text-xs font-bold text-slate-600" key={feature}>- {feature}</span>)}
      </div>
      <p className="mt-3 rounded-xl bg-white px-3 py-2 text-xs font-black text-slate-600">{note}</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <button className="premium-outline-button px-4 py-2 text-sm" onClick={onSelect}>{selected ? 'Plan Selected' : 'Choose Plan'}</button>
        <button className="premium-action-alt relative mt-5 px-4 py-2 text-sm" disabled={busy === `${plan}-unlock`} onClick={onUnlock}>
          <span className="floating-pointer pointer-events-none absolute left-1/2 -top-7 text-2xl opacity-90" aria-hidden="true">👇</span>
          <span className="relative z-10">Unlock This Plan</span>
        </button>
      </div>
    </div>
  )
}

function ComingSoonModal({ dashboard, onClose }: { dashboard: Dashboard; onClose: () => void }) {
  return (
    <Modal onClose={onClose}>
      <motion.div animate={{ y: [0, -8, 0] }} className="mx-auto grid size-24 place-items-center rounded-2xl bg-amber-100 text-amber-700" transition={{ duration: 2, repeat: Infinity }}>
        <Terminal className="size-11" />
      </motion.div>
      <h2 className="mt-5 text-center text-2xl font-black">{dashboard.title} is coming soon</h2>
      <p className="mt-3 text-center leading-7 text-slate-600">
        This dashboard is coming soon. Our developers are currently building and refining it. Once available, we’ll notify you via email. Consider subscribing to our newsletter to stay updated.
      </p>
      <NewsletterSignup />
    </Modal>
  )
}

function SuccessOverlay({ message }: { message: string }) {
  return (
    <motion.div animate={{ opacity: 1 }} className="fixed inset-0 z-[60] grid place-items-center bg-emerald-950/45 p-4 backdrop-blur-sm" initial={{ opacity: 0 }}>
      <motion.div animate={{ scale: 1, rotate: 0 }} className="w-full max-w-sm rounded-[1.5rem] bg-white p-6 text-center shadow-2xl" initial={{ scale: 0.86, rotate: -3 }}>
        <motion.div animate={{ scale: [1, 1.2, 1] }} className="mx-auto grid size-20 place-items-center rounded-2xl bg-emerald-100 text-emerald-700" transition={{ duration: 0.7, repeat: Infinity }}>
          <UnlockKeyhole className="size-9" />
        </motion.div>
        <h2 className="mt-4 text-2xl font-black">Success</h2>
        <p className="mt-2 font-bold text-emerald-700">{message}</p>
      </motion.div>
    </motion.div>
  )
}

function AccountAutoModal({
  appUser,
  dashboards,
  onAuthOpen,
  onSubscriptionChange,
  subscription,
}: {
  appUser: AppUser
  dashboards: Dashboard[]
  onAuthOpen: () => void
  onSubscriptionChange: (subscription: UserSubscription | null) => void
  subscription: UserSubscription | null
}) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const openAccount = () => setOpen(true)
    window.addEventListener('nexagen:open-account', openAccount)
    return () => window.removeEventListener('nexagen:open-account', openAccount)
  }, [])
  return open ? (
    <AccountModal
      appUser={appUser}
      dashboards={dashboards}
      onAuthOpen={onAuthOpen}
      onClose={() => setOpen(false)}
      onSubscriptionChange={onSubscriptionChange}
      subscription={subscription}
    />
  ) : null
}

function AccountModal({ appUser, dashboards, onAuthOpen, onClose, onSubscriptionChange, subscription }: {
  appUser: AppUser
  dashboards: Dashboard[]
  onAuthOpen: () => void
  onClose: () => void
  onSubscriptionChange: (subscription: UserSubscription | null) => void
  subscription: UserSubscription | null
}) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!appUser.user) return
    void getUserProfile(appUser.user.id).then((profile) => setUsername(profile?.username ?? ''))
  }, [appUser.user])

  const save = async () => {
    if (!appUser.user) {
      onAuthOpen()
      return
    }
    await saveUserProfile({ userId: appUser.user.id, username })
    if (password.trim()) {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) {
        setMessage(error.message)
        return
      }
      setPassword('')
    }
    setMessage('Account updated.')
  }

  const switchPlan = async (plan: SubscriptionPlan) => {
    if (!appUser.user) {
      onAuthOpen()
      return
    }
    const saved = await activateTestSubscription({
      userId: appUser.user.id,
      plan,
      dashboardsAccess: plan === 'pro' ? ['all'] : [dashboardAccessKey(dashboards[0])],
    })
    onSubscriptionChange(saved)
    setMessage(`${plan === 'pro' ? 'Pro Access' : 'Starter Pass'} selected.`)
  }

  return (
    <Modal onClose={onClose}>
      <p className="text-sm font-bold uppercase tracking-[.16em] text-teal-700">My Account</p>
      <h2 className="mt-2 text-2xl font-black">{appUser.user?.email ?? 'Sign in required'}</h2>
      <div className="mt-5 grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-700">
        <span>Email: {appUser.user?.email ?? 'Not signed in'}</span>
        <span>Current plan: {subscription?.plan ?? 'none'}</span>
        <span>Plan expiry date: {subscription ? new Date(subscription.expires_at).toLocaleDateString() : 'No active plan'}</span>
        <span>Dashboard access: {subscription?.dashboards_access.join(', ') || 'none'}</span>
      </div>
      <div className="mt-4 grid gap-3">
        <input className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-teal-400" onChange={(event) => setUsername(event.target.value)} placeholder="Username" value={username} />
        <input className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-teal-400" onChange={(event) => setPassword(event.target.value)} placeholder="New password" type="password" value={password} />
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <button className="rounded-full bg-slate-950 px-4 py-2 text-sm font-black text-white" onClick={() => void save()}>Save</button>
        <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-800" onClick={() => void switchPlan('starter')}>Starter</button>
        <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-800" onClick={() => void switchPlan('pro')}>Pro</button>
      </div>
      {message && <p className="mt-4 rounded-2xl bg-teal-50 p-3 text-sm font-bold text-teal-800">{message}</p>}
    </Modal>
  )
}

function AuthModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (mode: 'signin' | 'signup') => {
    if (!supabaseConfigured) {
      setMessage('Supabase is not configured on this deployment yet. Add the Vercel environment variables and redeploy.')
      return
    }
    if (mode === 'signup' && password !== confirmPassword) {
      setMessage('Passwords do not match.')
      return
    }
    setBusy(true)
    setMessage('')
    const credentials = { email, password }
    const { error } = mode === 'signin' ? await supabase.auth.signInWithPassword(credentials) : await supabase.auth.signUp(credentials)
    setBusy(false)
    if (error) {
      const friendlyMessage = error.message.toLowerCase().includes('failed to fetch')
        ? 'Could not reach Supabase. confirm your internet connection is on.'
        : error.message
      setMessage(friendlyMessage)
      return
    }
    setMessage(mode === 'signup' ? 'Account created.' : 'Signed in.')
    onClose()
  }

  return (
    <Modal onClose={onClose}>
      <div className="flex items-start gap-4">
        <div className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-teal-500 to-indigo-600 text-white shadow-lg">
          <ShieldCheck className="size-7" />
        </div>
        <div>
          <h2 className="text-2xl font-black">Welcome to NexaGen</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">Sign in or create an account to save progress and manage your plan.</p>
        </div>
      </div>
      <div className="mt-6 space-y-3">
        <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-teal-400" onChange={(event) => setEmail(event.target.value)} placeholder="you@gmail.com" value={email} />
        <label className="flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 focus-within:border-teal-400">
          <input className="min-w-0 flex-1 outline-none" onChange={(event) => setPassword(event.target.value)} placeholder="Password" type={showPassword ? 'text' : 'password'} value={password} />
          <button aria-label={showPassword ? 'Hide password' : 'Show password'} className="text-slate-500" onClick={() => setShowPassword((value) => !value)} type="button">
            {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
          </button>
        </label>
        <label className="flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 focus-within:border-teal-400">
          <input className="min-w-0 flex-1 outline-none" onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Confirm password" type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} />
          <button aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'} className="text-slate-500" onClick={() => setShowConfirmPassword((value) => !value)} type="button">
            {showConfirmPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
          </button>
        </label>
      </div>
      {message && <p className="mt-4 rounded-2xl bg-slate-50 p-3 text-sm text-slate-600">{message}</p>}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <button className="rounded-full bg-slate-950 px-5 py-3 font-bold text-white disabled:opacity-60" disabled={busy} onClick={() => submit('signin')}>
          Already have an account? Sign in
        </button>
        <button className="rounded-full border border-slate-200 bg-white px-5 py-3 font-bold text-slate-800 disabled:opacity-60" disabled={busy} onClick={() => submit('signup')}>
          New here? Create account
        </button>
      </div>
    </Modal>
  )
}

function UnlockModal({
  dashboard,
  onClose,
  userId,
}: {
  dashboard: Dashboard
  onClose: () => void
  userId?: string
}) {
  const [message, setMessage] = useState('')

  const explain = () => {
    if (!userId) {
      setMessage('Sign in first, then choose a test subscription from the pricing section.')
      return
    }
    setMessage('Payment is intentionally paused. Use the Starter or Pro test buttons to verify the SaaS flow before IntaSend integration.')
  }

  return (
    <Modal onClose={onClose}>
      <h2 className="text-2xl font-black">Subscription required</h2>
      <p className="mt-2 leading-6 text-slate-500">{dashboard.title} is controlled by the new monthly SaaS access model.</p>
      <button className="mt-5 w-full rounded-full bg-slate-950 px-5 py-3 font-bold text-white" onClick={explain}>
        Test via pricing plans
      </button>
      {message && (
        <p className="mt-4 rounded-2xl bg-teal-50 p-3 text-sm font-bold text-teal-800">
          {message}
        </p>
      )}
    </Modal>
  )
}

function Modal({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return (
    <motion.div animate={{ opacity: 1 }} className="fixed inset-0 z-50 grid place-items-center bg-slate-950/35 p-4 backdrop-blur-sm" exit={{ opacity: 0 }} initial={{ opacity: 0 }}>
      <motion.div
        animate={{ y: 0, scale: 1 }}
        className="w-full max-w-3xl rounded-[1.5rem] bg-white p-6 shadow-2xl"
        exit={{ y: 20, scale: 0.98 }}
        initial={{ y: 20, scale: 0.98 }}
      >
        {children}
        <button className="mt-4 w-full rounded-full px-5 py-3 font-bold text-slate-500" onClick={onClose}>
          Close
        </button>
      </motion.div>
    </motion.div>
  )
}

export default App
