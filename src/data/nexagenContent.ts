import type { ContentItem, Dashboard, Subtopic } from '../types/nexagen'

export const fallbackDashboards: Dashboard[] = [
  {
    id: 'music-theory',
    title: 'Music Theory',
    description: 'Learn deep music theory, keys, pitch, harmony, and ear training.',
    is_locked: false,
    price: 0,
  },
  {
    id: 'piano-12-keys',
    title: 'Piano (12 Keys)',
    description: 'Master all twelve keys with interval patterns, chord families, and practice prompts.',
    is_locked: true,
    price: 100,
  },
  {
    id: 'find-my-key-pitch',
    title: 'Find My Key & Pitch',
    description: 'Identify your musical key, vocal range, and pitch center with guided checks.',
    is_locked: true,
    price: 100,
  },
  {
    id: 'programming',
    title: 'Programming',
    description: 'Start with web, mobile, language basics, logic, and developer workflow.',
    is_locked: false,
    price: 0,
  },
  {
    id: 'operating-systems',
    title: 'Operating Systems',
    description: 'Understand Kali, Windows, Linux concepts, filesystems, processes, and security basics.',
    is_locked: true,
    price: 100,
  },
  {
    id: 'installing-troubleshooting',
    title: 'Installing & Troubleshooting',
    description: 'Fix boot issues, install OSes, recover systems, and isolate common hardware faults.',
    is_locked: false,
    price: 0,
  },
  {
    id: 'computer-basics',
    title: 'Computer Basics',
    description: 'Build strong fundamentals in hardware, software, networking, and everyday maintenance.',
    is_locked: false,
    price: 0,
  },
  {
    id: 'powershell-commands',
    title: 'PowerShell Commands',
    description: 'Master shell navigation, files, processes, networking, and automation commands.',
    is_locked: true,
    price: 100,
  },
]

const qna = (dashboard_id: string, id: string, title: string, body: string): ContentItem => ({
  id,
  dashboard_id,
  title,
  body,
  answer: body,
  explanation: body,
  type: 'qna',
  is_locked: false,
})

const pianoSubtopicTitles = [
  'Piano Basics',
  'Understanding Keys',
  'Major Scales',
  'Minor Scales',
  'Chords (Major)',
  'Chords (Minor)',
  'Chord Progressions',
  'Ear Training',
  'Sight Reading',
  'Finger Techniques',
  'Rhythm Basics',
  'Advanced Rhythm',
  'Improvisation',
  'Playing by Ear',
  'Music Theory Applied',
  'Scales Practice',
  'Arpeggios',
  'Harmony',
  'Performance Skills',
  'Song Practice',
]

export const fallbackSubtopics: Subtopic[] = pianoSubtopicTitles.map((title, index) => ({
  id: `piano-subtopic-${index + 1}`,
  dashboard_id: 'piano-12-keys',
  title,
  description: `${title} lessons with theory checks, practical prompts, progress tracking, and piano practice mode.`,
  price: 100,
  is_locked: true,
  pdf_path: null,
}))

const pianoQna = (subtopic: Subtopic): ContentItem[] => {
  const slug = subtopic.id
  return Array.from({ length: 20 }, (_, itemIndex) => {
    const isTheory = itemIndex < 10
    const number = itemIndex + 1
    const title = isTheory
      ? `${subtopic.title}: theory check ${number}`
      : `${subtopic.title}: practical drill ${number - 10}`
    const answer = isTheory
      ? `${subtopic.title} connects to the 12-key system by naming the pattern, hearing its color, and moving it through C, Db, D, Eb, E, F, Gb, G, Ab, A, Bb, and B.`
      : `Play the idea slowly in C, then move by half steps until all 12 keys feel familiar. Keep the hand relaxed and repeat any key that feels slippery.`
    const explanation = isTheory
      ? `Theory becomes useful when it predicts what your fingers and ears should expect. Tiny joke: the keyboard has many keys, but it still appreciates labels.`
      : `Practical fluency comes from small repetitions across every key, not heroic speed. Slow work is still work, just wearing better shoes.`

    return {
      id: `${slug}-q${number}`,
      dashboard_id: 'piano-12-keys',
      subtopic_id: subtopic.id,
      title,
      body: `${answer} ${explanation}`,
      answer,
      explanation,
      category: isTheory ? 'theory' : 'practical',
      type: 'qna',
      is_locked: false,
    }
  })
}

export const fallbackContent: ContentItem[] = [
  qna('music-theory', 'music-1', 'What is a key in music?', 'A key is the tonal home of a song. It tells you which note feels resolved and which scale or chord family most notes come from.'),
  qna('music-theory', 'music-2', 'How do major and minor keys feel different?', 'Major keys often feel brighter because of the major third. Minor keys use a flattened third, which creates a darker or more reflective color.'),
  qna('music-theory', 'music-3', 'What is the circle of fifths for?', 'It maps key relationships, chord movement, sharps, flats, and modulation. It is a musician dashboard for harmony.'),
  qna('piano-12-keys', 'piano-1', 'How should I practice all 12 keys?', 'Move one pattern through every key: scale, triads, inversions, then a simple progression like I-IV-V-I. Keep the fingering slow and consistent.'),
  qna('piano-12-keys', 'piano-2', 'Why are inversions important?', 'Inversions let your hands move smoothly between chords instead of jumping around the keyboard.'),
  qna('find-my-key-pitch', 'pitch-1', 'How can I find my vocal key?', 'Sing a comfortable phrase, locate the lowest and highest stable notes, then choose a key that keeps the melody in that range.'),
  qna('find-my-key-pitch', 'pitch-2', 'What is pitch matching?', 'Pitch matching is hearing a note and reproducing it accurately with your voice or instrument.'),
  qna('programming', 'programming-1', 'What is a variable?', 'A variable is a named container for a value. Programs use variables to remember data and make decisions.'),
  qna('programming', 'programming-2', 'What is an API?', 'An API is a contract that lets one program talk to another using defined requests and responses.'),
  qna('programming', 'programming-3', 'What is debugging?', 'Debugging is the process of finding why code behaves differently from what you expected, then proving the fix.'),
  qna('operating-systems', 'os-1', 'What does an operating system do?', 'An OS manages hardware, files, memory, processes, users, networking, and the interface between apps and the machine.'),
  qna('operating-systems', 'os-2', 'Why use Linux or Kali?', 'Linux is flexible and transparent. Kali packages security tools for controlled learning and authorized testing.'),
  qna('installing-troubleshooting', 'trouble-1', 'What should I check before reinstalling an OS?', 'Back up data, confirm drivers, verify boot media, check disk health, and record license or account recovery details.'),
  qna('installing-troubleshooting', 'trouble-2', 'How do I isolate a boot problem?', 'Check power, BIOS boot order, storage detection, boot media, error messages, and recent hardware or software changes.'),
  qna('computer-basics', 'basics-1', 'What are CPU, RAM, and storage?', 'The CPU processes instructions, RAM holds active working data, and storage keeps files long term.'),
  qna('computer-basics', 'basics-2', 'What is safe computer maintenance?', 'Update software, keep backups, avoid suspicious downloads, monitor storage, and clean dust carefully when powered off.'),
  qna('powershell-commands', 'ps-1', 'How do I list files in PowerShell?', 'Use Get-ChildItem. Add -Force to show hidden items and -Recurse to walk folders.'),
  qna('powershell-commands', 'ps-2', 'How do I inspect running processes?', 'Use Get-Process, then filter with Where-Object or sort with Sort-Object.'),
  ...fallbackSubtopics.flatMap((subtopic) => pianoQna(subtopic)),
]
