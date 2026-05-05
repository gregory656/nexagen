import type { SkillLevel } from '../types/nexagen'

export type ProgrammingLanguage = {
  id: string
  name: string
  monaco: string
  logo: string
  description: string
  frameworks: string[]
  useCases: string[]
}

export type ProgrammingSubtopic = {
  id: string
  title: string
  level: SkillLevel
}

export type ProgrammingQuestion = {
  id: string
  subtopicId: string
  level: SkillLevel
  question: string
  starter: Record<string, string>
  answer: Record<string, string>
  explanation: string
  hint: string
}

export const programmingLanguages: ProgrammingLanguage[] = [
  ['python', 'Python', 'python', 'Py', 'Readable, fast to learn, excellent for interviews and automation.', ['Django', 'FastAPI', 'Flask'], ['AI', 'APIs', 'automation']],
  ['javascript', 'JavaScript', 'javascript', 'JS', 'The language of the web, used across frontend and backend.', ['React', 'Vue', 'Node.js'], ['web apps', 'servers', 'tooling']],
  ['typescript', 'TypeScript', 'typescript', 'TS', 'JavaScript with types for safer large applications.', ['Angular', 'Next.js', 'NestJS'], ['SaaS', 'teams', 'frontend']],
  ['java', 'Java', 'java', 'Ja', 'Enterprise language with strong OOP and interview relevance.', ['Spring', 'Android', 'Quarkus'], ['backend', 'mobile', 'systems']],
  ['c', 'C', 'c', 'C', 'Low-level language for memory, operating systems, and fundamentals.', ['POSIX', 'GTK', 'Raylib'], ['embedded', 'systems', 'drivers']],
  ['cpp', 'C++', 'cpp', 'C++', 'Performance-heavy language for algorithms, games, and engines.', ['Qt', 'Unreal', 'Boost'], ['games', 'finance', 'competitive coding']],
  ['csharp', 'C#', 'csharp', 'C#', 'Modern language for .NET apps, games, and backend systems.', ['.NET', 'Unity', 'Blazor'], ['enterprise', 'games', 'APIs']],
  ['go', 'Go', 'go', 'Go', 'Simple compiled language for cloud services and concurrency.', ['Gin', 'Fiber', 'gRPC'], ['cloud', 'CLIs', 'microservices']],
  ['rust', 'Rust', 'rust', 'Rs', 'Memory-safe systems language with serious performance.', ['Axum', 'Tauri', 'Bevy'], ['systems', 'security', 'tools']],
  ['dart', 'Dart', 'dart', 'Da', 'Productive language for Flutter apps.', ['Flutter', 'Shelf', 'Aqueduct'], ['mobile', 'desktop', 'web']],
  ['kotlin', 'Kotlin', 'kotlin', 'Kt', 'Concise JVM language popular for Android.', ['Android', 'Ktor', 'Spring'], ['mobile', 'backend', 'JVM']],
  ['swift', 'Swift', 'swift', 'Sw', 'Apple ecosystem language with clean syntax.', ['SwiftUI', 'Vapor', 'UIKit'], ['iOS', 'macOS', 'apps']],
  ['php', 'PHP', 'php', 'PHP', 'Server language powering many web platforms.', ['Laravel', 'Symfony', 'WordPress'], ['web', 'CMS', 'APIs']],
  ['ruby', 'Ruby', 'ruby', 'Rb', 'Expressive language loved for developer happiness.', ['Rails', 'Sinatra', 'Hanami'], ['web apps', 'scripts', 'prototypes']],
  ['sql', 'SQL', 'sql', 'SQL', 'Database query language every developer should know.', ['Postgres', 'MySQL', 'SQLite'], ['data', 'analytics', 'backends']],
  ['bash', 'Bash', 'shell', 'Sh', 'Shell scripting for Linux automation.', ['GNU tools', 'awk', 'sed'], ['DevOps', 'automation', 'servers']],
  ['powershell', 'PowerShell', 'powershell', 'PS', 'Object-oriented shell for Windows and cloud automation.', ['Azure', 'Pester', 'PowerCLI'], ['admin', 'cloud', 'automation']],
  ['r', 'R', 'r', 'R', 'Statistical language for analysis and visualization.', ['Shiny', 'tidyverse', 'ggplot2'], ['statistics', 'research', 'data']],
  ['matlab', 'MATLAB', 'matlab', 'ML', 'Numerical computing language for engineering.', ['Simulink', 'Toolboxes', 'App Designer'], ['engineering', 'signals', 'math']],
  ['scala', 'Scala', 'scala', 'Sc', 'JVM language blending functional and OOP styles.', ['Akka', 'Play', 'Spark'], ['data', 'distributed systems', 'backend']],
].map(([id, name, monaco, logo, description, frameworks, useCases]) => ({
  id,
  name,
  monaco,
  logo,
  description,
  frameworks,
  useCases,
})) as ProgrammingLanguage[]

export const programmingSubtopics: ProgrammingSubtopic[] = [
  ['variables', 'Variables & Data Types', 'beginner'],
  ['control-flow', 'Control Flow', 'beginner'],
  ['functions', 'Functions', 'beginner'],
  ['arrays', 'Arrays / Lists', 'beginner'],
  ['objects', 'Objects / Structs', 'beginner'],
  ['oop', 'OOP', 'intermediate'],
  ['errors', 'Error Handling', 'intermediate'],
  ['files', 'File Handling', 'intermediate'],
  ['apis', 'APIs', 'intermediate'],
  ['modules', 'Modules / Packages', 'intermediate'],
  ['async', 'Async Programming', 'pro'],
  ['data-structures', 'Data Structures', 'pro'],
  ['algorithms', 'Algorithms', 'pro'],
  ['performance', 'Performance Optimization', 'pro'],
  ['system-design', 'System Design Basics', 'pro'],
].map(([id, title, level]) => ({ id, title, level: level as SkillLevel }))

const defaultStarter = {
  python: 'def solve(nums):\n    # your code here\n    return None\n\nprint(solve([2, 7, 11, 15]))',
  javascript: 'function solve(nums) {\n  // your code here\n  return null\n}\n\nconsole.log(solve([2, 7, 11, 15]))',
  typescript: 'function solve(nums: number[]): number | null {\n  // your code here\n  return null\n}\n\nconsole.log(solve([2, 7, 11, 15]))',
}

const defaultAnswer = {
  python: 'def solve(nums):\n    target = 9\n    seen = set()\n    for n in nums:\n        if target - n in seen:\n            return [target - n, n]\n        seen.add(n)\n\nprint(solve([2, 7, 11, 15]))',
  javascript: 'function solve(nums) {\n  const target = 9\n  const seen = new Set()\n  for (const n of nums) {\n    if (seen.has(target - n)) return [target - n, n]\n    seen.add(n)\n  }\n}\n\nconsole.log(solve([2, 7, 11, 15]))',
  typescript: 'function solve(nums: number[]): number[] | undefined {\n  const target = 9\n  const seen = new Set<number>()\n  for (const n of nums) {\n    if (seen.has(target - n)) return [target - n, n]\n    seen.add(n)\n  }\n}\n\nconsole.log(solve([2, 7, 11, 15]))',
}

export const programmingQuestions: ProgrammingQuestion[] = [
  {
    id: 'beginner-sum-pair',
    subtopicId: 'arrays',
    level: 'beginner',
    question: 'Given an array of numbers, return two values that add up to 9. Start with [2, 7, 11, 15].',
    starter: defaultStarter,
    answer: defaultAnswer,
    explanation: 'Use a set to remember numbers already seen. For each number, ask whether the complement exists. This trains arrays, loops, and lookup thinking.',
    hint: 'For each number n, the value you need is 9 - n.',
  },
  {
    id: 'intermediate-valid-parentheses',
    subtopicId: 'data-structures',
    level: 'intermediate',
    question: 'Validate whether a string of brackets is balanced. Example: "{[()]}" is valid, "{[(])}" is not.',
    starter: { python: 'def is_valid(s):\n    stack = []\n    return False', javascript: 'function isValid(s) {\n  const stack = []\n  return false\n}', typescript: 'function isValid(s: string): boolean {\n  const stack: string[] = []\n  return false\n}' },
    answer: { python: 'def is_valid(s):\n    pairs = {\")\":\"(\", \"]\":\"[\", \"}\":\"{\"}\n    stack = []\n    for ch in s:\n        if ch in pairs.values():\n            stack.append(ch)\n        elif not stack or stack.pop() != pairs[ch]:\n            return False\n    return not stack', javascript: 'function isValid(s) {\n  const pairs = { \')\': \'(\', \']\': \'[\', \'}\': \'{\' }\n  const stack = []\n  for (const ch of s) {\n    if (Object.values(pairs).includes(ch)) stack.push(ch)\n    else if (!stack.length || stack.pop() !== pairs[ch]) return false\n  }\n  return stack.length === 0\n}', typescript: 'function isValid(s: string): boolean {\n  const pairs: Record<string, string> = { \')\': \'(\', \']\': \'[\', \'}\': \'{\' }\n  const stack: string[] = []\n  for (const ch of s) {\n    if (Object.values(pairs).includes(ch)) stack.push(ch)\n    else if (!stack.length || stack.pop() !== pairs[ch]) return false\n  }\n  return stack.length === 0\n}' },
    explanation: 'A stack matches the most recent opening bracket first. This is a classic interview pattern for nested structures.',
    hint: 'When you see a closing bracket, compare it with the most recent opening bracket.',
  },
  {
    id: 'pro-lru-cache',
    subtopicId: 'system-design',
    level: 'pro',
    question: 'Design an LRU cache API with get(key) and put(key, value). Explain the target time complexity.',
    starter: { python: 'class LRUCache:\n    def __init__(self, capacity):\n        pass', javascript: 'class LRUCache {\n  constructor(capacity) {}\n}', typescript: 'class LRUCache {\n  constructor(private capacity: number) {}\n}' },
    answer: { python: 'from collections import OrderedDict\n\nclass LRUCache:\n    def __init__(self, capacity):\n        self.capacity = capacity\n        self.cache = OrderedDict()\n    def get(self, key):\n        if key not in self.cache: return -1\n        self.cache.move_to_end(key)\n        return self.cache[key]\n    def put(self, key, value):\n        self.cache[key] = value\n        self.cache.move_to_end(key)\n        if len(self.cache) > self.capacity:\n            self.cache.popitem(last=False)', javascript: 'class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity\n    this.cache = new Map()\n  }\n  get(key) {\n    if (!this.cache.has(key)) return -1\n    const value = this.cache.get(key)\n    this.cache.delete(key)\n    this.cache.set(key, value)\n    return value\n  }\n  put(key, value) {\n    if (this.cache.has(key)) this.cache.delete(key)\n    this.cache.set(key, value)\n    if (this.cache.size > this.capacity) this.cache.delete(this.cache.keys().next().value)\n  }\n}', typescript: 'class LRUCache<K, V> {\n  private cache = new Map<K, V>()\n  constructor(private capacity: number) {}\n  get(key: K): V | -1 {\n    if (!this.cache.has(key)) return -1\n    const value = this.cache.get(key) as V\n    this.cache.delete(key)\n    this.cache.set(key, value)\n    return value\n  }\n  put(key: K, value: V) {\n    if (this.cache.has(key)) this.cache.delete(key)\n    this.cache.set(key, value)\n    if (this.cache.size > this.capacity) this.cache.delete(this.cache.keys().next().value as K)\n  }\n}' },
    explanation: 'An LRU cache needs fast lookup and fast recency updates. A hash map plus ordered list gives O(1) get and put.',
    hint: 'You need one structure for lookup and one structure for recency order.',
  },
]

export const timerByLevel: Record<SkillLevel, number> = {
  beginner: 45,
  intermediate: 90,
  pro: 180,
}

export function codeForLanguage(languageId: string, codeMap: Record<string, string>) {
  return codeMap[languageId] ?? codeMap.javascript ?? Object.values(codeMap)[0] ?? ''
}
