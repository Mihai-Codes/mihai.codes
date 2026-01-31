# mihai.codes Tech Stack

## Core Framework: Qwik + Qwik City

- **Version**: ^1.12.0
- **Resumability**: No hydration delay, instant interactivity
- **Instant Loading**: Sub-second page loads, minimal JS bundle (<1KB initial)
- **0ms Hydration**: Immediate TTI, no layout shifts

## Styling: Tailwind CSS

- **Version**: ^3.4.6
- Modal.com-inspired dark mode aesthetic
- High contrast elements, vibrant accents
- Typography: JetBrains Mono (code), Inter (UI)

## CMS: Sanity (Headless)

- **Client Version**: ^7.14.0
- Real-time content updates
- GROQ query language
- Structured content with TypeScript types

## Hosting: Cloudflare Pages

- 200+ edge locations globally
- Automatic SSL, DDoS protection
- Git-integrated deployments
- Wrangler CLI (^4.57.0) for local dev and deploys

## CI/CD: GitHub Actions

- Automated lint, typecheck, test, build
- Branch protection with required CI
- Codecov integration

## Testing

- **Vitest**: ^4.0.16 (test runner)
- **Testing Library DOM**: ^10.4.1
- **jsdom**: ^27.4.0 (browser environment)
- **Coverage**: @vitest/coverage-v8

## Language: TypeScript

- **Version**: ^5.5.3
- Full type safety across frontend and Sanity schemas
- Strict mode enabled

## Build Tools

- **Vite**: ^5.3.4
- **PostCSS**: ^8.4.39
- **Autoprefixer**: ^10.4.19

## Linting

- **ESLint**: ^9.39.2
- **TypeScript ESLint**: ^8.52.0
- **Qwik ESLint Plugin**: ^1.18.0

## Other Dependencies

- **@vectorize-io/hindsight-client**: ^0.3.0 (memory sync)
