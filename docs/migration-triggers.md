# Migration Triggers Checklist

Use this checklist before deciding on a framework migration (for example, Qwik -> SvelteKit).

## Trigger Conditions

Mark a trigger as active if it is true for at least 2-4 weeks.

- [ ] Delivery speed is consistently slowed by framework/tooling friction.
- [ ] A required feature depends on ecosystem tooling not practical in current stack.
- [ ] Significant maintenance burden from custom workarounds accumulates.
- [ ] Core Web Vitals or SEO outcomes cannot meet targets after reasonable optimization.
- [ ] Hiring/collaboration needs require stronger alignment with another ecosystem.
- [ ] Hosting/runtime constraints conflict with current framework patterns.

## Migration Decision Rule

Plan a migration only when:

1. At least two trigger conditions are active.
2. A migration spike (time-boxed prototype) shows clear net benefit.
3. Rollback and content continuity plans are documented.

## Required Artifacts Before Migration

- New ADR that supersedes `ADR 0001`
- Target architecture doc
- Cutover plan with checkpoints
- Baseline vs candidate comparison (performance, DX, ops, SEO)
