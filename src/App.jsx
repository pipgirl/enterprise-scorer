import { useState } from 'react'
import IntakeForm from './components/IntakeForm'
import ScoreResult from './components/ScoreResult'
import './App.css'

const ANTHROPIC_MODEL = import.meta.env.VITE_ANTHROPIC_MODEL || 'claude-sonnet-4-6'

export default function App() {
  const [result, setResult] = useState(null)
  const [useCaseName, setUseCaseName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleScore(formData) {
    setLoading(true)
    setError('')
    setUseCaseName(formData.name)

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

Respond ONLY with valid JSON, no markdown, no preamble:
{"overall":<0-100>,"verdict":"<pursue|derisk|notready>","dimensions":[{"name":"Data readiness","score":<0-25>,"rationale":"<2 sentences>"},{"name":"Process maturity","score":<0-25>,"rationale":"<2 sentences>"},{"name":"Business value","score":<0-25>,"rationale":"<2 sentences>"},{"name":"Technical feasibility","score":<0-25>,"rationale":"<2 sentences>"}],"rationale":"<3-4 sentence recommendation>"}`

    try {
      const res = await fetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: ANTHROPIC_MODEL,
          max_tokens: 2000,
          messages: [{ role: 'user', content: prompt }]
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(JSON.stringify(data))
      const raw = data.content?.find(b => b.type === 'text')?.text || ''
      const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim())
      setResult(parsed)
    } catch (e) {
      setError('Error: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="shell">
      <div className="wordmark">Enterprise AI readiness scorer</div>
      {!result && !loading && <IntakeForm onSubmit={handleScore} error={error} />}
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
