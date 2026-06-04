import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages'
const REQUEST_TIMEOUT_MS = 30000

const app = express()
app.use(cors())
app.use(express.json())

app.post('/api/score', async (req, res) => {
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({
      ok: false,
      error: {
        type: 'config_error',
        message: 'Missing ANTHROPIC_API_KEY in server environment.'
      }
    })
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(ANTHROPIC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(req.body),
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    const data = await response.json()
    if (!response.ok) {
      return res.status(response.status).json({
        ok: false,
        error: {
          type: data?.error?.type || 'upstream_error',
          message: data?.error?.message || 'Anthropic API request failed.',
          upstreamStatus: response.status,
          requestId: data?.request_id || null,
          details: data?.error || null
        }
      })
    }

    return res.status(200).json({ ok: true, data })
  } catch (err) {
    clearTimeout(timeoutId)

    const isTimeout = err?.name === 'AbortError'
    return res.status(isTimeout ? 504 : 500).json({
      ok: false,
      error: {
        type: isTimeout ? 'timeout_error' : 'proxy_error',
        message: isTimeout
          ? `Anthropic API timed out after ${REQUEST_TIMEOUT_MS / 1000} seconds.`
          : err?.message || 'Unexpected proxy error.'
      }
    })
  }
})

app.listen(3001, () => console.log('Proxy running on http://localhost:3001'))
