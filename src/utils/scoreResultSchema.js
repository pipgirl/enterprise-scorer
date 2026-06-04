import { z } from 'zod'

const dimensionSchema = z.object({
  name: z.string().min(1),
  score: z.number().min(0).max(25),
  rationale: z.string().min(1),
  confidence: z.enum(['high', 'medium', 'low']),
  assumptions: z.string().min(1)
})

export const scoreResultSchema = z.object({
  overall: z.number().min(0).max(100),
  verdict: z.enum(['pursue', 'derisk', 'notready']),
  dimensions: z.array(dimensionSchema).length(4),
  rationale: z.string().min(1)
})

function stripMarkdownCodeFences(text) {
  return text.replace(/```(?:json)?/gi, '').trim()
}

function extractFirstJsonObject(text) {
  let start = -1
  let depth = 0
  let inString = false
  let escaped = false

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i]

    if (inString) {
      if (escaped) {
        escaped = false
      } else if (ch === '\\') {
        escaped = true
      } else if (ch === '"') {
        inString = false
      }
      continue
    }

    if (ch === '"') {
      inString = true
      continue
    }

    if (ch === '{') {
      if (start === -1) start = i
      depth += 1
      continue
    }

    if (ch === '}') {
      if (depth > 0) depth -= 1
      if (start !== -1 && depth === 0) {
        return text.slice(start, i + 1)
      }
    }
  }

  throw new Error('Model did not return a valid JSON object.')
}

export function parseAndValidateScoreResult(rawText) {
  if (!rawText || !rawText.trim()) {
    throw new Error('Model returned an empty response. Please retry.')
  }

  const cleaned = stripMarkdownCodeFences(rawText)
  const jsonCandidate = extractFirstJsonObject(cleaned)

  let parsed
  try {
    parsed = JSON.parse(jsonCandidate)
  } catch {
    throw new Error('Model response was not valid JSON. Please retry.')
  }

  const validated = scoreResultSchema.safeParse(parsed)
  if (!validated.success) {
    const issue = validated.error.issues[0]
    const path = issue.path.length ? issue.path.join('.') : 'result'
    throw new Error(`Model response format is invalid at ${path}: ${issue.message}`)
  }

  return validated.data
}
