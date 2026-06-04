import { useState } from 'react'
import IntakeForm from './components/IntakeForm'
import ScoreResult from './components/ScoreResult'
import { parseAndValidateScoreResult } from './utils/scoreResultSchema'
import './App.css'

const ANTHROPIC_MODEL = import.meta.env.VITE_ANTHROPIC_MODEL || 'claude-sonnet-4-6'
const CLIENT_TIMEOUT_MS = 35000

function toUserErrorMessage(payload, statusCode) {
  const message = payload?.error?.message || payload?.message
  if (message) return message
  if (statusCode >= 500) return 'Server error while scoring. Please try again.'
  if (statusCode >= 400) return 'Request was rejected. Please review your input and retry.'
  return 'Unable to complete scoring right now. Please try again.'
}

export default function App() {
  const [result, setResult] = useState(null)
  const [useCaseName, setUseCaseName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [lastSubmittedForm, setLastSubmittedForm] = useState(null)

  async function handleScore(formData) {
    setLoading(true)
    setError('')
    setLastSubmittedForm(formData)
    setUseCaseName(formData.name)
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), CLIENT_TIMEOUT_MS)

    const prompt = `You are an enterprise AI readiness expert. Score this use case across four dimensions (0-25 each, total 100):
1. Data readiness — quality, availability, labeling, ground truth reliability
2. Process maturity — how well-defined and stable the underlying business process is
3. Business value — clarity of ROI, executive sponsorship, measurable outcomes
4. Technical feasibility — appropriateness of AI approach, infrastructure, integration complexity

Use case name: ${formData.name}
Industry: ${formData.industry || 'Not specified'}
AI approach: ${formData.approach || 'Not specified'}
Description: ${formData.description}
Known constraints/risks: ${formData.risks || 'None provided'}

For each dimension also include:
- "confidence": your confidence in the score given the information provided — "high" (strong signals), "medium" (partial signals), or "low" (significant gaps or ambiguity)
- "assumptions": 1-2 key assumptions you made to arrive at this score (be specific)

Respond ONLY with valid JSON, no markdown, no preamble:
{"overall":<0-100>,"verdict":"<pursue|derisk|notready>","dimensions":[{"name":"Data readiness","score":<0-25>,"rationale":"<2 sentences>","confidence":"<high|medium|low>","assumptions":"<1-2 sentences>"},{"name":"Process maturity","score":<0-25>,"rationale":"<2 sentences>","confidence":"<high|medium|low>","assumptions":"<1-2 sentences>"},{"name":"Business value","score":<0-25>,"rationale":"<2 sentences>","confidence":"<high|medium|low>","assumptions":"<1-2 sentences>"},{"name":"Technical feasibility","score":<0-25>,"rationale":"<2 sentences>","confidence":"<high|medium|low>","assumptions":"<1-2 sentences>"}],"rationale":"<3-4 sentence recommendation>"}`

    try {
      const res = await fetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: ANTHROPIC_MODEL,
          max_tokens: 2000,
          messages: [{ role: 'user', content: prompt }]
        }),
        signal: controller.signal
      })

      const payload = await res.json()
      if (!res.ok) throw new Error(toUserErrorMessage(payload, res.status))

      const data = payload?.data || payload
      const raw = data?.content?.find(b => b.type === 'text')?.text || ''
      const parsed = parseAndValidateScoreResult(raw)
      setResult(parsed)
    } catch (e) {
      const isTimeout = e?.name === 'AbortError'
      const message = isTimeout
        ? `Scoring timed out after ${CLIENT_TIMEOUT_MS / 1000} seconds. Please retry.`
        : e?.message || 'Scoring failed. Please retry.'
      setError(message)
    } finally {
      clearTimeout(timeoutId)
      setLoading(false)
    }
  }

  return (
    <div className="shell">
      <div className="wordmark">Enterprise AI readiness scorer</div>
      {!result && !loading && (
        <IntakeForm
          onSubmit={handleScore}
          onRetry={lastSubmittedForm ? () => handleScore(lastSubmittedForm) : null}
          error={error}
        />
      )}
      {loading && (
        <div className="thinking">
          <div className="dots">
            <div className="dot" /><div className="dot" /><div className="dot" />
          </div>
          <p>Evaluating readiness...</p>
        </div>
      )}
      {result && (
        <ScoreResult result={result} name={useCaseName} onReset={() => { setResult(null); setError('') }} />
      )}
    </div>
  )
}
