const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

type ChatMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  const apiKey = Deno.env.get('OPENAI_API_KEY')
  if (!apiKey) return json({ error: 'OpenAI is not configured. Add OPENAI_API_KEY as a Supabase secret.' }, 500)

  const body = await request.json().catch(() => ({})) as { messages?: ChatMessage[] }
  const messages = Array.isArray(body.messages) ? body.messages.slice(-12) : []
  if (!messages.length) return json({ error: 'messages are required' }, 400)

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.4,
      messages: [
        {
          role: 'system',
          content: 'You are GracyAI, a concise NexaGen SaaS assistant. Help with onboarding, subscriptions, coding practice, payments, dashboards, and support.',
        },
        ...messages,
      ],
    }),
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const message = data?.error?.message ?? `OpenAI returned ${response.status}`
    return json({ error: message }, response.status)
  }

  return json({ reply: data?.choices?.[0]?.message?.content ?? 'I could not generate a reply right now.' })
})

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status,
  })
}
