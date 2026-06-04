# Enterprise AI Readiness Scorer

A tool for AI and innovation managers to evaluate enterprise AI use cases before committing resources. Describe a use case, get a structured scorecard with actionable recommendations — in under 10 minutes.

**Live scoring powered by the Claude API (claude-sonnet-4-6).**

---

## What it does

Scores any enterprise AI use case across four dimensions (0–25 each, 100 total):

| Dimension | What it evaluates |
|---|---|
| **Data readiness** | Quality, availability, labeling, ground truth reliability |
| **Process maturity** | How well-defined and stable the underlying business process is |
| **Business value** | Clarity of ROI, executive sponsorship, measurable outcomes |
| **Technical feasibility** | Appropriateness of AI approach, infrastructure, integration complexity |

Each dimension includes:
- A numeric score and rationale
- A **confidence level** (high / medium / low) based on the information provided
- The **assumptions** Claude made to arrive at the score — so users can spot gaps

The overall result returns one of three verdicts: **Pursue**, **De-risk first**, or **Not ready**.

---

## Features

- **Scoring** — Structured Claude API prompt with Zod schema validation on the response
- **Assessment history** — Past assessments saved to localStorage; reload any prior result in one click
- **Progress tracking** — Re-score the same use case over time and compare dimension deltas
- **Export** — Print-friendly PDF export via browser print dialog
- **Error handling** — Structured error responses from the proxy, client-side timeout, and user-friendly retry flow
- **Telemetry hooks** — Lightweight client-side event tracking (console in dev; swap in any provider)

---

## Setup

```bash
npm install
```

Create a `.env` file in the project root:

```
ANTHROPIC_API_KEY=your_key_here
```

Get a key at: https://console.anthropic.com

---

## Run

```bash
npm run dev
```

Starts both servers concurrently:
- React frontend → http://localhost:5173
- Express proxy → http://localhost:3001

---

## Architecture

```
Browser (React/Vite :5173) → Express proxy (:3001) → Anthropic API
```

The Express proxy keeps the API key server-side and handles timeout and structured error responses. The frontend validates all model output against a Zod schema before rendering.

---

## Tech stack

- **Frontend** — React 18, Vite
- **Backend** — Node.js, Express
- **AI** — Anthropic Claude API (claude-sonnet-4-6)
- **Validation** — Zod
- **Styling** — Plain CSS with CSS custom properties
