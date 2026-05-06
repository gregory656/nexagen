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
  'Basics of Piano',
  'Understanding Keys',
  'Major Scales',
  'Minor Scales',
  'Chords',
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

type PianoTheoryQuestion = {
  question: string
  options: [string, string, string, string]
  correct: 'A' | 'B' | 'C' | 'D'
  whyCorrect: string
  whyWrong: string
  humor: string
}

type PianoPracticalQuestion = {
  instruction: string
  expected: string
  visual: string
}

const theoryBody = (item: PianoTheoryQuestion) => [
  `Question: ${item.question}`,
  `A. ${item.options[0]}`,
  `B. ${item.options[1]}`,
  `C. ${item.options[2]}`,
  `D. ${item.options[3]}`,
  `Correct answer: ${item.correct}`,
  `Why correct: ${item.whyCorrect}`,
  `Why others are wrong: ${item.whyWrong}`,
  `Light humor: ${item.humor}`,
  `Flow: If correct, proceed. If wrong, continue but mark incorrect. End screen shows Theory score (/10) and Practical score (/10).`,
].join('\n')

const practicalBody = (item: PianoPracticalQuestion) => [
  `Instruction: ${item.instruction}`,
  `Expected answer: ${item.expected}`,
  `Visual explanation: ${item.visual}`,
  `Flow: If correct, proceed. If wrong, continue but mark incorrect. End screen shows Theory score (/10) and Practical score (/10).`,
].join('\n')

const pianoTheoryByTitle: Record<string, PianoTheoryQuestion[]> = {
  'Basics of Piano': [
    { question: 'What makes the piano layout repeat every octave?', options: ['A 12-note pattern of white and black keys', 'A 7-note pattern with no accidentals', 'A random pattern chosen by songwriters', 'A drum pattern hidden under the keys'], correct: 'A', whyCorrect: 'Each octave contains 12 semitones: 7 white keys and 5 black keys.', whyWrong: 'B ignores black keys, C is not how the keyboard is built, and D is charmingly impossible unless your piano is very confused.', humor: 'The keyboard repeats itself because even music likes reusable components.' },
    { question: 'Which note is immediately to the left of a group of two black keys?', options: ['C', 'F', 'B', 'G#'], correct: 'A', whyCorrect: 'C sits directly before the two-black-key group, which makes it the fastest landmark for beginners.', whyWrong: 'F is before the three-black-key group, B is just before C, and G# is a black key name.', humor: 'Find the two black keys, and C waves like the student who actually did the homework.' },
    { question: 'What is the best first habit when pressing a piano key?', options: ['Stay relaxed and press with controlled weight', 'Hit as hard as possible', 'Keep the wrist locked', 'Only use one finger forever'], correct: 'A', whyCorrect: 'Relaxed hands produce better tone, timing, and endurance.', whyWrong: 'Force causes tension, locked wrists reduce control, and one-finger playing turns every song into a traffic jam.', humor: 'The piano is not a doorbell with ambitions.' },
    { question: 'What is middle C commonly used for?', options: ['A central reference point on the keyboard', 'The highest note on every piano', 'A chord type', 'A black key between D and E'], correct: 'A', whyCorrect: 'Middle C helps learners orient the hands near the center of the instrument.', whyWrong: 'It is not the highest note, not a chord, and C is a white key.', humor: 'Middle C is basically the keyboard saying, start here, friend.' },
    { question: 'What does an octave mean on piano?', options: ['The distance from one note name to the next same note name', 'Any three keys played together', 'Only the black keys', 'A song played loudly'], correct: 'A', whyCorrect: 'C to the next C, or F# to the next F#, is one octave.', whyWrong: 'Three keys make a possible chord, black keys are accidentals/pentatonic landmarks, and loudness is dynamics.', humor: 'An octave is musical deja vu with better pitch.' },
    { question: 'Why should beginners name notes out loud while playing?', options: ['It connects eye, ear, hand, and memory', 'It makes the piano tune itself', 'It replaces rhythm practice', 'It only matters for singers'], correct: 'A', whyCorrect: 'Speaking note names builds recall and reduces guessing.', whyWrong: 'It does not tune the piano, rhythm still matters, and instrumentalists need naming too.', humor: 'Sadly, yelling C at an untuned piano does not fix it. I checked emotionally.' },
    { question: 'Which pair describes piano tone control best?', options: ['Attack and release', 'Copy and paste', 'Upload and download', 'Salt and pepper'], correct: 'A', whyCorrect: 'How you press and release a key shapes the sound.', whyWrong: 'The other pairs are useful elsewhere, but they will not explain piano touch.', humor: 'Copy-paste would be useful for difficult measures, but music insists on character growth.' },
    { question: 'What should you do before trying to play fast?', options: ['Play slowly with even rhythm', 'Skip note names', 'Tense the hand for power', 'Ignore mistakes and hope'], correct: 'A', whyCorrect: 'Slow, even practice builds reliable movement and timing.', whyWrong: 'Skipping names weakens memory, tension blocks speed, and hope is not a practice method.', humor: 'Speed is slow practice wearing a nice jacket.' },
    { question: 'What does fingering mean?', options: ['Choosing which fingers play which keys', 'Painting numbers on the piano', 'Playing only white keys', 'Changing the piano sound setting'], correct: 'A', whyCorrect: 'Fingering plans efficient hand movement and prevents awkward jumps.', whyWrong: 'The other answers confuse labels, note choices, or keyboard settings with technique.', humor: 'Good fingering saves your hand from doing acrobatics it never auditioned for.' },
    { question: 'What is the clearest beginner practice loop?', options: ['See the key, name it, play it, listen, repeat', 'Guess, panic, restart', 'Only watch tutorials', 'Play everything at full speed first'], correct: 'A', whyCorrect: 'This loop builds visual recognition, vocabulary, motor control, and ear feedback.', whyWrong: 'Guessing is fragile, watching is passive, and full speed hides mistakes.', humor: 'Panic is dramatic, but it has poor rhythm.' },
  ],
  'Understanding Keys': [
    { question: 'What is a musical key?', options: ['A tonal home built around a central note and scale', 'A physical key only', 'A random collection of notes', 'The loudest note in a song'], correct: 'A', whyCorrect: 'A key tells you which note feels resolved and which scale/chords are most likely.', whyWrong: 'Physical keys are the interface, random notes lack tonal center, and loudness does not define key.', humor: 'A key is home base, not just the thing your finger pokes.' },
    { question: 'Why are black keys named with sharps or flats?', options: ['They sit between natural notes and can be named from either side', 'They are always wrong notes', 'They belong only to jazz', 'They are decoration'], correct: 'A', whyCorrect: 'C# and Db can point to the same key depending on musical context.', whyWrong: 'Black keys are real notes, all styles use them, and the piano was not decorated by accident.', humor: 'Black keys are not spicy white keys. They have jobs.' },
    { question: 'Which note is before the three-black-key group?', options: ['F', 'C', 'E', 'Bb'], correct: 'A', whyCorrect: 'F is the white key immediately to the left of the group of three black keys.', whyWrong: 'C marks the two-black-key group, E is before F, and Bb is a black key.', humor: 'Two black keys point to C; three black keys point to F. The keyboard left breadcrumbs.' },
    { question: 'What is a semitone?', options: ['The smallest step from one piano key to the next', 'A jump over seven keys', 'A chord made of two notes', 'A rhythm pattern'], correct: 'A', whyCorrect: 'Moving to the immediately adjacent key, white or black, is one semitone.', whyWrong: 'Large jumps, chords, and rhythm describe different musical ideas.', humor: 'A semitone is the piano equivalent of one tiny step, no gym membership needed.' },
    { question: 'What is a whole tone?', options: ['Two semitones', 'One adjacent key', 'Any chord', 'A note held for four beats'], correct: 'A', whyCorrect: 'A whole tone skips one piano key between start and destination.', whyWrong: 'One adjacent key is a semitone, chords stack notes, and beat length is rhythm.', humor: 'Whole tone: two small steps pretending to be one confident stride.' },
    { question: 'What does transposing mean?', options: ['Moving the same pattern to a new starting note', 'Playing with only the left hand', 'Changing tempo', 'Using the sustain pedal'], correct: 'A', whyCorrect: 'Transposition keeps relationships the same while changing pitch level.', whyWrong: 'Hand choice, tempo, and pedal use do not define key movement.', humor: 'Transpose is copy-paste for patterns, but your fingers still have to show up.' },
    { question: 'Which key has no sharps or flats in its major scale?', options: ['C major', 'D major', 'E major', 'F# major'], correct: 'A', whyCorrect: 'C major uses only white keys: C D E F G A B.', whyWrong: 'D, E, and F# major all require sharps.', humor: 'C major is the clean desk of piano keys.' },
    { question: 'What is an accidental?', options: ['A sharp, flat, or natural that changes a note', 'A wrong note by definition', 'A broken piano key', 'A metronome setting'], correct: 'A', whyCorrect: 'Accidentals temporarily alter pitch notation.', whyWrong: 'They can be correct, not broken hardware, and not tempo.', humor: 'Accidental is a formal music word, not an apology.' },
    { question: 'Why learn key landmarks first?', options: ['They make note-finding faster and reduce guessing', 'They replace ear training forever', 'They make scales unnecessary', 'They only help advanced players'], correct: 'A', whyCorrect: 'C/F landmarks and black-key groups speed orientation.', whyWrong: 'Ear training and scales still matter, and beginners benefit immediately.', humor: 'Landmarks prevent keyboard wandering, which is cheaper than musical GPS.' },
    { question: 'What should you preserve when moving a melody from C to D?', options: ['The interval pattern', 'The exact same physical keys', 'Only the rhythm, never the notes', 'The same finger on every note'], correct: 'A', whyCorrect: 'Keeping intervals preserves the melody in the new key.', whyWrong: 'Same physical keys stay in C, rhythm alone loses melody, and fingering may change.', humor: 'Melodies move house by carrying relationships, not furniture.' },
  ],
}

const pianoPracticalByTitle: Record<string, PianoPracticalQuestion[]> = {
  'Basics of Piano': [
    { instruction: 'Press C4, then release cleanly.', expected: 'C4', visual: 'Find the group of two black keys near the center; C4 is the white key immediately to their left.' },
    { instruction: 'Press D4.', expected: 'D4', visual: 'D4 is the white key between the two black keys in the central two-black-key group.' },
    { instruction: 'Press E4.', expected: 'E4', visual: 'E4 is the white key immediately to the right of the two-black-key group.' },
    { instruction: 'Press F4.', expected: 'F4', visual: 'Find the three black keys; F4 is the white key immediately to their left.' },
    { instruction: 'Play C4, D4, E4 slowly with fingers 1, 2, 3.', expected: 'C4 D4 E4', visual: 'Use the three adjacent white keys around the two-black-key group: left of group, between group, right of group.' },
    { instruction: 'Play C4 and then C5.', expected: 'C4 C5', visual: 'Start at middle C, then move right to the next white key with the same C position before a two-black-key group.' },
    { instruction: 'Identify and press the lowest C you can comfortably reach with your left hand.', expected: 'Any lower C', visual: 'Scan left for another two-black-key group; press the white key immediately before it.' },
    { instruction: 'Play C4 four times with even spacing.', expected: 'C4 C4 C4 C4', visual: 'Stay on middle C and keep the wrist relaxed; the key should return fully each time.' },
    { instruction: 'Press G4 after finding F4.', expected: 'G4', visual: 'From F4, move two white keys to the right: F, G. G sits between the first and second black keys of the three-black-key group.' },
    { instruction: 'Play C4 E4 G4 one note at a time.', expected: 'C4 E4 G4', visual: 'Use every other white key starting on C: C left of two black keys, E right of them, G inside the three-black-key group area.' },
  ],
  'Understanding Keys': [
    { instruction: 'Press C#, then name its flat equivalent.', expected: 'C# / Db', visual: 'C# is the left black key in the two-black-key group; the same key can be called Db from the D side.' },
    { instruction: 'Press F#, then name its flat equivalent.', expected: 'F# / Gb', visual: 'F# is the left black key in the three-black-key group; it also functions as Gb.' },
    { instruction: 'Play all white keys from C4 to C5.', expected: 'C4 D4 E4 F4 G4 A4 B4 C5', visual: 'Start left of the two black keys and move through each white key until the next C.' },
    { instruction: 'Play a chromatic climb from C4 to E4.', expected: 'C4 C#4 D4 D#4 E4', visual: 'Press every adjacent key, including black keys, from C to E.' },
    { instruction: 'Play whole tones from C4 to E4.', expected: 'C4 D4 E4', visual: 'Move two semitones at a time: C to D skips C#, D to E skips D#.' },
    { instruction: 'Transpose C4 D4 E4 up one whole tone.', expected: 'D4 E4 F#4', visual: 'Move each note two semitones to the right; E becomes F# because there is no black key between E and F.' },
    { instruction: 'Press Bb4, then name its sharp equivalent.', expected: 'Bb / A#', visual: 'Bb is the right black key in the three-black-key group; the same key can be called A# from the A side.' },
    { instruction: 'Find E4, then play the nearest F.', expected: 'F4', visual: 'E is right of the two-black-key group; F is the next white key to the right.' },
    { instruction: 'Play C major using only white keys.', expected: 'C D E F G A B C', visual: 'From C to the next C, press each white key with no black keys.' },
    { instruction: 'Play the same note name in three octaves: C3, C4, C5.', expected: 'C3 C4 C5', visual: 'Each C is immediately left of a two-black-key group; move from lower to middle to higher keyboard range.' },
  ],
}

const compactTheory = (title: string): PianoTheoryQuestion[] => [
  { question: `What is the core pattern behind ${title}?`, options: ['A repeatable interval formula', 'A random set of favorite notes', 'A rhythm-only exercise', 'A pedal technique'], correct: 'A', whyCorrect: `${title} works because its sound comes from stable note distances.`, whyWrong: 'Random notes, rhythm alone, and pedal use do not define the pitch structure.', humor: 'Patterns are music theory doing useful office work.' },
  { question: `Why should ${title} be practiced in more than one key?`, options: ['So the pattern becomes transferable', 'So the piano gets louder', 'So you can avoid note names', 'So mistakes disappear automatically'], correct: 'A', whyCorrect: 'Moving through keys proves you understand the relationship, not just one memorized shape.', whyWrong: 'Volume, avoidance, and magical mistake removal are not learning strategies.', humor: 'Transpose the idea before the idea gets too comfortable on the couch.' },
  { question: `What should stay consistent when moving ${title} to a new root?`, options: ['The interval relationships', 'The exact same keys', 'The song title', 'The bench position only'], correct: 'A', whyCorrect: 'The formula preserves the musical identity across roots.', whyWrong: 'Same keys do not transpose, and bench geography is not harmony.', humor: 'Your fingers may move, but the math keeps a clipboard.' },
  { question: `Which practice tempo is best when first learning ${title}?`, options: ['Slow enough to name every note accurately', 'As fast as possible', 'Only fast with pedal', 'Tempo does not matter'], correct: 'A', whyCorrect: 'Slow naming exposes gaps and builds accurate memory.', whyWrong: 'Speed and pedal can hide errors; tempo absolutely affects learning.', humor: 'Slow is not weak. Slow is accuracy in work clothes.' },
  { question: `What is the main ear-training goal for ${title}?`, options: ['Recognize the sound color before seeing the notes', 'Memorize only finger numbers', 'Ignore wrong notes', 'Play with eyes closed immediately'], correct: 'A', whyCorrect: 'Hearing the sound helps you identify and use it musically.', whyWrong: 'Finger numbers help technique, but ears guide music; ignoring errors is just confidence with no steering wheel.', humor: 'Your ears are allowed in the meeting.' },
  { question: `What is a good first test for ${title}?`, options: ['Play it, name the notes, then explain the formula', 'Play it once and declare mastery', 'Only read the definition', 'Change the topic'], correct: 'A', whyCorrect: 'Performance, naming, and explanation prove practical understanding.', whyWrong: 'One attempt, passive reading, and escape plans are too shallow.', humor: 'Mastery usually asks for receipts.' },
  { question: `Why compare correct and incorrect versions of ${title}?`, options: ['It trains your ear to catch the important note changes', 'It makes wrong notes legal forever', 'It removes the need for practice', 'It only helps composers'], correct: 'A', whyCorrect: 'Contrasting versions makes the defining notes obvious.', whyWrong: 'Wrong notes need context, practice remains necessary, and performers benefit too.', humor: 'A wrong note can be a teacher, but do not put it in charge.' },
  { question: `What should your hand feel like during ${title}?`, options: ['Relaxed, balanced, and controlled', 'Locked and tense', 'Floating randomly', 'Pressed into the keys with force'], correct: 'A', whyCorrect: 'Relaxed control improves tone and reduces fatigue.', whyWrong: 'Tension, randomness, and force make accuracy harder.', humor: 'Hands learn faster when they are not filing complaints.' },
  { question: `How should mistakes be handled in ${title}?`, options: ['Mark incorrect, continue, then retry the exact spot slowly', 'Stop the whole session', 'Pretend it was jazz every time', 'Only practice easier things'], correct: 'A', whyCorrect: 'Continuing preserves flow while targeted retry fixes the weakness.', whyWrong: 'Stopping, pretending, or avoiding does not build retention.', humor: 'Jazz is real. Your missed F# still needs attention.' },
  { question: `What proves ${title} is ready for songs?`, options: ['You can play it evenly, name it, and hear its function', 'You can play it once very loud', 'You forgot the formula but moved fast', 'You used every finger randomly'], correct: 'A', whyCorrect: 'Songs need reliable sound, timing, naming, and musical purpose.', whyWrong: 'Loudness, speed without understanding, and random fingering are fragile.', humor: 'Songs expose shortcuts with excellent timing.' },
]

const compactPractical = (title: string): PianoPracticalQuestion[] => [
  { instruction: `Play ${title} starting on C.`, expected: `${title} in C`, visual: 'Start at C, the white key left of two black keys, then follow the subtopic formula across nearby keys.' },
  { instruction: `Play ${title} starting on D.`, expected: `${title} in D`, visual: 'Start on D between the two black keys and preserve the same interval pattern from the C version.' },
  { instruction: `Play ${title} starting on F.`, expected: `${title} in F`, visual: 'Start on F left of the three-black-key group; use black keys only when the formula requires them.' },
  { instruction: `Name every note before pressing ${title} in G.`, expected: `${title} note names in G`, visual: 'Locate G inside the three-black-key area, speak each target note, then press slowly.' },
  { instruction: `Play ${title} ascending, then descending, in C.`, expected: `${title} up and down in C`, visual: 'Move right for ascending, then reverse the same keys leftward without changing the pattern.' },
  { instruction: `Play one wrong version of ${title}, then correct it.`, expected: `Incorrect attempt marked, corrected ${title}`, visual: 'Change one defining note, hear the difference, then restore the correct key.' },
  { instruction: `Play ${title} with a metronome-like count: 1 2 3 4.`, expected: `Evenly timed ${title}`, visual: 'Each note or chord should land on a steady pulse with no rushed middle notes.' },
  { instruction: `Move ${title} from C to Db by shifting every note one semitone right.`, expected: `${title} in Db`, visual: 'Every key moves to the immediately adjacent key on the right, white or black.' },
  { instruction: `Play ${title} softly, then medium-loud, without speeding up.`, expected: `Two dynamic versions of ${title}`, visual: 'Use the same keys and timing; only change touch weight.' },
  { instruction: `Record your final attempt: play, name, and explain ${title}.`, expected: `Playable ${title} plus spoken note names and formula`, visual: 'Use the keyboard shape as proof: root position first, then formula, then clean sound.' },
]

const pianoQna = (subtopic: Subtopic): ContentItem[] => {
  const theory = pianoTheoryByTitle[subtopic.title] ?? compactTheory(subtopic.title)
  const practical = pianoPracticalByTitle[subtopic.title] ?? compactPractical(subtopic.title)

  return [
    ...theory.map((item, index): ContentItem => ({
      id: `${subtopic.id}-theory-${index + 1}`,
      dashboard_id: 'piano-12-keys',
      subtopic_id: subtopic.id,
      title: `${subtopic.title}: theory ${index + 1}`,
      body: theoryBody(item),
      answer: item.correct,
      explanation: `Why correct: ${item.whyCorrect} Why others are wrong: ${item.whyWrong} ${item.humor}`,
      category: 'theory',
      type: 'qna',
      is_locked: false,
    })),
    ...practical.map((item, index): ContentItem => ({
      id: `${subtopic.id}-practical-${index + 1}`,
      dashboard_id: 'piano-12-keys',
      subtopic_id: subtopic.id,
      title: `${subtopic.title}: practical ${index + 1}`,
      body: practicalBody(item),
      answer: item.expected,
      explanation: item.visual,
      category: 'practical',
      type: 'qna',
      is_locked: false,
    })),
  ]
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
