const STORAGE_KEY = 'enterprise_scorer_history'
const MAX_ENTRIES = 20

export function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveAssessment(name, result) {
  const entry = {
    id: Date.now().toString(),
    scoredAt: new Date().toISOString(),
    name,
    result
  }
  const existing = loadHistory()
  const updated = [entry, ...existing].slice(0, MAX_ENTRIES)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  return updated
}

export function clearHistory() {
  localStorage.removeItem(STORAGE_KEY)
  return []
}
