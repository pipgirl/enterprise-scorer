/**
 * Lightweight client-side telemetry.
 *
 * In development, events are logged to the console.
 * To plug in a real provider (PostHog, Mixpanel, Amplitude, etc.),
 * replace the body of `sendEvent` — the call sites stay the same.
 */

const IS_DEV = import.meta.env.DEV

function sendEvent(name, properties = {}) {
  const event = {
    event: name,
    timestamp: new Date().toISOString(),
    ...properties
  }

  if (IS_DEV) {
    console.debug('[analytics]', event)
  }

  // TODO: swap in your provider here, e.g.:
  // posthog.capture(name, properties)
  // mixpanel.track(name, properties)
}

export const analytics = {
  scoreStarted({ industry, approach }) {
    sendEvent('score_started', { industry, approach })
  },

  scoreCompleted({ overall, verdict, durationMs }) {
    sendEvent('score_completed', { overall, verdict, durationMs })
  },

  scoreFailed({ reason, durationMs }) {
    sendEvent('score_failed', { reason, durationMs })
  },

  exportClicked({ overall, verdict }) {
    sendEvent('export_clicked', { overall, verdict })
  },

  historyEntrySelected({ verdict, overall }) {
    sendEvent('history_entry_selected', { verdict, overall })
  },

  comparisonSelected({ overallDelta }) {
    sendEvent('comparison_selected', { overallDelta })
  }
}
