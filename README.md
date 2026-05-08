# Enterprise AI Readiness Scorer

Scores enterprise AI use cases across four dimensions using the Claude API:
- Data readiness
- Process maturity
- Business value
- Technical feasibility

## Setup

```bash
npm install
```

Add your Anthropic API key to `.env`:
```
ANTHROPIC_API_KEY=your_key_here
```

Get a key at: https://console.anthropic.com

## Run

```bash
npm run dev
```

Opens at http://localhost:5173. Express proxy runs on port 3001.

## Architecture

```
Browser (React/Vite :5173) → Express proxy (:3001) → Anthropic API
```

The proxy keeps your API key server-side and avoids CORS issues.
