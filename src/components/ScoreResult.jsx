import { useEffect, useRef } from 'react'
import ComparePanel from './ComparePanel'
import './ScoreResult.css'

const LABELS = { pursue: 'Pursue', derisk: 'De-risk first', notready: 'Not ready' }
const CONFIDENCE_LABELS = { high: 'High confidence', medium: 'Medium confidence', low: 'Low confidence' }

export default function ScoreResult({ result, name, onReset, history, currentHistoryId }) {
  const barsRef = useRef([])
  useEffect(() => {
    const t = setTimeout(() => {
      barsRef.current.forEach(b => { if (b) b.style.width = b.dataset.pct + '%' })
    }, 100)
    return () => clearTimeout(t)
  }, [result])

  const printedAt = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <div className="result">
      <div className="print-header">
        <span className="print-header-title">Enterprise AI Readiness Scorer</span>
        <span className="print-header-date">{printedAt}</span>
      </div>

      <div className="result-header">
        <div className="result-label">Readiness assessment</div>
        <div className="use-case-name">{name}</div>
        <div className={`verdict ${result.verdict}`}>
          <span className="verdict-dot" />
          {LABELS[result.verdict] || result.verdict}
        </div>
        <div className="overall-score"><span>{result.overall}</span>/ 100 overall readiness score</div>
      </div>

      <div className="dimensions">
        {result.dimensions.map((d, i) => (
          <div className="dim" key={d.name}>
            <div className="dim-header">
              <span className="dim-name">{d.name}</span>
              <span className="dim-score">{d.score} / 25</span>
            </div>
            <div className="bar-bg">
              <div className="bar-fill" style={{ width: '0%' }} data-pct={Math.round((d.score/25)*100)} ref={el => barsRef.current[i] = el} />
            </div>
            <div className="dim-rationale">{d.rationale}</div>
            <div className="dim-footer">
              <span className={`confidence-badge confidence-${d.confidence}`}>
                {CONFIDENCE_LABELS[d.confidence]}
              </span>
              <span className="dim-assumptions">Assumes: {d.assumptions}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="rationale-block">
        <div className="result-label" style={{ marginBottom: 8 }}>Recommendation rationale</div>
        <p>{result.rationale}</p>
      </div>

      <ComparePanel
        currentResult={result}
        currentName={name}
        history={history || []}
        currentId={currentHistoryId}
      />

      <div className="result-actions">
        <button className="reset-btn" onClick={onReset}>← Score another use case</button>
        <button className="export-btn" onClick={() => window.print()}>Export / Print</button>
      </div>
    </div>
  )
}
