import type { SkillLevel } from '../types/nexagen'

export type ProgrammingLanguage = {
  id: string
  name: string
  monaco: string
  logo: string
  description: string
  frameworks: string[]
  useCases: string[]
  strengths: string[]
  learnFirst: string[]
  pitfalls: string[]
  project: string
  interviewFocus: string
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

const languageInfo: Record<string, Pick<ProgrammingLanguage, 'strengths' | 'learnFirst' | 'pitfalls' | 'project' | 'interviewFocus'>> = {
  python: {
    strengths: ['Readable syntax', 'Fast automation', 'Strong libraries for APIs, data, AI, and scripting'],
    learnFirst: ['Variables and collections', 'Functions and modules', 'File/API handling', 'Testing small scripts'],
    pitfalls: ['Hiding complexity behind libraries', 'Weak type discipline in larger apps', 'Mutable default arguments'],
    project: 'Build a CLI expense tracker that imports CSV files, summarizes spending, and exports a report.',
    interviewFocus: 'Lists, dictionaries, string parsing, recursion, sliding windows, hash maps, and clean explanation.',
  },
  javascript: {
    strengths: ['Runs in browsers and servers', 'Event-driven UI work', 'Huge package ecosystem'],
    learnFirst: ['Values and objects', 'Functions and closures', 'DOM/events', 'Promises and fetch'],
    pitfalls: ['Confusing equality rules', 'Async code without error handling', 'Mutating shared objects carelessly'],
    project: 'Build a task board with filtering, local storage, keyboard shortcuts, and async sync simulation.',
    interviewFocus: 'Arrays, objects, closures, async promises, event loop, and frontend data transformation.',
  },
  typescript: {
    strengths: ['Safer JavaScript at scale', 'Excellent editor feedback', 'Better API contracts'],
    learnFirst: ['Primitive and object types', 'Interfaces and unions', 'Generics', 'Typed async APIs'],
    pitfalls: ['Using any as a shortcut', 'Over-engineering types too early', 'Ignoring runtime validation'],
    project: 'Build a typed mini CRM with contacts, typed filters, API response models, and form validation.',
    interviewFocus: 'Type narrowing, generics, discriminated unions, typed React patterns, and API modeling.',
  },
  java: {
    strengths: ['Strong OOP model', 'Mature backend ecosystem', 'Great collections and concurrency tooling'],
    learnFirst: ['Classes and methods', 'Collections', 'Exceptions', 'Interfaces and dependency boundaries'],
    pitfalls: ['Verbose code without design clarity', 'Overusing inheritance', 'Forgetting equals/hashCode rules'],
    project: 'Build a Spring-style service layer for orders with validation, repositories, and unit tests.',
    interviewFocus: 'OOP design, collections, strings, hash maps, concurrency basics, and JVM tradeoffs.',
  },
  c: {
    strengths: ['Memory-level understanding', 'Tiny runtime footprint', 'Systems programming foundations'],
    learnFirst: ['Pointers and arrays', 'Structs', 'Manual memory', 'File and process APIs'],
    pitfalls: ['Buffer overflows', 'Dangling pointers', 'Unchecked allocation and error codes'],
    project: 'Build a small log parser that reads a file, tokenizes lines, counts status codes, and handles errors.',
    interviewFocus: 'Pointers, memory layout, strings, arrays, structs, complexity, and defensive coding.',
  },
  cpp: {
    strengths: ['High performance', 'Rich standard library', 'Precise control with modern abstractions'],
    learnFirst: ['Vectors and strings', 'RAII', 'Classes', 'STL algorithms and containers'],
    pitfalls: ['Mixing old C-style memory with modern C++', 'Iterator invalidation', 'Unnecessary inheritance'],
    project: 'Build an in-memory search index using vectors, unordered maps, sorting, and ranking.',
    interviewFocus: 'STL, object lifetime, heaps, maps, graph algorithms, and complexity analysis.',
  },
  csharp: {
    strengths: ['Clean enterprise syntax', 'Excellent .NET tooling', 'Strong async and LINQ support'],
    learnFirst: ['Classes and records', 'LINQ', 'Exceptions', 'Async/await and dependency injection'],
    pitfalls: ['Blocking async code', 'Null handling mistakes', 'Fat service classes'],
    project: 'Build a minimal inventory API with DTOs, validation, service methods, and async repository calls.',
    interviewFocus: 'LINQ, OOP design, async tasks, collections, dependency injection, and API structure.',
  },
  go: {
    strengths: ['Simple syntax', 'Fast services', 'Strong concurrency primitives'],
    learnFirst: ['Slices and maps', 'Structs and interfaces', 'Errors as values', 'Goroutines and channels'],
    pitfalls: ['Ignoring returned errors', 'Overusing channels', 'Shared state races'],
    project: 'Build a concurrent URL checker with worker pools, timeouts, structured results, and retries.',
    interviewFocus: 'Slices, maps, interfaces, goroutines, channels, worker pools, and service design.',
  },
  rust: {
    strengths: ['Memory safety without garbage collection', 'Great performance', 'Excellent error modeling'],
    learnFirst: ['Ownership and borrowing', 'Enums and pattern matching', 'Result/Option', 'Collections'],
    pitfalls: ['Fighting the borrow checker instead of redesigning ownership', 'Cloning everything', 'Overcomplicated lifetimes'],
    project: 'Build a fast file indexer that walks directories, parses metadata, and reports duplicates.',
    interviewFocus: 'Ownership, lifetimes conceptually, enums, hash maps, iterators, and safe systems thinking.',
  },
  dart: {
    strengths: ['Flutter-first productivity', 'Sound null safety', 'Good async syntax'],
    learnFirst: ['Classes and collections', 'Null safety', 'Futures and streams', 'Widget data flow'],
    pitfalls: ['Mixing UI state with business logic', 'Ignoring nullability', 'Async rebuild surprises'],
    project: 'Build a Flutter habit tracker with local models, forms, validation, and filtered lists.',
    interviewFocus: 'Collections, classes, async futures, null safety, and app-state organization.',
  },
  kotlin: {
    strengths: ['Concise JVM code', 'Android-friendly', 'Null safety and coroutines'],
    learnFirst: ['Data classes', 'Collections', 'Null safety', 'Coroutines and sealed classes'],
    pitfalls: ['Platform null surprises', 'Coroutine scope leaks', 'Overusing extension functions'],
    project: 'Build an Android-style notes service with data classes, repositories, and coroutine-backed sync.',
    interviewFocus: 'Null safety, data classes, collection transforms, coroutines, and JVM interoperability.',
  },
  swift: {
    strengths: ['Apple-native performance', 'Strong type safety', 'Great UI integration with SwiftUI'],
    learnFirst: ['Structs and classes', 'Optionals', 'Protocols', 'Async/await and SwiftUI state'],
    pitfalls: ['Force-unwrapping optionals', 'Confusing value vs reference semantics', 'Bloated view bodies'],
    project: 'Build a SwiftUI budget screen with models, computed totals, form validation, and async loading.',
    interviewFocus: 'Optionals, protocols, value semantics, arrays/dictionaries, and app architecture basics.',
  },
  php: {
    strengths: ['Practical server-side web development', 'Great Laravel ecosystem', 'Easy deployment story'],
    learnFirst: ['Arrays and associative arrays', 'Functions and classes', 'Forms and validation', 'Database access'],
    pitfalls: ['Mixing HTML and business logic heavily', 'Unsafe input handling', 'Loose comparison bugs'],
    project: 'Build a small Laravel-style booking flow with validation, persistence, and email-ready status changes.',
    interviewFocus: 'Arrays, request handling, validation, SQL safety, OOP, and MVC structure.',
  },
  ruby: {
    strengths: ['Expressive syntax', 'Fast product prototyping', 'Rails conventions'],
    learnFirst: ['Objects and blocks', 'Arrays/hashes', 'Enumerable methods', 'Rails model-controller flow'],
    pitfalls: ['Magic without understanding', 'Slow queries hidden by ORM convenience', 'Monkey patching casually'],
    project: 'Build a Rails-style support ticket tracker with models, scopes, validations, and status workflows.',
    interviewFocus: 'Hashes, arrays, blocks, enumerables, OOP, and clear product modeling.',
  },
  sql: {
    strengths: ['Direct data retrieval', 'Set-based thinking', 'Essential backend and analytics skill'],
    learnFirst: ['SELECT/filter/sort', 'Joins', 'Grouping and aggregates', 'Indexes and query plans'],
    pitfalls: ['Row-by-row thinking', 'Wrong joins causing duplicate rows', 'Ignoring indexes and null behavior'],
    project: 'Build reporting queries for orders: revenue by month, inactive customers, top products, and retention.',
    interviewFocus: 'Joins, grouping, window functions, indexes, transactions, and query optimization.',
  },
  bash: {
    strengths: ['Fast automation on Unix systems', 'Great glue language', 'Powerful text pipelines'],
    learnFirst: ['Variables and quoting', 'Exit codes', 'Pipes and redirects', 'find/grep/sed/awk basics'],
    pitfalls: ['Unsafe unquoted variables', 'Ignoring set -euo pipefail tradeoffs', 'Parsing complex data with fragile text hacks'],
    project: 'Build a deployment health-check script that validates env vars, calls endpoints, and writes logs.',
    interviewFocus: 'Pipelines, process exit codes, file operations, text processing, and safe scripting habits.',
  },
  powershell: {
    strengths: ['Object-based shell', 'Windows and Azure automation', 'Readable admin scripts'],
    learnFirst: ['Cmdlets and objects', 'Pipeline filtering', 'Functions and parameters', 'Error handling'],
    pitfalls: ['Treating objects like plain text', 'Ignoring execution policy and scopes', 'Weak parameter validation'],
    project: 'Build a workstation audit script that checks processes, disk space, services, and exports CSV.',
    interviewFocus: 'Pipeline objects, filtering, remoting basics, file/process automation, and robust parameters.',
  },
  r: {
    strengths: ['Statistics-first workflow', 'Great data frames', 'Strong visualization ecosystem'],
    learnFirst: ['Vectors and data frames', 'dplyr-style transforms', 'Functions', 'Plots and summaries'],
    pitfalls: ['Factor/string confusion', 'Silent recycling behavior', 'Messy scripts with no reproducible pipeline'],
    project: 'Build a customer churn analysis notebook with cleaning, summaries, visualizations, and model-ready data.',
    interviewFocus: 'Data frames, grouping, joins, vectorization, statistics basics, and reproducible analysis.',
  },
  matlab: {
    strengths: ['Matrix-native computation', 'Engineering workflows', 'Signal and numerical analysis'],
    learnFirst: ['Matrices and indexing', 'Functions', 'Plots', 'Vectorized operations'],
    pitfalls: ['Looping where vectorization is clearer', 'Off-by-one indexing mistakes', 'Unclear scripts with hidden workspace state'],
    project: 'Build a signal analysis script that loads samples, filters noise, plots frequency, and reports metrics.',
    interviewFocus: 'Matrix operations, indexing, numerical methods, plotting, and algorithm translation.',
  },
  scala: {
    strengths: ['Functional plus OOP on the JVM', 'Strong data engineering fit', 'Expressive type system'],
    learnFirst: ['Case classes', 'Collections', 'Pattern matching', 'Futures and functional transforms'],
    pitfalls: ['Overusing advanced type tricks', 'Unreadable functional chains', 'Ignoring JVM realities'],
    project: 'Build a Spark-style event summarizer with case classes, grouping, transformations, and typed outputs.',
    interviewFocus: 'Collections, pattern matching, immutability, futures, JVM basics, and data pipelines.',
  },
}

export const programmingLanguages: ProgrammingLanguage[] = [
  ['python', 'Python', 'python', 'Py', 'Readable, fast to learn, excellent for interviews and automation.', ['Django', 'FastAPI', 'Flask'], ['AI', 'APIs', 'automation']],
  ['javascript', 'JavaScript', 'javascript', 'JS', 'The language of the web, used across frontend and backend.', ['React', 'Vue', 'Node.js'], ['web apps', 'servers', 'tooling']],
  ['typescript', 'TypeScript', 'typescript', 'TS', 'JavaScript with types for safer large applications.', ['Angular', 'Next.js', 'NestJS'], ['SaaS', 'teams', 'frontend']],
  ['java', 'Java', 'java', 'Ja', 'Enterprise language with strong OOP, collections, and interview relevance.', ['Spring', 'Android', 'Quarkus'], ['backend', 'mobile', 'enterprise']],
  ['c', 'C', 'c', 'C', 'Low-level language for memory, operating systems, and fundamentals.', ['POSIX', 'GTK', 'Raylib'], ['embedded', 'systems', 'drivers']],
  ['cpp', 'C++', 'cpp', 'C++', 'Performance-heavy language for algorithms, games, and engines.', ['Qt', 'Unreal', 'Boost'], ['games', 'finance', 'competitive coding']],
  ['csharp', 'C#', 'csharp', 'C#', 'Modern .NET language for backend services, desktop apps, and Unity.', ['.NET', 'Unity', 'Blazor'], ['enterprise', 'games', 'APIs']],
  ['go', 'Go', 'go', 'Go', 'Small, fast compiled language for cloud services and concurrency.', ['Gin', 'Fiber', 'gRPC'], ['cloud', 'CLIs', 'microservices']],
  ['rust', 'Rust', 'rust', 'Rs', 'Memory-safe systems language with serious performance.', ['Axum', 'Tauri', 'Bevy'], ['systems', 'security', 'tools']],
  ['dart', 'Dart', 'dart', 'Da', 'Productive language for Flutter apps and typed client experiences.', ['Flutter', 'Shelf', 'Riverpod'], ['mobile', 'desktop', 'web']],
  ['kotlin', 'Kotlin', 'kotlin', 'Kt', 'Concise JVM language popular for Android and backend services.', ['Android', 'Ktor', 'Spring'], ['mobile', 'backend', 'JVM']],
  ['swift', 'Swift', 'swift', 'Sw', 'Apple ecosystem language with clean syntax and strong safety.', ['SwiftUI', 'Vapor', 'UIKit'], ['iOS', 'macOS', 'apps']],
  ['php', 'PHP', 'php', 'PHP', 'Server language powering many web platforms and APIs.', ['Laravel', 'Symfony', 'WordPress'], ['web', 'CMS', 'APIs']],
  ['ruby', 'Ruby', 'ruby', 'Rb', 'Expressive language loved for clean product development.', ['Rails', 'Sinatra', 'Hanami'], ['web apps', 'scripts', 'prototypes']],
  ['sql', 'SQL', 'sql', 'SQL', 'Database query language every developer should handle confidently.', ['Postgres', 'MySQL', 'SQLite'], ['data', 'analytics', 'backends']],
  ['bash', 'Bash', 'shell', 'Sh', 'Shell scripting for Linux automation and developer workflow.', ['GNU tools', 'awk', 'sed'], ['DevOps', 'automation', 'servers']],
  ['powershell', 'PowerShell', 'powershell', 'PS', 'Object-oriented shell for Windows, Azure, and automation.', ['Azure', 'Pester', 'PowerCLI'], ['admin', 'cloud', 'automation']],
  ['r', 'R', 'r', 'R', 'Statistical language for analysis, modeling, and visualization.', ['Shiny', 'tidyverse', 'ggplot2'], ['statistics', 'research', 'data']],
  ['matlab', 'MATLAB', 'matlab', 'ML', 'Numerical computing language for engineering and matrix-heavy work.', ['Simulink', 'Toolboxes', 'App Designer'], ['engineering', 'signals', 'math']],
  ['scala', 'Scala', 'scala', 'Sc', 'JVM language blending functional and object-oriented styles.', ['Akka', 'Play', 'Spark'], ['data', 'distributed systems', 'backend']],
].map(([id, name, monaco, logo, description, frameworks, useCases]) => ({
  id,
  name,
  monaco,
  logo,
  description,
  frameworks,
  useCases,
  ...languageInfo[id as string],
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

const question = (
  id: string,
  subtopicId: string,
  level: SkillLevel,
  prompt: string,
  starter: Record<string, string>,
  answer: Record<string, string>,
  explanation: string,
  hint: string,
): ProgrammingQuestion => ({ id, subtopicId, level, question: prompt, starter, answer, explanation, hint })

const expandedLanguageIds = [
  'java',
  'c',
  'cpp',
  'csharp',
  'go',
  'rust',
  'dart',
  'kotlin',
  'swift',
  'php',
  'ruby',
  'sql',
  'bash',
  'powershell',
  'r',
  'matlab',
  'scala',
]

const challengeBriefs: Record<string, string> = {
  variables: 'calculate an invoice total from price, quantity, and tax rate',
  'control-flow': 'allow access only when a user is verified and has attempts left',
  functions: 'create a reusable slugify function',
  arrays: 'return the top three scores in descending order',
  objects: 'calculate a cart total from item records',
  oop: 'model a bank account that prevents overdrafts',
  errors: 'parse external input safely and return a fallback on failure',
  files: 'read text and count words using whitespace rules',
  apis: 'fetch or select active user emails and normalize them to lowercase',
  modules: 'export a reusable currency conversion helper',
  async: 'run multiple external requests with bounded concurrency',
  'data-structures': 'implement an LRU cache with fast lookup and recency updates',
  algorithms: 'merge overlapping intervals after sorting by start time',
  performance: 'index users by id to avoid repeated linear scans',
  'system-design': 'make payment processing idempotent by request id',
}

const referencePlans: Record<string, string[]> = {
  objects: ['Represent each item with price and quantity fields.', 'Multiply price by quantity per item.', 'Accumulate the line totals and return the cart total.'],
  oop: ['Keep balance as private/internal state.', 'Deposit adds to balance and returns the new value.', 'Withdraw checks balance first and refuses overdrafts.'],
  errors: ['Wrap only the risky parse/read operation.', 'Return parsed data on success.', 'Return null or an explicit fallback on expected failure.'],
  files: ['Open/read the file as text.', 'Trim empty content safely.', 'Split on whitespace and count tokens.'],
  apis: ['Request or select user records.', 'Keep only active users.', 'Normalize email text with lowercase before returning.'],
  modules: ['Expose one small conversion helper.', 'Multiply amount by rate.', 'Round at the boundary where values leave the helper.'],
  async: ['Limit concurrent work to a small worker pool.', 'Store each result at its original index.', 'Return after all workers finish.'],
  'data-structures': ['Combine fast lookup with recency order.', 'Move a key to most-recent on every get/put.', 'Evict the least-recent key when capacity is exceeded.'],
  algorithms: ['Sort intervals by start.', 'Compare each interval with the last merged interval.', 'Extend overlap or append a new interval.'],
  performance: ['Build a dictionary/map once from id to user.', 'Replace repeated scans with direct lookup.', 'State the tradeoff: extra memory for faster reads.'],
  'system-design': ['Check request id before side effects.', 'Run the charge only for new request ids.', 'Persist the processed id in durable storage in production.'],
}

const nativeStarter = (languageId: string, subtopicId: string) => nativeCode(languageId, subtopicId, false)
const nativeAnswer = (languageId: string, subtopicId: string) => nativeCode(languageId, subtopicId, true)

function withExpandedLanguages(item: ProgrammingQuestion): ProgrammingQuestion {
  const starter = { ...item.starter }
  const answer = { ...item.answer }
  expandedLanguageIds.forEach((languageId) => {
    starter[languageId] = nativeStarter(languageId, item.subtopicId)
    answer[languageId] = nativeAnswer(languageId, item.subtopicId)
  })
  return { ...item, starter, answer }
}

function nativeCode(languageId: string, subtopicId: string, solved: boolean) {
  const brief = challengeBriefs[subtopicId] ?? 'solve the selected programming challenge clearly'
  const plan = referencePlans[subtopicId] ?? ['Define the input clearly.', 'Transform state predictably.', 'Return one verified output.']
  const todo = solved ? 'Reference solution' : `TODO: ${brief}.`
  const body = solved ? nativeAnswerBody(languageId, subtopicId) : nativeStarterBody(languageId, subtopicId)

  const planText = plan.map((step, index) => `${index + 1}. ${step}`).join('\n')
  if (languageId === 'sql') return `-- ${todo}\n-- Plan:\n-- ${planText.replaceAll('\n', '\n-- ')}\n${body}`
  if (languageId === 'bash') return `#!/usr/bin/env bash\n# ${todo}\n# Plan:\n# ${planText.replaceAll('\n', '\n# ')}\n${body}`
  if (languageId === 'powershell') return `# ${todo}\n# Plan:\n# ${planText.replaceAll('\n', '\n# ')}\n${body}`
  if (languageId === 'php') return `<?php\n// ${todo}\n// Plan:\n// ${planText.replaceAll('\n', '\n// ')}\n${body}`
  if (languageId === 'r') return `# ${todo}\n# Plan:\n# ${planText.replaceAll('\n', '\n# ')}\n${body}`
  if (languageId === 'matlab') return `% ${todo}\n% Plan:\n% ${planText.replaceAll('\n', '\n% ')}\n${body}`
  return `// ${todo}\n// Plan:\n// ${planText.replaceAll('\n', '\n// ')}\n${body}`
}

function nativeStarterBody(languageId: string, subtopicId: string) {
  const fallback = {
    java: 'class Main {\n  public static void main(String[] args) {\n    // write the solution here\n  }\n}',
    c: '#include <stdio.h>\n\nint main(void) {\n  /* write the solution here */\n  return 0;\n}',
    cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n  // write the solution here\n}',
    csharp: 'using System;\n\nclass Program {\n  static void Main() {\n    // write the solution here\n  }\n}',
    go: 'package main\n\nimport "fmt"\n\nfunc main() {\n  // write the solution here\n  fmt.Println("ready")\n}',
    rust: 'fn main() {\n    // write the solution here\n}',
    dart: 'void main() {\n  // write the solution here\n}',
    kotlin: 'fun main() {\n  // write the solution here\n}',
    swift: 'import Foundation\n\n// write the solution here',
    php: 'function solve() {\n    // write the solution here\n}\n',
    ruby: '# write the solution here',
    sql: 'SELECT -- write the query here;',
    bash: 'set -euo pipefail\n# write the script here',
    powershell: 'function Invoke-Solution {\n  # write the solution here\n}',
    r: '# write the solution here',
    matlab: '% write the solution here',
    scala: 'object Main extends App {\n  // write the solution here\n}',
  } as Record<string, string>

  if (subtopicId === 'variables') {
    return {
      java: 'class Main {\n  static double invoiceTotal() {\n    double price = 250;\n    int quantity = 3;\n    double taxRate = 0.16;\n    return 0;\n  }\n}',
      c: '#include <stdio.h>\n\nint main(void) {\n  double price = 250, taxRate = 0.16;\n  int quantity = 3;\n  double total = 0;\n  printf("%.2f\\n", total);\n}',
      cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n  double price = 250, taxRate = 0.16;\n  int quantity = 3;\n  cout << 0 << "\\n";\n}',
      csharp: 'using System;\n\nclass Program {\n  static double InvoiceTotal() {\n    double price = 250;\n    int quantity = 3;\n    double taxRate = 0.16;\n    return 0;\n  }\n}',
      go: 'package main\n\nimport "fmt"\n\nfunc main() {\n  price := 250.0\n  quantity := 3.0\n  taxRate := 0.16\n  fmt.Println(0)\n}',
      rust: 'fn main() {\n    let price = 250.0;\n    let quantity = 3.0;\n    let tax_rate = 0.16;\n    println!("{:.2}", 0.0);\n}',
      dart: 'void main() {\n  final price = 250.0;\n  final quantity = 3;\n  final taxRate = 0.16;\n  print(0);\n}',
      kotlin: 'fun main() {\n  val price = 250.0\n  val quantity = 3\n  val taxRate = 0.16\n  println(0)\n}',
      swift: 'let price = 250.0\nlet quantity = 3.0\nlet taxRate = 0.16\nprint(0)',
      php: '$price = 250;\n$quantity = 3;\n$taxRate = 0.16;\necho 0;',
      ruby: 'price = 250\nquantity = 3\ntax_rate = 0.16\nputs 0',
      sql: 'WITH invoice(price, quantity, tax_rate) AS (VALUES (250.0, 3, 0.16))\nSELECT 0 AS total FROM invoice;',
      bash: 'price=250\nquantity=3\ntax_rate=0.16\nprintf "0\\n"',
      powershell: '$price = 250\n$quantity = 3\n$taxRate = 0.16\n0',
      r: 'price <- 250\nquantity <- 3\ntax_rate <- 0.16\n0',
      matlab: 'price = 250;\nquantity = 3;\ntaxRate = 0.16;\ndisp(0)',
      scala: 'object Main extends App {\n  val price = 250.0\n  val quantity = 3\n  val taxRate = 0.16\n  println(0)\n}',
    }[languageId] ?? fallback[languageId]
  }

  if (subtopicId === 'control-flow') {
    return {
      java: 'static String accessStatus(boolean verified, int attemptsLeft) {\n  return "";\n}',
      c: 'const char* access_status(int verified, int attempts_left) {\n  return "";\n}',
      cpp: 'string accessStatus(bool verified, int attemptsLeft) {\n  return "";\n}',
      csharp: 'static string AccessStatus(bool verified, int attemptsLeft) => "";',
      go: 'func accessStatus(verified bool, attemptsLeft int) string {\n  return ""\n}',
      rust: 'fn access_status(verified: bool, attempts_left: i32) -> &' + "'static str {\n    \"\"\n}",
      dart: 'String accessStatus(bool verified, int attemptsLeft) => "";',
      kotlin: 'fun accessStatus(verified: Boolean, attemptsLeft: Int): String = ""',
      swift: 'func accessStatus(verified: Bool, attemptsLeft: Int) -> String {\n  return ""\n}',
      php: 'function accessStatus(bool $verified, int $attemptsLeft): string {\n    return "";\n}',
      ruby: 'def access_status(verified, attempts_left)\n  ""\nend',
      sql: 'SELECT CASE WHEN verified AND attempts_left > 0 THEN NULL ELSE NULL END AS status\nFROM login_attempts;',
      bash: 'verified=true\nattempts_left=2\n# print allow or block',
      powershell: 'function Get-AccessStatus($Verified, [int]$AttemptsLeft) {\n  ""\n}',
      r: 'access_status <- function(verified, attempts_left) ""',
      matlab: 'function status = accessStatus(verified, attemptsLeft)\nstatus = "";\nend',
      scala: 'def accessStatus(verified: Boolean, attemptsLeft: Int): String = ""',
    }[languageId] ?? fallback[languageId]
  }

  if (subtopicId === 'functions') {
    return {
      java: 'static String slugify(String title) {\n  return "";\n}',
      c: '/* Build a lowercase hyphenated slug from a title string. */',
      cpp: 'string slugify(string title) {\n  return "";\n}',
      csharp: 'static string Slugify(string title) => "";',
      go: 'func slugify(title string) string {\n  return ""\n}',
      rust: 'fn slugify(title: &str) -> String {\n    String::new()\n}',
      dart: 'String slugify(String title) => "";',
      kotlin: 'fun slugify(title: String): String = ""',
      swift: 'func slugify(_ title: String) -> String {\n  return ""\n}',
      php: 'function slugify(string $title): string {\n    return "";\n}',
      ruby: 'def slugify(title)\n  ""\nend',
      sql: "SELECT '' AS slug;",
      bash: 'slugify() {\n  local title="$1"\n  echo ""\n}',
      powershell: 'function ConvertTo-Slug([string]$Title) {\n  ""\n}',
      r: 'slugify <- function(title) ""',
      matlab: 'function slug = slugify(title)\nslug = "";\nend',
      scala: 'def slugify(title: String): String = ""',
    }[languageId] ?? fallback[languageId]
  }

  if (subtopicId === 'arrays') {
    return {
      java: 'int[] scores = {40, 91, 63, 91, 12, 77};\n// return the top three scores',
      c: 'int scores[] = {40, 91, 63, 91, 12, 77};\n/* sort descending and print three values */',
      cpp: 'vector<int> scores = {40, 91, 63, 91, 12, 77};\n// return top 3',
      csharp: 'var scores = new[] {40, 91, 63, 91, 12, 77};\n// return top 3',
      go: 'scores := []int{40, 91, 63, 91, 12, 77}\n_ = scores',
      rust: 'let mut scores = vec![40, 91, 63, 91, 12, 77];',
      dart: 'final scores = [40, 91, 63, 91, 12, 77];',
      kotlin: 'val scores = listOf(40, 91, 63, 91, 12, 77)',
      swift: 'let scores = [40, 91, 63, 91, 12, 77]',
      php: '$scores = [40, 91, 63, 91, 12, 77];',
      ruby: 'scores = [40, 91, 63, 91, 12, 77]',
      sql: 'WITH scores(score) AS (VALUES (40),(91),(63),(91),(12),(77))\nSELECT score FROM scores;',
      bash: 'scores=(40 91 63 91 12 77)',
      powershell: '$scores = 40, 91, 63, 91, 12, 77',
      r: 'scores <- c(40, 91, 63, 91, 12, 77)',
      matlab: 'scores = [40 91 63 91 12 77];',
      scala: 'val scores = List(40, 91, 63, 91, 12, 77)',
    }[languageId] ?? fallback[languageId]
  }

  return fallback[languageId]
}

function nativeAnswerBody(languageId: string, subtopicId: string) {
  const fallback = {
    java: `class Main {\n  static void explain() {\n    System.out.println("${challengeBriefs[subtopicId]}");\n  }\n}`,
    c: `#include <stdio.h>\nint main(void) { puts("${challengeBriefs[subtopicId]}"); return 0; }`,
    cpp: `#include <bits/stdc++.h>\nusing namespace std;\nint main() { cout << "${challengeBriefs[subtopicId]}\\n"; }`,
    csharp: `using System;\nclass Program { static void Main() => Console.WriteLine("${challengeBriefs[subtopicId]}"); }`,
    go: `package main\nimport "fmt"\nfunc main() { fmt.Println("${challengeBriefs[subtopicId]}") }`,
    rust: `fn main() { println!("${challengeBriefs[subtopicId]}"); }`,
    dart: `void main() => print("${challengeBriefs[subtopicId]}");`,
    kotlin: `fun main() = println("${challengeBriefs[subtopicId]}")`,
    swift: `print("${challengeBriefs[subtopicId]}")`,
    php: `echo "${challengeBriefs[subtopicId]}";`,
    ruby: `puts "${challengeBriefs[subtopicId]}"`,
    sql: `SELECT '${challengeBriefs[subtopicId]}' AS reference_goal;`,
    bash: `printf '%s\\n' '${challengeBriefs[subtopicId]}'`,
    powershell: `"${challengeBriefs[subtopicId]}"`,
    r: `print("${challengeBriefs[subtopicId]}")`,
    matlab: `disp("${challengeBriefs[subtopicId]}")`,
    scala: `object Main extends App { println("${challengeBriefs[subtopicId]}") }`,
  } as Record<string, string>

  if (subtopicId === 'variables') {
    return {
      java: 'class Main {\n  static double invoiceTotal() {\n    double price = 250;\n    int quantity = 3;\n    double taxRate = 0.16;\n    return Math.round(price * quantity * (1 + taxRate) * 100.0) / 100.0;\n  }\n}',
      c: '#include <stdio.h>\n\nint main(void) {\n  double price = 250, tax_rate = 0.16;\n  int quantity = 3;\n  printf("%.2f\\n", price * quantity * (1 + tax_rate));\n  return 0;\n}',
      cpp: '#include <iostream>\n#include <iomanip>\nusing namespace std;\n\nint main() {\n  double price = 250, taxRate = 0.16;\n  int quantity = 3;\n  cout << fixed << setprecision(2) << price * quantity * (1 + taxRate) << "\\n";\n}',
      csharp: 'using System;\n\nclass Program {\n  static double InvoiceTotal() {\n    double price = 250;\n    int quantity = 3;\n    double taxRate = 0.16;\n    return Math.Round(price * quantity * (1 + taxRate), 2);\n  }\n}',
      go: 'package main\n\nimport (\n  "fmt"\n  "math"\n)\n\nfunc main() {\n  price, quantity, taxRate := 250.0, 3.0, 0.16\n  total := math.Round(price * quantity * (1 + taxRate) * 100) / 100\n  fmt.Println(total)\n}',
      rust: 'fn main() {\n    let price = 250.0;\n    let quantity = 3.0;\n    let tax_rate = 0.16;\n    let total = price * quantity * (1.0 + tax_rate);\n    println!("{:.2}", total);\n}',
      dart: 'void main() {\n  final price = 250.0;\n  final quantity = 3;\n  final taxRate = 0.16;\n  print((price * quantity * (1 + taxRate)).toStringAsFixed(2));\n}',
      kotlin: 'fun main() {\n  val price = 250.0\n  val quantity = 3\n  val taxRate = 0.16\n  println("%.2f".format(price * quantity * (1 + taxRate)))\n}',
      swift: 'import Foundation\nlet price = 250.0\nlet quantity = 3.0\nlet taxRate = 0.16\nprint(String(format: "%.2f", price * quantity * (1 + taxRate)))',
      php: '$price = 250;\n$quantity = 3;\n$taxRate = 0.16;\necho round($price * $quantity * (1 + $taxRate), 2);',
      ruby: 'price = 250\nquantity = 3\ntax_rate = 0.16\nputs (price * quantity * (1 + tax_rate)).round(2)',
      sql: 'WITH invoice(price, quantity, tax_rate) AS (VALUES (250.0, 3, 0.16))\nSELECT ROUND(price * quantity * (1 + tax_rate), 2) AS total\nFROM invoice;',
      bash: 'price=250\nquantity=3\ntax_rate=0.16\nawk -v p="$price" -v q="$quantity" -v t="$tax_rate" \'BEGIN { printf "%.2f\\n", p * q * (1 + t) }\'',
      powershell: '$price = 250\n$quantity = 3\n$taxRate = 0.16\n[Math]::Round($price * $quantity * (1 + $taxRate), 2)',
      r: 'price <- 250\nquantity <- 3\ntax_rate <- 0.16\nround(price * quantity * (1 + tax_rate), 2)',
      matlab: 'price = 250;\nquantity = 3;\ntaxRate = 0.16;\nround(price * quantity * (1 + taxRate), 2)',
      scala: 'object Main extends App {\n  val price = 250.0\n  val quantity = 3\n  val taxRate = 0.16\n  println(BigDecimal(price * quantity * (1 + taxRate)).setScale(2, BigDecimal.RoundingMode.HALF_UP))\n}',
    }[languageId] ?? fallback[languageId]
  }

  if (subtopicId === 'control-flow') {
    return {
      java: 'static String accessStatus(boolean verified, int attemptsLeft) {\n  return verified && attemptsLeft > 0 ? "allow" : "block";\n}',
      c: 'const char* access_status(int verified, int attempts_left) {\n  return verified && attempts_left > 0 ? "allow" : "block";\n}',
      cpp: 'string accessStatus(bool verified, int attemptsLeft) {\n  return verified && attemptsLeft > 0 ? "allow" : "block";\n}',
      csharp: 'static string AccessStatus(bool verified, int attemptsLeft) => verified && attemptsLeft > 0 ? "allow" : "block";',
      go: 'func accessStatus(verified bool, attemptsLeft int) string {\n  if verified && attemptsLeft > 0 { return "allow" }\n  return "block"\n}',
      rust: 'fn access_status(verified: bool, attempts_left: i32) -> &' + "'static str {\n    if verified && attempts_left > 0 { \"allow\" } else { \"block\" }\n}",
      dart: 'String accessStatus(bool verified, int attemptsLeft) => verified && attemptsLeft > 0 ? "allow" : "block";',
      kotlin: 'fun accessStatus(verified: Boolean, attemptsLeft: Int): String = if (verified && attemptsLeft > 0) "allow" else "block"',
      swift: 'func accessStatus(verified: Bool, attemptsLeft: Int) -> String {\n  verified && attemptsLeft > 0 ? "allow" : "block"\n}',
      php: 'function accessStatus(bool $verified, int $attemptsLeft): string {\n    return $verified && $attemptsLeft > 0 ? "allow" : "block";\n}',
      ruby: 'def access_status(verified, attempts_left)\n  verified && attempts_left.positive? ? "allow" : "block"\nend',
      sql: 'SELECT CASE WHEN verified AND attempts_left > 0 THEN \'allow\' ELSE \'block\' END AS status\nFROM login_attempts;',
      bash: 'verified=true\nattempts_left=2\nif [[ "$verified" == true && "$attempts_left" -gt 0 ]]; then echo allow; else echo block; fi',
      powershell: 'function Get-AccessStatus($Verified, [int]$AttemptsLeft) {\n  if ($Verified -and $AttemptsLeft -gt 0) { "allow" } else { "block" }\n}',
      r: 'access_status <- function(verified, attempts_left) if (verified && attempts_left > 0) "allow" else "block"',
      matlab: 'function status = accessStatus(verified, attemptsLeft)\nif verified && attemptsLeft > 0\n    status = "allow";\nelse\n    status = "block";\nend\nend',
      scala: 'def accessStatus(verified: Boolean, attemptsLeft: Int): String = if (verified && attemptsLeft > 0) "allow" else "block"',
    }[languageId] ?? fallback[languageId]
  }

  if (subtopicId === 'functions') {
    return {
      java: 'static String slugify(String title) {\n  return title.trim().toLowerCase().replaceAll("\\\\s+", "-");\n}',
      c: '/* In C, write a helper that lowercases chars and emits hyphens for whitespace. */',
      cpp: 'string slugify(string title) {\n  transform(title.begin(), title.end(), title.begin(), ::tolower);\n  replace(title.begin(), title.end(), \' \', \'-\');\n  return title;\n}',
      csharp: 'static string Slugify(string title) => title.Trim().ToLower().Replace(" ", "-");',
      go: 'func slugify(title string) string {\n  return strings.ReplaceAll(strings.ToLower(strings.TrimSpace(title)), " ", "-")\n}',
      rust: 'fn slugify(title: &str) -> String {\n    title.trim().to_lowercase().replace(" ", "-")\n}',
      dart: 'String slugify(String title) => title.trim().toLowerCase().replaceAll(" ", "-");',
      kotlin: 'fun slugify(title: String): String = title.trim().lowercase().replace(" ", "-")',
      swift: 'func slugify(_ title: String) -> String {\n  title.trimmingCharacters(in: .whitespacesAndNewlines).lowercased().replacingOccurrences(of: " ", with: "-")\n}',
      php: 'function slugify(string $title): string {\n    return str_replace(" ", "-", strtolower(trim($title)));\n}',
      ruby: 'def slugify(title)\n  title.strip.downcase.tr(" ", "-")\nend',
      sql: "SELECT replace(lower(trim('Nexa Gen Basics')), ' ', '-') AS slug;",
      bash: 'slugify() {\n  echo "$1" | tr \'[:upper:]\' \'[:lower:]\' | sed -E \'s/^ +| +$//g; s/ +/-/g\'\n}',
      powershell: 'function ConvertTo-Slug([string]$Title) {\n  $Title.Trim().ToLower().Replace(" ", "-")\n}',
      r: 'slugify <- function(title) gsub(" +", "-", tolower(trimws(title)))',
      matlab: 'function slug = slugify(title)\nslug = lower(strtrim(title));\nslug = strrep(slug, " ", "-");\nend',
      scala: 'def slugify(title: String): String = title.trim.toLowerCase.replace(" ", "-")',
    }[languageId] ?? fallback[languageId]
  }

  if (subtopicId === 'arrays') {
    return {
      java: 'int[] top = java.util.Arrays.stream(scores).boxed().sorted(java.util.Comparator.reverseOrder()).limit(3).mapToInt(Integer::intValue).toArray();',
      c: '/* Sort scores descending with qsort, then read the first three values. */',
      cpp: 'sort(scores.begin(), scores.end(), greater<int>());\nvector<int> top(scores.begin(), scores.begin() + 3);',
      csharp: 'var top = scores.OrderByDescending(score => score).Take(3).ToArray();',
      go: 'sort.Sort(sort.Reverse(sort.IntSlice(scores)))\ntop := scores[:3]',
      rust: 'scores.sort_by(|a, b| b.cmp(a));\nlet top = &scores[..3];',
      dart: 'final top = [...scores]..sort((a, b) => b.compareTo(a));\nprint(top.take(3).toList());',
      kotlin: 'val top = scores.sortedDescending().take(3)',
      swift: 'let top = scores.sorted(by: >).prefix(3)',
      php: 'rsort($scores);\n$top = array_slice($scores, 0, 3);',
      ruby: 'top = scores.sort.reverse.first(3)',
      sql: 'WITH scores(score) AS (VALUES (40),(91),(63),(91),(12),(77))\nSELECT score FROM scores ORDER BY score DESC LIMIT 3;',
      bash: 'printf "%s\\n" "${scores[@]}" | sort -nr | head -3',
      powershell: '$top = $scores | Sort-Object -Descending | Select-Object -First 3',
      r: 'top <- head(sort(scores, decreasing = TRUE), 3)',
      matlab: 'top = sort(scores, "descend");\ntop = top(1:3);',
      scala: 'val top = scores.sorted(Ordering.Int.reverse).take(3)',
    }[languageId] ?? fallback[languageId]
  }

  return fallback[languageId]
}

const baseProgrammingQuestions: ProgrammingQuestion[] = [
  question('beginner-variables-invoice-total', 'variables', 'beginner', 'Create variables for price 250, quantity 3, and tax rate 0.16. Return the final invoice total rounded to 2 decimals.', { python: 'def invoice_total():\n    # create price, quantity, tax_rate\n    return None\n\nprint(invoice_total())', javascript: 'function invoiceTotal() {\n  // create price, quantity, taxRate\n  return null\n}\n\nconsole.log(invoiceTotal())', typescript: 'function invoiceTotal(): number {\n  // create price, quantity, taxRate\n  return 0\n}\n\nconsole.log(invoiceTotal())' }, { python: 'def invoice_total():\n    price = 250\n    quantity = 3\n    tax_rate = 0.16\n    subtotal = price * quantity\n    return round(subtotal * (1 + tax_rate), 2)\n\nprint(invoice_total())', javascript: 'function invoiceTotal() {\n  const price = 250\n  const quantity = 3\n  const taxRate = 0.16\n  const subtotal = price * quantity\n  return Number((subtotal * (1 + taxRate)).toFixed(2))\n}\n\nconsole.log(invoiceTotal())', typescript: 'function invoiceTotal(): number {\n  const price = 250\n  const quantity = 3\n  const taxRate = 0.16\n  const subtotal = price * quantity\n  return Number((subtotal * (1 + taxRate)).toFixed(2))\n}\n\nconsole.log(invoiceTotal())' }, 'Variables should describe intent: price, quantity, tax rate, subtotal, total. This is beginner work, but it mirrors real billing logic.', 'Calculate subtotal first, then apply tax. Keep names readable.'),
  question('beginner-types-user-summary', 'variables', 'beginner', 'Build a user summary from name, age, and active status. Return "Amina is 19 and active".', { python: 'def user_summary(name, age, active):\n    return ""\n\nprint(user_summary("Amina", 19, True))', javascript: 'function userSummary(name, age, active) {\n  return ""\n}\n\nconsole.log(userSummary("Amina", 19, true))', typescript: 'function userSummary(name: string, age: number, active: boolean): string {\n  return ""\n}\n\nconsole.log(userSummary("Amina", 19, true))' }, { python: 'def user_summary(name, age, active):\n    status = "active" if active else "inactive"\n    return f"{name} is {age} and {status}"\n\nprint(user_summary("Amina", 19, True))', javascript: 'function userSummary(name, age, active) {\n  const status = active ? "active" : "inactive"\n  return `${name} is ${age} and ${status}`\n}\n\nconsole.log(userSummary("Amina", 19, true))', typescript: 'function userSummary(name: string, age: number, active: boolean): string {\n  const status = active ? "active" : "inactive"\n  return `${name} is ${age} and ${status}`\n}\n\nconsole.log(userSummary("Amina", 19, true))' }, 'This checks string, number, and boolean use in one small real output. The boolean should be converted into human-readable text.', 'Turn the boolean into a word before building the final string.'),
  question('beginner-control-flow-login', 'control-flow', 'beginner', 'Return "allow" only when a user is verified and has at least 1 login attempt remaining. Otherwise return "block".', { python: 'def access_status(verified, attempts_left):\n    return ""\n\nprint(access_status(True, 2))', javascript: 'function accessStatus(verified, attemptsLeft) {\n  return ""\n}\n\nconsole.log(accessStatus(true, 2))', typescript: 'function accessStatus(verified: boolean, attemptsLeft: number): "allow" | "block" {\n  return "block"\n}\n\nconsole.log(accessStatus(true, 2))' }, { python: 'def access_status(verified, attempts_left):\n    if verified and attempts_left > 0:\n        return "allow"\n    return "block"\n\nprint(access_status(True, 2))', javascript: 'function accessStatus(verified, attemptsLeft) {\n  if (verified && attemptsLeft > 0) return "allow"\n  return "block"\n}\n\nconsole.log(accessStatus(true, 2))', typescript: 'function accessStatus(verified: boolean, attemptsLeft: number): "allow" | "block" {\n  if (verified && attemptsLeft > 0) return "allow"\n  return "block"\n}\n\nconsole.log(accessStatus(true, 2))' }, 'Control flow is about making one clear decision. The condition must require both verification and remaining attempts.', 'Use AND, not OR. One missing requirement should block the user.'),
  question('beginner-control-flow-grade-band', 'control-flow', 'beginner', 'Return a grade band: 80+ is "A", 60-79 is "B", 40-59 is "C", below 40 is "D".', { python: 'def grade_band(score):\n    return ""\n\nprint(grade_band(73))', javascript: 'function gradeBand(score) {\n  return ""\n}\n\nconsole.log(gradeBand(73))', typescript: 'function gradeBand(score: number): "A" | "B" | "C" | "D" {\n  return "D"\n}\n\nconsole.log(gradeBand(73))' }, { python: 'def grade_band(score):\n    if score >= 80:\n        return "A"\n    if score >= 60:\n        return "B"\n    if score >= 40:\n        return "C"\n    return "D"\n\nprint(grade_band(73))', javascript: 'function gradeBand(score) {\n  if (score >= 80) return "A"\n  if (score >= 60) return "B"\n  if (score >= 40) return "C"\n  return "D"\n}\n\nconsole.log(gradeBand(73))', typescript: 'function gradeBand(score: number): "A" | "B" | "C" | "D" {\n  if (score >= 80) return "A"\n  if (score >= 60) return "B"\n  if (score >= 40) return "C"\n  return "D"\n}\n\nconsole.log(gradeBand(73))' }, 'Order matters. Check highest thresholds first so each later branch naturally handles lower scores.', 'Start with 80, then 60, then 40.'),
  question('beginner-functions-slugify', 'functions', 'beginner', 'Write a function that converts "Nexa Gen Basics" into "nexa-gen-basics".', { python: 'def slugify(title):\n    return ""\n\nprint(slugify("Nexa Gen Basics"))', javascript: 'function slugify(title) {\n  return ""\n}\n\nconsole.log(slugify("Nexa Gen Basics"))', typescript: 'function slugify(title: string): string {\n  return ""\n}\n\nconsole.log(slugify("Nexa Gen Basics"))' }, { python: 'def slugify(title):\n    return title.strip().lower().replace(" ", "-")\n\nprint(slugify("Nexa Gen Basics"))', javascript: 'function slugify(title) {\n  return title.trim().toLowerCase().replaceAll(" ", "-")\n}\n\nconsole.log(slugify("Nexa Gen Basics"))', typescript: 'function slugify(title: string): string {\n  return title.trim().toLowerCase().replaceAll(" ", "-")\n}\n\nconsole.log(slugify("Nexa Gen Basics"))' }, 'A good function has a clear input and output. This also teaches method chaining without making the exercise silly.', 'Trim first, lowercase second, replace spaces last.'),
  question('beginner-functions-discount', 'functions', 'beginner', 'Write applyDiscount(amount, percent). For 1000 and 15, return 850.', { python: 'def apply_discount(amount, percent):\n    return None\n\nprint(apply_discount(1000, 15))', javascript: 'function applyDiscount(amount, percent) {\n  return null\n}\n\nconsole.log(applyDiscount(1000, 15))', typescript: 'function applyDiscount(amount: number, percent: number): number {\n  return 0\n}\n\nconsole.log(applyDiscount(1000, 15))' }, { python: 'def apply_discount(amount, percent):\n    return amount - (amount * percent / 100)\n\nprint(apply_discount(1000, 15))', javascript: 'function applyDiscount(amount, percent) {\n  return amount - (amount * percent / 100)\n}\n\nconsole.log(applyDiscount(1000, 15))', typescript: 'function applyDiscount(amount: number, percent: number): number {\n  return amount - (amount * percent / 100)\n}\n\nconsole.log(applyDiscount(1000, 15))' }, 'This is a clean function exercise because the formula is simple and the return value is easy to test.', 'A 15% discount means subtract 15% of the original amount.'),
  question('beginner-arrays-top-three', 'arrays', 'beginner', 'Return the three highest scores from [40, 91, 63, 91, 12, 77] in descending order.', { python: 'def top_three(scores):\n    return []\n\nprint(top_three([40, 91, 63, 91, 12, 77]))', javascript: 'function topThree(scores) {\n  return []\n}\n\nconsole.log(topThree([40, 91, 63, 91, 12, 77]))', typescript: 'function topThree(scores: number[]): number[] {\n  return []\n}\n\nconsole.log(topThree([40, 91, 63, 91, 12, 77]))' }, { python: 'def top_three(scores):\n    return sorted(scores, reverse=True)[:3]\n\nprint(top_three([40, 91, 63, 91, 12, 77]))', javascript: 'function topThree(scores) {\n  return [...scores].sort((a, b) => b - a).slice(0, 3)\n}\n\nconsole.log(topThree([40, 91, 63, 91, 12, 77]))', typescript: 'function topThree(scores: number[]): number[] {\n  return [...scores].sort((a, b) => b - a).slice(0, 3)\n}\n\nconsole.log(topThree([40, 91, 63, 91, 12, 77]))' }, 'Sorting then slicing is beginner-friendly and preserves duplicate scores. Copy arrays in JS/TS to avoid mutating caller data.', 'Sort descending, then take the first three.'),
  question('beginner-arrays-count-passing', 'arrays', 'beginner', 'Count how many scores are at least 50.', { python: 'def count_passing(scores):\n    return 0\n\nprint(count_passing([49, 50, 72, 20, 88]))', javascript: 'function countPassing(scores) {\n  return 0\n}\n\nconsole.log(countPassing([49, 50, 72, 20, 88]))', typescript: 'function countPassing(scores: number[]): number {\n  return 0\n}\n\nconsole.log(countPassing([49, 50, 72, 20, 88]))' }, { python: 'def count_passing(scores):\n    return sum(1 for score in scores if score >= 50)\n\nprint(count_passing([49, 50, 72, 20, 88]))', javascript: 'function countPassing(scores) {\n  return scores.filter(score => score >= 50).length\n}\n\nconsole.log(countPassing([49, 50, 72, 20, 88]))', typescript: 'function countPassing(scores: number[]): number {\n  return scores.filter(score => score >= 50).length\n}\n\nconsole.log(countPassing([49, 50, 72, 20, 88]))' }, 'This trains filtering logic. The boundary matters: 50 passes.', 'Use >= 50, not > 50.'),
  question('beginner-objects-profile-card', 'objects', 'beginner', 'Given a user object with name and role, return "Grace - Admin".', { python: 'def profile_card(user):\n    return ""\n\nprint(profile_card({"name": "Grace", "role": "Admin"}))', javascript: 'function profileCard(user) {\n  return ""\n}\n\nconsole.log(profileCard({ name: "Grace", role: "Admin" }))', typescript: 'type User = { name: string; role: string }\nfunction profileCard(user: User): string {\n  return ""\n}\n\nconsole.log(profileCard({ name: "Grace", role: "Admin" }))' }, { python: 'def profile_card(user):\n    return f"{user[\'name\']} - {user[\'role\']}"\n\nprint(profile_card({"name": "Grace", "role": "Admin"}))', javascript: 'function profileCard(user) {\n  return `${user.name} - ${user.role}`\n}\n\nconsole.log(profileCard({ name: "Grace", role: "Admin" }))', typescript: 'type User = { name: string; role: string }\nfunction profileCard(user: User): string {\n  return `${user.name} - ${user.role}`\n}\n\nconsole.log(profileCard({ name: "Grace", role: "Admin" }))' }, 'Objects group related fields. The point is direct, readable property access.', 'Read name and role from the same object.'),
  question('beginner-objects-cart-total', 'objects', 'beginner', 'Given items with price and quantity, return the cart total.', { python: 'def cart_total(items):\n    return 0\n\nprint(cart_total([{"price": 100, "quantity": 2}, {"price": 50, "quantity": 3}]))', javascript: 'function cartTotal(items) {\n  return 0\n}\n\nconsole.log(cartTotal([{ price: 100, quantity: 2 }, { price: 50, quantity: 3 }]))', typescript: 'type CartItem = { price: number; quantity: number }\nfunction cartTotal(items: CartItem[]): number {\n  return 0\n}\n\nconsole.log(cartTotal([{ price: 100, quantity: 2 }, { price: 50, quantity: 3 }]))' }, { python: 'def cart_total(items):\n    return sum(item["price"] * item["quantity"] for item in items)\n\nprint(cart_total([{"price": 100, "quantity": 2}, {"price": 50, "quantity": 3}]))', javascript: 'function cartTotal(items) {\n  return items.reduce((total, item) => total + item.price * item.quantity, 0)\n}\n\nconsole.log(cartTotal([{ price: 100, quantity: 2 }, { price: 50, quantity: 3 }]))', typescript: 'type CartItem = { price: number; quantity: number }\nfunction cartTotal(items: CartItem[]): number {\n  return items.reduce((total, item) => total + item.price * item.quantity, 0)\n}\n\nconsole.log(cartTotal([{ price: 100, quantity: 2 }, { price: 50, quantity: 3 }]))' }, 'This combines objects and arrays in a real ecommerce pattern. Multiply per item, then accumulate.', 'Each line item total is price times quantity.'),
  question('intermediate-oop-bank-account', 'oop', 'intermediate', 'Create a BankAccount with deposit, withdraw, and balance behavior. Prevent overdrafts.', { python: 'class BankAccount:\n    pass\n\naccount = BankAccount(100)\nprint(account.withdraw(30))', javascript: 'class BankAccount {\n}\n\nconst account = new BankAccount(100)\nconsole.log(account.withdraw(30))', typescript: 'class BankAccount {\n}\n\nconst account = new BankAccount(100)\nconsole.log(account.withdraw(30))' }, { python: 'class BankAccount:\n    def __init__(self, balance):\n        self.balance = balance\n    def deposit(self, amount):\n        self.balance += amount\n        return self.balance\n    def withdraw(self, amount):\n        if amount > self.balance:\n            return False\n        self.balance -= amount\n        return True\n\naccount = BankAccount(100)\nprint(account.withdraw(30))', javascript: 'class BankAccount {\n  constructor(balance) {\n    this.balance = balance\n  }\n  deposit(amount) {\n    this.balance += amount\n    return this.balance\n  }\n  withdraw(amount) {\n    if (amount > this.balance) return false\n    this.balance -= amount\n    return true\n  }\n}\n\nconst account = new BankAccount(100)\nconsole.log(account.withdraw(30))', typescript: 'class BankAccount {\n  constructor(private balance: number) {}\n  deposit(amount: number): number {\n    this.balance += amount\n    return this.balance\n  }\n  withdraw(amount: number): boolean {\n    if (amount > this.balance) return false\n    this.balance -= amount\n    return true\n  }\n}\n\nconst account = new BankAccount(100)\nconsole.log(account.withdraw(30))' }, 'OOP should protect state and expose behavior. The overdraft rule belongs inside withdraw.', 'Store balance in the object and check before subtracting.'),
  question('intermediate-errors-parse-json', 'errors', 'intermediate', 'Parse JSON safely. Return the parsed value, or null when the input is invalid.', { python: 'def safe_parse(raw):\n    return None\n\nprint(safe_parse("{bad json"))', javascript: 'function safeParse(raw) {\n  return null\n}\n\nconsole.log(safeParse("{bad json"))', typescript: 'function safeParse(raw: string): unknown | null {\n  return null\n}\n\nconsole.log(safeParse("{bad json"))' }, { python: 'import json\n\ndef safe_parse(raw):\n    try:\n        return json.loads(raw)\n    except json.JSONDecodeError:\n        return None\n\nprint(safe_parse("{bad json"))', javascript: 'function safeParse(raw) {\n  try {\n    return JSON.parse(raw)\n  } catch {\n    return null\n  }\n}\n\nconsole.log(safeParse("{bad json"))', typescript: 'function safeParse(raw: string): unknown | null {\n  try {\n    return JSON.parse(raw)\n  } catch {\n    return null\n  }\n}\n\nconsole.log(safeParse("{bad json"))' }, 'Error handling turns expected failure into controlled behavior. Invalid external input is normal, not a surprise party.', 'Wrap only the risky parse call.'),
  question('intermediate-files-word-count', 'files', 'intermediate', 'Read text from a file path and return the number of words. Assume whitespace separates words.', { python: 'def word_count(path):\n    return 0', javascript: 'const fs = require("fs")\nfunction wordCount(path) {\n  return 0\n}', typescript: 'import { readFileSync } from "fs"\nfunction wordCount(path: string): number {\n  return 0\n}' }, { python: 'def word_count(path):\n    with open(path, "r", encoding="utf-8") as file:\n        return len(file.read().split())', javascript: 'const fs = require("fs")\nfunction wordCount(path) {\n  const text = fs.readFileSync(path, "utf8")\n  return text.trim() ? text.trim().split(/\\s+/).length : 0\n}', typescript: 'import { readFileSync } from "fs"\nfunction wordCount(path: string): number {\n  const text = readFileSync(path, "utf8").trim()\n  return text ? text.split(/\\s+/).length : 0\n}' }, 'File handling needs resource safety and empty-file handling. Python uses a context manager; JS/TS use fs for Node-style IDE tasks.', 'Read the file as text, trim, split on whitespace.'),
  question('intermediate-apis-normalize-users', 'apis', 'intermediate', 'Fetch users from /api/users and return only active user emails in lowercase.', { python: 'import requests\n\ndef active_emails(url):\n    return []', javascript: 'async function activeEmails(url) {\n  return []\n}', typescript: 'type User = { email: string; active: boolean }\nasync function activeEmails(url: string): Promise<string[]> {\n  return []\n}' }, { python: 'import requests\n\ndef active_emails(url):\n    users = requests.get(url, timeout=10).json()\n    return [user["email"].lower() for user in users if user.get("active")]', javascript: 'async function activeEmails(url) {\n  const response = await fetch(url)\n  const users = await response.json()\n  return users.filter(user => user.active).map(user => user.email.toLowerCase())\n}', typescript: 'type User = { email: string; active: boolean }\nasync function activeEmails(url: string): Promise<string[]> {\n  const response = await fetch(url)\n  const users = await response.json() as User[]\n  return users.filter(user => user.active).map(user => user.email.toLowerCase())\n}' }, 'API work is request, parse, validate/shape, return. This exercise focuses on shaping response data for the rest of an app.', 'Filter active first, then map email to lowercase.'),
  question('intermediate-modules-currency', 'modules', 'intermediate', 'Create a reusable convertCurrency(amount, rate) function and export it from the module.', { python: 'def convert_currency(amount, rate):\n    return 0', javascript: 'function convertCurrency(amount, rate) {\n  return 0\n}', typescript: 'function convertCurrency(amount: number, rate: number): number {\n  return 0\n}' }, { python: 'def convert_currency(amount, rate):\n    return round(amount * rate, 2)', javascript: 'export function convertCurrency(amount, rate) {\n  return Number((amount * rate).toFixed(2))\n}', typescript: 'export function convertCurrency(amount: number, rate: number): number {\n  return Number((amount * rate).toFixed(2))\n}' }, 'Modules should expose small, testable functions. Currency conversion also forces rounding decisions.', 'Multiply amount by rate and round for money-like display.'),
  question('pro-async-rate-limited-fetch', 'async', 'pro', 'Fetch many URLs with a concurrency limit of 3 and return responses in the original order.', { python: 'async def fetch_all(urls):\n    return []', javascript: 'async function fetchAll(urls) {\n  return []\n}', typescript: 'async function fetchAll(urls: string[]): Promise<string[]> {\n  return []\n}' }, { python: 'import asyncio\nimport aiohttp\n\nasync def fetch_all(urls):\n    semaphore = asyncio.Semaphore(3)\n    async with aiohttp.ClientSession() as session:\n        async def fetch(url):\n            async with semaphore:\n                async with session.get(url) as response:\n                    return await response.text()\n        return await asyncio.gather(*(fetch(url) for url in urls))', javascript: 'async function fetchAll(urls) {\n  const results = new Array(urls.length)\n  let index = 0\n  async function worker() {\n    while (index < urls.length) {\n      const current = index++\n      results[current] = await fetch(urls[current]).then(r => r.text())\n    }\n  }\n  await Promise.all(Array.from({ length: 3 }, worker))\n  return results\n}', typescript: 'async function fetchAll(urls: string[]): Promise<string[]> {\n  const results: string[] = new Array(urls.length)\n  let index = 0\n  async function worker(): Promise<void> {\n    while (index < urls.length) {\n      const current = index++\n      results[current] = await fetch(urls[current]).then(r => r.text())\n    }\n  }\n  await Promise.all(Array.from({ length: 3 }, worker))\n  return results\n}' }, 'Advanced async is about throughput without stampeding services. Preserve order by storing each result at its original index.', 'Use workers or a semaphore; do not launch unlimited requests.'),
  question('pro-data-structures-lru-cache', 'data-structures', 'pro', 'Implement an LRU cache with get and put in O(1) average time.', { python: 'class LRUCache:\n    def __init__(self, capacity):\n        pass', javascript: 'class LRUCache {\n  constructor(capacity) {}\n}', typescript: 'class LRUCache<K, V> {\n  constructor(private capacity: number) {}\n}' }, { python: 'from collections import OrderedDict\n\nclass LRUCache:\n    def __init__(self, capacity):\n        self.capacity = capacity\n        self.cache = OrderedDict()\n    def get(self, key):\n        if key not in self.cache:\n            return -1\n        self.cache.move_to_end(key)\n        return self.cache[key]\n    def put(self, key, value):\n        if key in self.cache:\n            self.cache.move_to_end(key)\n        self.cache[key] = value\n        if len(self.cache) > self.capacity:\n            self.cache.popitem(last=False)', javascript: 'class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity\n    this.cache = new Map()\n  }\n  get(key) {\n    if (!this.cache.has(key)) return -1\n    const value = this.cache.get(key)\n    this.cache.delete(key)\n    this.cache.set(key, value)\n    return value\n  }\n  put(key, value) {\n    if (this.cache.has(key)) this.cache.delete(key)\n    this.cache.set(key, value)\n    if (this.cache.size > this.capacity) this.cache.delete(this.cache.keys().next().value)\n  }\n}', typescript: 'class LRUCache<K, V> {\n  private cache = new Map<K, V>()\n  constructor(private capacity: number) {}\n  get(key: K): V | -1 {\n    if (!this.cache.has(key)) return -1\n    const value = this.cache.get(key) as V\n    this.cache.delete(key)\n    this.cache.set(key, value)\n    return value\n  }\n  put(key: K, value: V): void {\n    if (this.cache.has(key)) this.cache.delete(key)\n    this.cache.set(key, value)\n    if (this.cache.size > this.capacity) this.cache.delete(this.cache.keys().next().value as K)\n  }\n}' }, 'This is interview-grade because it tests data-structure choice, mutation order, and complexity guarantees.', 'You need fast lookup plus recency ordering.'),
  question('pro-algorithms-merge-intervals', 'algorithms', 'pro', 'Merge overlapping intervals. Example: [[1,3],[2,6],[8,10]] returns [[1,6],[8,10]].', { python: 'def merge(intervals):\n    return []', javascript: 'function merge(intervals) {\n  return []\n}', typescript: 'function merge(intervals: Array<[number, number]>): Array<[number, number]> {\n  return []\n}' }, { python: 'def merge(intervals):\n    intervals.sort(key=lambda item: item[0])\n    merged = []\n    for start, end in intervals:\n        if not merged or start > merged[-1][1]:\n            merged.append([start, end])\n        else:\n            merged[-1][1] = max(merged[-1][1], end)\n    return merged', javascript: 'function merge(intervals) {\n  intervals.sort((a, b) => a[0] - b[0])\n  const merged = []\n  for (const [start, end] of intervals) {\n    if (!merged.length || start > merged[merged.length - 1][1]) merged.push([start, end])\n    else merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], end)\n  }\n  return merged\n}', typescript: 'function merge(intervals: Array<[number, number]>): Array<[number, number]> {\n  intervals.sort((a, b) => a[0] - b[0])\n  const merged: Array<[number, number]> = []\n  for (const [start, end] of intervals) {\n    if (!merged.length || start > merged[merged.length - 1][1]) merged.push([start, end])\n    else merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], end)\n  }\n  return merged\n}' }, 'Sort by start time, then fold overlaps into the last interval. Time complexity is O(n log n) because of sorting.', 'After sorting, only compare with the last merged interval.'),
  question('pro-performance-index-by-id', 'performance', 'pro', 'Optimize repeated user lookups by converting an array of users into an id-indexed map.', { python: 'def index_users(users):\n    return None', javascript: 'function indexUsers(users) {\n  return null\n}', typescript: 'type User = { id: string; name: string }\nfunction indexUsers(users: User[]): Record<string, User> {\n  return {}\n}' }, { python: 'def index_users(users):\n    return {user["id"]: user for user in users}', javascript: 'function indexUsers(users) {\n  return Object.fromEntries(users.map(user => [user.id, user]))\n}', typescript: 'type User = { id: string; name: string }\nfunction indexUsers(users: User[]): Record<string, User> {\n  return Object.fromEntries(users.map(user => [user.id, user]))\n}' }, 'This replaces repeated O(n) scans with O(1) average lookup. Performance work starts with choosing the right access pattern.', 'Build the map once, then read by id.'),
  question('pro-system-design-idempotency', 'system-design', 'pro', 'Design code for an idempotency check: process a payment only once for a given requestId.', { python: 'processed = set()\n\ndef process_payment(request_id, charge):\n    return None', javascript: 'const processed = new Set()\nfunction processPayment(requestId, charge) {\n  return null\n}', typescript: 'const processed = new Set<string>()\nfunction processPayment(requestId: string, charge: () => string): string {\n  return ""\n}' }, { python: 'processed = set()\n\ndef process_payment(request_id, charge):\n    if request_id in processed:\n        return "duplicate"\n    result = charge()\n    processed.add(request_id)\n    return result', javascript: 'const processed = new Set()\nfunction processPayment(requestId, charge) {\n  if (processed.has(requestId)) return "duplicate"\n  const result = charge()\n  processed.add(requestId)\n  return result\n}', typescript: 'const processed = new Set<string>()\nfunction processPayment(requestId: string, charge: () => string): string {\n  if (processed.has(requestId)) return "duplicate"\n  const result = charge()\n  processed.add(requestId)\n  return result\n}' }, 'System design becomes real when requirements enter the code. Idempotency prevents retries from charging twice.', 'Check requestId before calling charge. In production, store this in durable storage.'),
]

export const programmingQuestions: ProgrammingQuestion[] = baseProgrammingQuestions.map(withExpandedLanguages)

export const timerByLevel: Record<SkillLevel, number> = {
  beginner: 45,
  intermediate: 90,
  pro: 180,
}

export function codeForLanguage(languageId: string, codeMap: Record<string, string>) {
  return codeMap[languageId] ?? codeMap.javascript ?? Object.values(codeMap)[0] ?? ''
}
