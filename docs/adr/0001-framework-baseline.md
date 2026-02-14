# ADR 0001: Framework Baseline for v1

- Status: Accepted
- Date: 2026-02-15
- Decision Makers: Project owner

## Context

The site is a personal brand and blog deployed on Cloudflare Pages. Priorities are:

- low operational overhead for a solo maintainer
- good page performance and SEO for content pages
- predictable deployment workflow
- ability to evolve toward future frameworks if the product scope changes

## Decision

Use Qwik + Qwik City as the v1 baseline architecture for the site and blog.

## Alternatives Considered

- Keep Qwik for site and add Svelte in a hybrid setup
- Full migration to SvelteKit now

## Rationale

- Current production setup already works and is stable.
- Hybrid multi-framework setup adds complexity that is not justified for current scope.
- Full migration now would increase migration cost and risk without clear user-facing ROI.
- Keeping a clear v1 baseline enables measured re-evaluation later.

## Consequences

- Positive:
  - Lower maintenance overhead in the short term.
  - Cleaner decision history for future migration planning.
  - Easier rollback and release tracking with tags.
- Negative:
  - Delays adoption of Svelte-specific ecosystem benefits.
  - Requires periodic checkpoints to avoid framework stagnation.

## Revisit Triggers

See `docs/migration-triggers.md`.
