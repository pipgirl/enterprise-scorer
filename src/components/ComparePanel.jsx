import { useState } from 'react'
import './ComparePanel.css'

const VERDICT_LABELS = { pursue: 'Pursue', derisk: 'De-risk first', notready: 'Not ready' }

function Delta({ value }) {
  if (value === 0) return <span className="delta delta-neutral">±0</span>
  return (
    <span className={`delta ${value > 0 ? 'delta-up' : 'delta-down'}`}>
      {value > 0 ? `+${value}` : value}
    </span>
  )
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function ComparePanel({ currentResult, currentName, history, currentId }) {
  const [selectedId, setSelectedId] = useState('')

  const options = history.filter(e => e.id !== currentId && e.name === currentName)
  const prior = options.find(e => e.id === selectedId)

  return (
    <div className="compare-panel">
      <div className="compare-header">
        <span className="compare-label">Track progress over time</span>
      </div>

      {options.length === 0 ? (
        <p className="compare-nudge">Re-score this use case after making improvements to track progress across runs.</p>
      ) : (
      <select
        className="compare-select"
        value={selectedId}
        onChange={e => setSelectedId(e.target.value)}
      >
        <option value="">Select a prior run…</option>
        {options.map(e => (
          <option key={e.id} value={e.id}>
            {formatDate(e.scoredAt)} — {e.result.overall} / 100
          </option>
        ))}
      </select>
      )}

      {prior && (
        <div className="compare-table">
          <div className="compare-col-headers">
            <span />
            <span className="compare-col-name current-col">Latest</span>
            <span className="compare-col-name prior-col">{formatDate(prior.scoredAt)}</span>
            <span className="compare-col-name delta-col">Delta</span>
          </div>

          <div className="compare-row compare-row-overall">
            <span className="compare-row-label">Overall</span>
            <span className="compare-val">{currentResult.overall}</span>
            <span className="compare-val muted">{prior.result.overall}</span>
            <Delta value={currentResult.overall - prior.result.overall} />
          </div>

          <div className="compare-row compare-row-verdict">
            <span className="compare-row-label">Verdict</span>
            <span className={`compare-verdict-badge ${currentResult.verdict}`}>
              {VERDICT_LABELS[currentResult.verdict]}
            </span>
            <span className={`compare-verdict-badge ${prior.result.verdict}`}>
              {VERDICT_LABELS[prior.result.verdict]}
            </span>
            <span />
          </div>

          {currentResult.dimensions.map((dim, i) => {
            const priorDim = prior.result.dimensions[i]
            return (
              <div className="compare-row" key={dim.name}>
                <span className="compare-row-label dim-row-label">{dim.name}</span>
                <span className="compare-val">{dim.score}</span>
                <span className="compare-val muted">{priorDim.score}</span>
                <Delta value={dim.score - priorDim.score} />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
