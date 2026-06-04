import { clearHistory } from '../utils/history'
import './HistoryPanel.css'

const VERDICT_LABELS = { pursue: 'Pursue', derisk: 'De-risk first', notready: 'Not ready' }

function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function HistoryPanel({ history, onSelect, onClear }) {
  if (!history || history.length === 0) return null

  function handleClear() {
    clearHistory()
    onClear()
  }

  return (
    <div className="history-panel">
      <div className="history-header">
        <span className="history-label">Past assessments</span>
        <button className="history-clear-btn" onClick={handleClear}>Clear</button>
      </div>
      <div className="history-list">
        {history.map(entry => (
          <button key={entry.id} className="history-entry" onClick={() => onSelect(entry)}>
            <div className="history-entry-top">
              <span className="history-entry-name">{entry.name}</span>
              <span className={`history-verdict-badge ${entry.result.verdict}`}>
                {VERDICT_LABELS[entry.result.verdict]}
              </span>
            </div>
            <div className="history-entry-bottom">
              <span className="history-score">{entry.result.overall} / 100</span>
              <span className="history-date">{formatDate(entry.scoredAt)}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
