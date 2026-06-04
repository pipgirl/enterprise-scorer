import { useState } from 'react'
import './IntakeForm.css'

export default function IntakeForm({ onSubmit, onRetry, error }) {
  const [form, setForm] = useState({ name: '', description: '', industry: '', approach: '', risks: '' })
  const set = (field, val) => setForm(f => ({ ...f, [field]: val }))

  return (
    <div>
      <h1>Is this use case <em>ready</em>?</h1>
      <p className="subtitle">Describe an enterprise AI use case. Claude will score it across four dimensions and recommend whether to pursue, de-risk first, or hold.</p>

      <div className="field">
        <label>Use case name</label>
        <input type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Automated field anomaly detection for Telco planning" />
      </div>
      <div className="field">
        <label>Description</label>
        <textarea rows={4} value={form.description} onChange={e => set('description', e.target.value)} placeholder="What problem does this solve? Who uses the output? What does the AI component do?" />
      </div>
      <div className="grid-2">
        <div className="field">
          <label>Industry</label>
          <select value={form.industry} onChange={e => set('industry', e.target.value)}>
            <option value="">Select industry</option>
            <option>Telecommunications</option>
            <option>Energy & Utilities</option>
            <option>Media & Entertainment</option>
            <option>Manufacturing</option>
            <option>Financial Services</option>
            <option>Healthcare</option>
            <option>Other</option>
          </select>
        </div>
        <div className="field">
          <label>AI approach</label>
          <select value={form.approach} onChange={e => set('approach', e.target.value)}>
            <option value="">Select approach</option>
            <option>RAG / retrieval-augmented</option>
            <option>Multi-agent</option>
            <option>Multimodal</option>
            <option>Fine-tuned model</option>
            <option>Agentic workflow</option>
            <option>Predictive ML</option>
            <option>Unsure / TBD</option>
          </select>
        </div>
      </div>
      <div className="field">
        <label>Known constraints or risks (optional)</label>
        <textarea rows={3} value={form.risks} onChange={e => set('risks', e.target.value)} placeholder="Data gaps, org readiness concerns, regulatory issues, unclear ownership..." />
      </div>

      <button className="submit-btn" onClick={() => onSubmit(form)} disabled={!form.name || !form.description}>
        Score this use case →
      </button>
      {error && <div className="error-msg">{error}</div>}
      {error && onRetry && (
        <button className="retry-btn" onClick={onRetry}>
          Retry last score
        </button>
      )}
    </div>
  )
}
