import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion'
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Code2,
  Compass,
  Download,
  Eye,
  FileText,
  Laptop,
  LockKeyhole,
  LogOut,
  Music2,
  Search,
  ShieldCheck,
  Sparkles,
  Terminal,
  UnlockKeyhole,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from './lib/supabase'
import {
  createPayment,
  getCompletedContent,
  getContentItems,
  getDashboards,
  getUserUnlocks,
  setContentCompleted,
} from './services/nexagenService'
import type { AppUser, ContentItem, Dashboard, PaymentState } from './types/nexagen'

const visuals = [
  'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80',
]

const interests = ['Music', 'Programming', 'Operating Systems', 'PowerShell', 'Computer Basics']
const defaultPdfPath = '/javacript.pdf'

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

function App() {
  const [onboarded, setOnboarded] = useState(() => localStorage.getItem('nexagen:onboarded') === 'true')
  const [appUser, setAppUser] = useState<AppUser>({ mode: 'guest', user: null })
  const [authOpen, setAuthOpen] = useState(false)
  const [dashboards, setDashboards] = useState<Dashboard[]>([])
  const [content, setContent] = useState<ContentItem[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [unlocks, setUnlocks] = useState<string[]>([])
  const [completed, setCompleted] = useState<string[]>([])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) setAppUser({ mode: 'authenticated', user: data.session.user })
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAppUser(session?.user ? { mode: 'authenticated', user: session.user } : { mode: 'guest', user: null })
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    Promise.all([getDashboards(), getContentItems()]).then(([dashboardRows, contentRows]) => {
      setDashboards(dashboardRows)
      setContent(contentRows)
      setSelectedId((current) => current ?? dashboardRows[0]?.id ?? null)
    })
  }, [])

  useEffect(() => {
    if (!appUser.user) {
      setUnlocks([])
      setCompleted([])
      return
    }

    Promise.all([getUserUnlocks(appUser.user.id), getCompletedContent(appUser.user.id)]).then(
      ([unlockRows, completedRows]) => {
        setUnlocks(unlockRows)
        setCompleted(completedRows)
      },
    )
  }, [appUser.user])

  const finishOnboarding = (mode: 'auth' | 'guest') => {
    localStorage.setItem('nexagen:onboarded', 'true')
    setOnboarded(true)
    if (mode === 'auth') setAuthOpen(true)
  }

  const selectedDashboard = dashboards.find((dashboard) => dashboard.id === selectedId) ?? dashboards[0]

  const refreshUserState = async () => {
    if (!appUser.user) return
    const [unlockRows, completedRows] = await Promise.all([
      getUserUnlocks(appUser.user.id),
      getCompletedContent(appUser.user.id),
    ])
    setUnlocks(unlockRows)
    setCompleted(completedRows)
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f7f9fc] text-slate-950">
      <AnimatePresence>
        {!onboarded && <Onboarding onFinish={finishOnboarding} />}
      </AnimatePresence>

      <LandingShell
        appUser={appUser}
        authOpen={authOpen}
        completed={completed}
        content={content}
        dashboards={dashboards}
        onAuthOpen={() => setAuthOpen(true)}
        onAuthClose={() => setAuthOpen(false)}
        onCompletedChange={setCompleted}
        onRefresh={refreshUserState}
        onSelected={setSelectedId}
        selectedDashboard={selectedDashboard}
        unlocks={unlocks}
      />
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
      className="fixed inset-0 z-50 grid place-items-center bg-[#f8fbff] px-4"
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
        className="relative grid w-full max-w-6xl items-center gap-8 rounded-[2rem] border border-white bg-white/70 p-5 shadow-2xl shadow-slate-200/80 backdrop-blur-xl md:grid-cols-[1.05fr_.95fr] md:p-8"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={(_, info) => {
          if (info.offset.x < -90) setStep((value) => Math.min(value + 1, slides.length - 1))
          if (info.offset.x > 90) setStep((value) => Math.max(value - 1, 0))
        }}
        style={{ x: dragX, rotate }}
      >
        <div className="relative min-h-[440px] overflow-hidden rounded-[1.5rem] bg-slate-950">
          {visuals.map((src, index) => (
            <motion.img
              alt=""
              animate={{ opacity: index === step % visuals.length ? 1 : 0, scale: index === step % visuals.length ? 1 : 1.08 }}
              className="absolute inset-0 h-full w-full object-cover"
              key={src}
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

        <div className="p-2 md:p-4">
          <div className="mb-8 flex gap-2">
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
              <p className="mb-3 text-sm font-semibold uppercase tracking-[.18em] text-teal-700">NexaGen Learning</p>
              <h1 className="max-w-xl text-4xl font-black leading-tight text-slate-950 md:text-6xl">{current.title}</h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">{current.copy}</p>

              {step === 1 && (
                <div className="mt-8 flex flex-wrap gap-3">
                  {interests.map((interest) => (
                    <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm" key={interest}>
                      {interest}
                    </button>
                  ))}
                </div>
              )}

              {step === 2 && (
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
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

          <div className="mt-10 flex flex-wrap gap-3">
            {step < slides.length - 1 ? (
              <>
                <button className="rounded-full bg-slate-950 px-6 py-3 font-bold text-white shadow-lg" onClick={() => setStep(step + 1)}>
                  {current.action}
                </button>
                <button className="rounded-full px-6 py-3 font-bold text-slate-600" onClick={() => onFinish('guest')}>
                  Skip
                </button>
              </>
            ) : (
              <>
                <button className="rounded-full bg-slate-950 px-6 py-3 font-bold text-white shadow-lg" onClick={() => onFinish('auth')}>
                  Proceed with Authentication
                </button>
                <button className="rounded-full border border-slate-200 bg-white px-6 py-3 font-bold text-slate-700" onClick={() => onFinish('guest')}>
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
  onRefresh: () => Promise<void>
  onSelected: (id: string) => void
  selectedDashboard?: Dashboard
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
    onRefresh,
    onSelected,
    selectedDashboard,
    unlocks,
  } = props
  const [query, setQuery] = useState('')
  const [unlockTarget, setUnlockTarget] = useState<Dashboard | null>(null)

  const selectedContent = useMemo(() => {
    if (!selectedDashboard) return []
    const dashboardSlug = slugForDashboard(selectedDashboard.title)
    return content.filter((item) => item.dashboard_id === selectedDashboard.id || item.dashboard_id === dashboardSlug)
  }, [content, selectedDashboard])

  const completedInSelected = selectedContent.filter((item) => completed.includes(item.id)).length
  const progress = selectedContent.length ? Math.round((completedInSelected / selectedContent.length) * 100) : 0

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-white/70 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <button className="flex items-center gap-3" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className="grid size-11 place-items-center rounded-2xl bg-slate-950 text-white shadow-lg">
              <Compass className="size-5" />
            </span>
            <span>
              <span className="block text-xl font-black">NexaGen</span>
              <span className="block text-xs font-semibold uppercase tracking-[.18em] text-teal-700">Learn and unlock</span>
            </span>
          </button>
          <div className="flex items-center gap-3">
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

      <section className="relative overflow-hidden px-4 py-10 md:py-14">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(120deg,#f8fbff_0%,#eefdf8_45%,#fff7ed_100%)]" />
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[.9fr_1.1fr]">
          <div className="self-center">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-white/70 px-4 py-2 text-sm font-bold text-teal-700 shadow-sm">
              <ShieldCheck className="size-4" />
              Secure Supabase + IntaSend architecture
            </p>
            <h1 className="max-w-3xl text-5xl font-black leading-[1.02] text-slate-950 md:text-7xl">NexaGen</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              A bright, focused dashboard for music theory, keyboard fluency, programming foundations, OS skills,
              troubleshooting, and PowerShell learning.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a className="rounded-full bg-slate-950 px-6 py-3 font-bold text-white shadow-xl" href="#dashboards">
                Explore dashboards
              </a>
              <button className="rounded-full border border-slate-200 bg-white px-6 py-3 font-bold text-slate-800 shadow-sm" onClick={onAuthOpen}>
                Save progress
              </button>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {visuals.map((src, index) => (
              <motion.img
                alt=""
                animate={{ y: index % 2 ? 18 : -12 }}
                className="h-72 w-full rounded-[1.5rem] object-cover shadow-2xl shadow-slate-200"
                key={src}
                src={src}
                transition={{ duration: 3 + index, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[.8fr_1.2fr]" id="dashboards">
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
              const isUnlocked = !dashboard.is_locked || unlocks.includes(dashboard.id)
              return (
                <button
                  className={`rounded-2xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${
                    selectedDashboard?.id === dashboard.id ? 'border-teal-400 ring-4 ring-teal-100' : 'border-slate-100'
                  }`}
                  key={dashboard.id}
                  onClick={() => onSelected(dashboard.id)}
                >
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <span className="grid size-12 place-items-center rounded-2xl bg-slate-950 text-white">
                      <Icon className="size-5" />
                    </span>
                    <span className={`rounded-full px-3 py-1 text-xs font-black ${isUnlocked ? 'bg-teal-50 text-teal-700' : 'bg-amber-50 text-amber-700'}`}>
                      {isUnlocked ? 'Open' : `KES ${dashboard.price}`}
                    </span>
                  </div>
                  <h3 className="text-lg font-black">{dashboard.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{dashboard.description}</p>
                </button>
              )
            })}
          </div>
        </div>

        {selectedDashboard && (
          <DashboardDetail
            appUser={appUser}
            completed={completed}
            dashboard={selectedDashboard}
            items={selectedContent}
            onCompletedChange={onCompletedChange}
            onUnlock={() => setUnlockTarget(selectedDashboard)}
            progress={progress}
            query={query}
            setQuery={setQuery}
            unlocks={unlocks}
          />
        )}
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-10 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <span>NexaGen uses backend-verified unlocks. Guests can learn free modules without saving progress.</span>
        <span className="rounded-full border border-slate-200 bg-white px-4 py-2 font-bold text-slate-700 shadow-sm">Payments by IntaSend</span>
      </footer>

      <AnimatePresence>
        {authOpen && <AuthModal onClose={onAuthClose} />}
        {unlockTarget && (
          <UnlockModal
            dashboard={unlockTarget}
            onClose={() => setUnlockTarget(null)}
            onRefresh={onRefresh}
            userId={appUser.user?.id}
          />
        )}
      </AnimatePresence>
    </>
  )
}

function DashboardDetail({
  appUser,
  completed,
  dashboard,
  items,
  onCompletedChange,
  onUnlock,
  progress,
  query,
  setQuery,
  unlocks,
}: {
  appUser: AppUser
  completed: string[]
  dashboard: Dashboard
  items: ContentItem[]
  onCompletedChange: (ids: string[]) => void
  onUnlock: () => void
  progress: number
  query: string
  setQuery: (value: string) => void
  unlocks: string[]
}) {
  const isUnlocked = !dashboard.is_locked || unlocks.includes(dashboard.id)
  const visibleItems = items.filter((item) => `${item.title} ${item.body}`.toLowerCase().includes(query.toLowerCase()))

  const toggleCompleted = async (itemId: string) => {
    if (!appUser.user) return
    const nextCompleted = completed.includes(itemId) ? completed.filter((id) => id !== itemId) : [...completed, itemId]
    onCompletedChange(nextCompleted)
    await setContentCompleted(appUser.user.id, itemId, nextCompleted.includes(itemId))
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
        {!visibleItems.length && <p className="rounded-2xl bg-slate-50 p-5 text-slate-500">No content matched that search.</p>}
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
        <span className="font-black">{item.title}</span>
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

function AuthModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (mode: 'signin' | 'signup') => {
    setBusy(true)
    setMessage('')
    const credentials = { email, password }
    const { error } = mode === 'signin' ? await supabase.auth.signInWithPassword(credentials) : await supabase.auth.signUp(credentials)
    setBusy(false)
    if (error) {
      const friendlyMessage = error.message.toLowerCase().includes('failed to fetch')
        ? 'Could not reach Supabase. Stop the dev server, run npm run dev again, and confirm your internet connection is on.'
        : error.message
      setMessage(friendlyMessage)
      return
    }
    setMessage(mode === 'signup' ? 'Check email if confirmation is enabled, or continue if your project allows instant sign-in.' : 'Signed in.')
    if (mode === 'signin') onClose()
  }

  return (
    <Modal onClose={onClose}>
      <h2 className="text-2xl font-black">Authentication</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">Use email and password. Supabase handles the account securely.</p>
      <div className="mt-6 space-y-3">
        <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-teal-400" onChange={(event) => setEmail(event.target.value)} placeholder="you@gmail.com" value={email} />
        <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-teal-400" onChange={(event) => setPassword(event.target.value)} placeholder="Password" type="password" value={password} />
      </div>
      {message && <p className="mt-4 rounded-2xl bg-slate-50 p-3 text-sm text-slate-600">{message}</p>}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <button className="rounded-full bg-slate-950 px-5 py-3 font-bold text-white disabled:opacity-60" disabled={busy} onClick={() => submit('signin')}>
          Sign in
        </button>
        <button className="rounded-full border border-slate-200 bg-white px-5 py-3 font-bold text-slate-800 disabled:opacity-60" disabled={busy} onClick={() => submit('signup')}>
          Create account
        </button>
      </div>
    </Modal>
  )
}

function UnlockModal({
  dashboard,
  onClose,
  onRefresh,
  userId,
}: {
  dashboard: Dashboard
  onClose: () => void
  onRefresh: () => Promise<void>
  userId?: string
}) {
  const [phone, setPhone] = useState('')
  const [state, setState] = useState<PaymentState>('idle')
  const [message, setMessage] = useState('')

  const pay = async () => {
    if (!userId) {
      setState('failed')
      setMessage('Sign in before unlocking paid dashboards.')
      return
    }

    setState('pending')
    setMessage('Sending STK Push to your phone.')
    try {
      const result = await createPayment({ user_id: userId, dashboard_id: dashboard.id, phone_number: phone })
      setState('success')
      setMessage(result.message ?? 'Payment request created. The dashboard unlocks after IntaSend confirms the transaction.')
      await onRefresh()
    } catch (error) {
      setState('failed')
      setMessage(error instanceof Error ? error.message : 'Payment failed to start.')
    }
  }

  return (
    <Modal onClose={onClose}>
      <h2 className="text-2xl font-black">Unlock {dashboard.title}</h2>
      <p className="mt-2 leading-6 text-slate-500">Enter an M-Pesa number in 2547XXXXXXXX format. Unlocking is finalized only by the webhook.</p>
      <input className="mt-6 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-teal-400" onChange={(event) => setPhone(event.target.value)} placeholder="2547XXXXXXXX" value={phone} />
      <button className="mt-5 w-full rounded-full bg-slate-950 px-5 py-3 font-bold text-white disabled:opacity-60" disabled={state === 'pending'} onClick={pay}>
        {state === 'pending' ? 'Waiting for STK Push' : `Unlock for KES ${dashboard.price}`}
      </button>
      {message && (
        <p className={`mt-4 rounded-2xl p-3 text-sm ${state === 'failed' ? 'bg-red-50 text-red-700' : 'bg-teal-50 text-teal-800'}`}>
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
        className="w-full max-w-md rounded-[1.5rem] bg-white p-6 shadow-2xl"
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
