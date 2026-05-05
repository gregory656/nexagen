export type SongProgression = {
  title: string
  artist: string
  genre: string
  key: string
  scale: string
  progression: string[]
  confidence: number
  notes: string[]
  chords: string[][]
}

export const songProgressions: SongProgression[] = [
  {
    title: 'Amazing Grace',
    artist: 'Traditional',
    genre: 'Gospel',
    key: 'G Major',
    scale: 'G A B C D E F#',
    progression: ['I', 'IV', 'I', 'V', 'I'],
    confidence: 96,
    notes: ['G4', 'B4', 'D4', 'G4', 'C4', 'E4', 'G4', 'D4'],
    chords: [['G4', 'B4', 'D4'], ['C4', 'E4', 'G4'], ['G4', 'B4', 'D4'], ['D4', 'F#4', 'A4'], ['G4', 'B4', 'D4']],
  },
  {
    title: 'Way Maker',
    artist: 'Sinach',
    genre: 'Gospel',
    key: 'E Major',
    scale: 'E F# G# A B C# D#',
    progression: ['I', 'V', 'vi', 'IV'],
    confidence: 88,
    notes: ['E4', 'B4', 'C#4', 'A4', 'G#4', 'F#4', 'E4'],
    chords: [['E4', 'G#4', 'B4'], ['B4', 'D#4', 'F#4'], ['C#4', 'E4', 'G#4'], ['A4', 'C#4', 'E4']],
  },
  {
    title: 'Someone Like You',
    artist: 'Adele',
    genre: 'Pop',
    key: 'A Major',
    scale: 'A B C# D E F# G#',
    progression: ['I', 'V', 'vi', 'IV'],
    confidence: 91,
    notes: ['A4', 'E4', 'F#4', 'D4', 'C#4', 'B4', 'A4'],
    chords: [['A4', 'C#4', 'E4'], ['E4', 'G#4', 'B4'], ['F#4', 'A4', 'C#4'], ['D4', 'F#4', 'A4']],
  },
  {
    title: 'No Woman No Cry',
    artist: 'Bob Marley',
    genre: 'Pop',
    key: 'C Major',
    scale: 'C D E F G A B',
    progression: ['I', 'V', 'vi', 'IV'],
    confidence: 90,
    notes: ['C4', 'G4', 'A4', 'F4', 'E4', 'D4', 'C4'],
    chords: [['C4', 'E4', 'G4'], ['G4', 'B4', 'D4'], ['A4', 'C4', 'E4'], ['F4', 'A4', 'C4']],
  },
  {
    title: 'Stand By Me',
    artist: 'Ben E. King',
    genre: 'RnB',
    key: 'A Major',
    scale: 'A B C# D E F# G#',
    progression: ['I', 'vi', 'IV', 'V'],
    confidence: 94,
    notes: ['A4', 'F#4', 'D4', 'E4', 'C#4', 'B4', 'A4'],
    chords: [['A4', 'C#4', 'E4'], ['F#4', 'A4', 'C#4'], ['D4', 'F#4', 'A4'], ['E4', 'G#4', 'B4']],
  },
  {
    title: 'Fly Me to the Moon',
    artist: 'Frank Sinatra',
    genre: 'Jazz',
    key: 'C Major',
    scale: 'C D E F G A B',
    progression: ['vi', 'ii', 'V', 'I', 'IV', 'vii', 'III', 'vi'],
    confidence: 86,
    notes: ['A4', 'D4', 'G4', 'C4', 'F4', 'B4', 'E4', 'A4'],
    chords: [['A4', 'C4', 'E4'], ['D4', 'F4', 'A4'], ['G4', 'B4', 'D4'], ['C4', 'E4', 'G4']],
  },
  {
    title: 'Malaika',
    artist: 'Fadhili William',
    genre: 'Bongo',
    key: 'C Major',
    scale: 'C D E F G A B',
    progression: ['I', 'IV', 'V', 'I'],
    confidence: 82,
    notes: ['C4', 'E4', 'G4', 'F4', 'E4', 'D4', 'C4'],
    chords: [['C4', 'E4', 'G4'], ['F4', 'A4', 'C4'], ['G4', 'B4', 'D4'], ['C4', 'E4', 'G4']],
  },
  {
    title: 'Essence',
    artist: 'Wizkid',
    genre: 'Afrobeat',
    key: 'A Minor',
    scale: 'A B C D E F G',
    progression: ['i', 'VII', 'VI', 'VII'],
    confidence: 78,
    notes: ['A4', 'G4', 'F4', 'G4', 'E4', 'C4', 'A4'],
    chords: [['A4', 'C4', 'E4'], ['G4', 'B4', 'D4'], ['F4', 'A4', 'C4'], ['G4', 'B4', 'D4']],
  },
]

export function findCuratedSong(title: string, artist: string, genre: string) {
  const cleanTitle = title.trim().toLowerCase()
  const cleanArtist = artist.trim().toLowerCase()
  const cleanGenre = genre.trim().toLowerCase()

  return songProgressions.find((song) => {
    const titleMatch = song.title.toLowerCase().includes(cleanTitle) || cleanTitle.includes(song.title.toLowerCase())
    const artistMatch = !cleanArtist || song.artist.toLowerCase().includes(cleanArtist) || cleanArtist.includes(song.artist.toLowerCase())
    const genreMatch = cleanGenre === 'others' || song.genre.toLowerCase() === cleanGenre
    return titleMatch && artistMatch && genreMatch
  })
}
