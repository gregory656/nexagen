import type { ProgrammingLanguage } from '../data/programmingContent'

type Judge0Response = {
  stdout?: string | null
  stderr?: string | null
  compile_output?: string | null
  message?: string | null
  status?: {
    id?: number
    description?: string
  } | null
  token?: string
}

export type Judge0Result = {
  output: string
  status: 'success' | 'compile-error' | 'runtime-error' | 'timeout' | 'error'
  statusText: string
}

const languageIds: Record<string, number> = {
  python: 71,
  javascript: 63,
  typescript: 74,
  java: 62,
  c: 50,
  cpp: 54,
  csharp: 51,
  go: 60,
  rust: 73,
  dart: 90,
  kotlin: 78,
  swift: 83,
  php: 68,
  ruby: 72,
  sql: 82,
  bash: 46,
  powershell: 51,
  r: 80,
  scala: 81,
}

export function judge0Configured() {
  return Boolean(String(import.meta.env.VITE_JUDGE0_URL ?? '').trim())
}

export async function executeJudge0(language: ProgrammingLanguage, sourceCode: string): Promise<Judge0Result> {
  const baseUrl = String(import.meta.env.VITE_JUDGE0_URL ?? '').trim().replace(/\/$/, '')
  const rapidApiKey = String(import.meta.env.VITE_RAPIDAPI_KEY ?? '').trim()
  const rapidApiHost = String(import.meta.env.VITE_RAPIDAPI_HOST ?? '').trim()

  if (!baseUrl) {
    return {
      output: 'Execution API is not configured. Add VITE_JUDGE0_URL to .env.local to run code remotely.',
      status: 'error',
      statusText: 'Missing Judge0 URL',
    }
  }

  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 20000)
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (rapidApiKey) headers['x-rapidapi-key'] = rapidApiKey
  if (rapidApiHost) headers['x-rapidapi-host'] = rapidApiHost

  try {
    const response = await fetch(`${baseUrl}/submissions?base64_encoded=false&wait=true`, {
      method: 'POST',
      headers,
      signal: controller.signal,
      body: JSON.stringify({
        language_id: languageIds[language.id] ?? 63,
        source_code: sourceCode,
        stdin: '',
      }),
    })

    const data = (await response.json().catch(() => ({}))) as Judge0Response
    if (!response.ok) {
      return {
        output: data.message ?? `Judge0 returned ${response.status}. Check your URL, RapidAPI key, and host.`,
        status: 'error',
        statusText: 'Execution request failed',
      }
    }

    return formatJudge0Result(data)
  } catch (error) {
    return {
      output: error instanceof DOMException && error.name === 'AbortError'
        ? 'Execution timed out after 20 seconds. Try a smaller input or check the Judge0 service.'
        : error instanceof Error
          ? `Execution service failed: ${error.message}`
          : 'Execution service failed.',
      status: error instanceof DOMException && error.name === 'AbortError' ? 'timeout' : 'error',
      statusText: error instanceof DOMException && error.name === 'AbortError' ? 'Timed out' : 'Service error',
    }
  } finally {
    window.clearTimeout(timeout)
  }
}

function formatJudge0Result(data: Judge0Response): Judge0Result {
  const statusText = data.status?.description ?? 'Finished'
  if (data.compile_output) {
    return { output: data.compile_output.trim(), status: 'compile-error', statusText }
  }
  if (data.stderr) {
    return { output: data.stderr.trim(), status: 'runtime-error', statusText }
  }
  if (data.stdout) {
    return { output: data.stdout.trim(), status: 'success', statusText }
  }
  if (data.message) {
    return { output: data.message, status: 'error', statusText }
  }
  return { output: 'Execution finished with no output.', status: 'success', statusText }
}
