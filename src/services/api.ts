export type PlayItem = {
  action: string
  game: string
  emulator: string
  timestamp: string
}

export type ApiResponse = {
  items: PlayItem[]
  last_key: string | null
}

const BASE_URL = 'https://xhqzn7hz2ib3kxpecibbl73xhy0duqpr.lambda-url.us-west-2.on.aws/'

export async function fetchAllPages(signal?: AbortSignal): Promise<PlayItem[]> {
  let next: string | null = null
  const all: PlayItem[] = []
  let guard = 0

  // Read API key from Vite env (set in .env.local as VITE_API_KEY)
  const apiKey = import.meta.env.VITE_API_KEY
  console.log('API Key loaded:', apiKey ? 'YES' : 'NO')
  console.log('API Key value:', apiKey)
  console.log('All env vars:', import.meta.env)

  do {
    const url = new URL(BASE_URL)
    if (next) url.searchParams.set('last_key', next)

    const headers: Record<string, string> = { accept: 'application/json' }
    if (apiKey) headers['x-api-key'] = apiKey
    console.log('Headers being sent:', headers)

    const res = await fetch(url.toString(), { headers, signal })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = (await res.json()) as ApiResponse
    if (Array.isArray(data.items)) all.push(...data.items)
    next = data.last_key ?? null
    guard++
    if (guard > 1000) throw new Error('Pagination loop guard triggered')
  } while (next)

  return all
}
