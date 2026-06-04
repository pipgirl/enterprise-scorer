# Enterprise Scorer Roadmap (2 Weeks)

## Product Direction
Build this into a trustworthy readiness scoring tool for AI/Innovation managers that provides:
- A consistent scorecard
- Benchmarks over time
- Clear action recommendations users can defend

## North Star Outcome
Users can evaluate a use case in under 10 minutes and leave with a score, confidence level, and top de-risking actions.

## Success Metrics (V1)
- >=70% of test users say scores are "useful for decision-making"
- Median time to complete an assessment: <10 minutes
- >=50% of users run more than one assessment in a session (benchmark behavior)
- Parse/error failure rate: <5%

## Scope for V1 (Must Ship)
1. Reliable scoring flow
- Harden API error handling and response parsing
- Show user-friendly failure states and retry options
- Add request timeout and structured fallback messaging

2. Trust and explainability layer
- Display confidence and assumptions per dimension
- Show why a verdict was selected in plain language
- Add "what to improve next" recommendations per low-scoring area

3. Benchmarking (single-user local)
- Save scored assessments locally (browser storage)
- Add comparison view for past assessments
- Show trend deltas by dimension (+/-)

4. Output quality
- Add export to PDF/print-friendly summary
- Include executive summary + numeric breakdown + next actions

## Nice-to-Have (If Time Allows)
- Simple calibration mode (user can adjust score weights)
- Industry-specific scoring hints
- Shareable link state (without backend persistence)

## De-scoped for this 2-week cycle
- Multi-user auth
- Team collaboration
- Database + cloud persistence
- Billing or SaaS packaging

## 2-Week Execution Plan
### Week 1: Trust + Stability
- Day 1: Error-handling refactor (frontend + proxy)
- Day 2: Robust parsing + schema validation for model output
- Day 3: Confidence + rationale UI improvements
- Day 4: Recommendation engine for de-risking actions
- Day 5: Internal QA pass and prompt tuning

### Week 2: Benchmarking + Packaging
- Day 6: Local assessment history storage
- Day 7: Comparison/trend view
- Day 8: Exportable report (print/PDF)
- Day 9: UX polish + accessibility pass
- Day 10: Demo script, README updates, release prep

## Immediate Backlog (Priority Order)
1. Proxy returns upstream status codes and structured errors
2. Validate model response JSON before rendering
3. Add confidence/assumptions fields to prompt and UI
4. Persist assessment history in localStorage
5. Build comparison panel (latest vs prior)
6. Add export report view
7. Add lightweight telemetry hooks (client-side events)

## Risks and Mitigations
- Model output variability:
  Mitigation: strict JSON schema + retry/parsing guardrails
- User trust in scoring:
  Mitigation: expose assumptions, confidence, and recommendation logic
- Timeline compression:
  Mitigation: lock scope to single-user, no backend persistence

## Decision Log
- Primary user: AI/Innovation managers
- Core value: scorecard + benchmark over time
- Timeline: 2 weeks
- Optimization: accuracy and trust first

## Next Planning Checkpoint
Review after Day 3 and decide whether to:
- Keep benchmarking in scope
- Swap PDF export for deeper scoring quality improvements
