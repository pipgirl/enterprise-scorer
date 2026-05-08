import { useEffect, useRef } from 'react'
import './ScoreResult.css'

const LABELS = { pursue: 'Pursue', derisk: 'De-risk first', notready: 'Not ready' }

export default function ScoreResult({ result, name, onReset }) {
  const barsRef = useRef([])
  useEffect(() => {
    const t = setTimeout(() => {
      barsRef.current.forEach(b => { if (b) b.style.width = b.dataset.pct + '%' })
    }, 100)
    return () => clearTimeout(t)
  }, [result])

  return (
    <div className="result">
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
          </div>
        ))}
      </div>

      <div className="rationale-block">
        <div className="result-label" style={{ marginBottom: 8 }}>Recommendation rationale</div>
        <p>{result.rationale}</p>
      </div>

      <button className="reset-btn" onClick={onReset}>← Score another use case</button>
    </div>
  )
}
