# AGENTS.md

Guidance for AI coding agents working in this repository.

## What this project is

An **agentic law firm**: a platform where AI agents take over as much of the
lawyer process as possible. A client (a commercial firm, or an in-house legal
team with no time) submits something to be **reviewed** or **drafted**. The
system does as much of the work as possible with AI, and only escalates to a
human lawyer for review when genuinely needed.

The core product loop:

1. **Intake** — a client describes what they need (e.g. "review this NDA",
   "draft a consultancy agreement") and uploads any documents.
2. **AI processing** — agents classify the matter, do the review/drafting
   work, flag risks, and produce a work product with a confidence assessment.
3. **Escalation when needed** — low-confidence, high-risk, or
   regulated-judgement items are routed to a human lawyer for review/sign-off.
   Everything else flows through without human touch.
4. **Delivery** — the client gets the reviewed/drafted document plus a clear
   summary of what was changed/flagged and why.

Design principle: **maximise AI autonomy, minimise lawyer time**. The human
lawyer is a quality gate, not the default path. Every feature should be judged
by how much lawyer time it removes while keeping output trustworthy.

Domain language to use consistently in code and schema:

- **Matter** — a unit of client work (one review or drafting request).
- **Client** — the organisation/person requesting work.
- **Lawyer** — a human reviewer who handles escalations.
- **Review / Draft** — the two primary matter types.
- **Escalation** — a matter (or part of one) routed to a lawyer.

## Stack

- **Framework**: TanStack Start (React 19, file-based routing, SSR via Nitro)
- **Backend/data**: Convex (schema in `convex/schema.ts`, functions in `convex/`)
- **Auth**: Clerk (`@clerk/clerk-react`, wired in `src/integrations/clerk/`)
- **Data fetching**: TanStack Query + `@convex-dev/react-query`
- **Styling**: Tailwind CSS v4, shadcn-style components in `src/components/ui/`
  (Radix primitives, `class-variance-authority`, `cn()` from `src/lib/utils.ts`)
- **Forms/validation**: TanStack Form + Zod
- **Lint/format**: Biome (not ESLint/Prettier) — config in `biome.json`
- **Tests**: Vitest + Testing Library (jsdom)
- **Component dev**: Storybook (`src/components/storybook/`)
- **Monitoring**: Sentry (`instrument.server.mjs`)
- **Package manager**: pnpm

## Commands

```sh
pnpm dev            # dev server on :3000 (loads .env.local)
pnpm test           # vitest run
pnpm check          # biome check (lint + format)
pnpm format:write   # biome check --write . (auto-fix)
pnpm build          # production build
pnpm generate-routes # regenerate route tree (tsr generate)
pnpm storybook      # storybook on :6006
```

Run `pnpm check` and `pnpm test` before considering a change done.

## Layout

```
convex/                 # Convex schema + server functions (queries/mutations)
src/routes/             # file-based routes (TanStack Router)
src/components/ui/      # shadcn-style primitives — keep generic, no domain logic
src/components/         # app components (shell, sidebar, etc.)
src/integrations/       # clerk / convex / tanstack-query providers
src/lib/                # shared utils
src/routeTree.gen.ts    # GENERATED — never edit by hand
convex/_generated/      # GENERATED — never edit by hand
```

## Conventions

- Import app code via the `#/*` alias (maps to `./src/*`), e.g.
  `import { cn } from '#/lib/utils'`.
- New pages: add a file under `src/routes/`; the route tree regenerates via
  the router plugin in dev (or `pnpm generate-routes`).
- New data: define tables in `convex/schema.ts` with explicit indexes
  (`by_*` naming, e.g. `by_clerk_id`), and put queries/mutations in a
  per-domain file in `convex/` (`users.ts`, `todos.ts` pattern).
- Convex function args are validated with `v` from `convex/values`; client
  input forms are validated with Zod. Validate at both layers.
- UI primitives follow the shadcn pattern: variants via
  `class-variance-authority`, class merging via `cn()`. Add new primitives to
  `src/components/ui/`; add a Storybook story when building reusable
  components.
- Auth state comes from Clerk; the Convex `users` table mirrors Clerk users
  via `clerkId`. Don't invent a parallel user store.
- Biome enforces single quotes and its default rules — run `pnpm format:write`
  rather than hand-formatting.

## Product guardrails

These matter because the domain is legal work:

- **Never present AI output as reviewed by a lawyer unless it actually was.**
  Work-product state (AI-only vs lawyer-reviewed) must be explicit in the data
  model and the UI.
- **Escalation logic should be conservative by default** — when confidence is
  low or stakes are high, route to a human. It's a product failure to silently
  ship a bad contract; it's only an efficiency loss to over-escalate.
- **Auditability**: every matter should keep a traceable history of what the
  AI did, what was flagged, and who approved what. Prefer append-only/event
  patterns over destructive updates for matter state.
- **Confidentiality**: client documents are sensitive. Don't log document
  contents, don't send them to third-party services beyond the configured
  AI/storage providers, and scope all Convex queries by the authenticated
  user's organisation.

## Current state

Early scaffold: app shell, Clerk + Convex wiring, and placeholder tables
(`users`, `lawyers`, `todos`). The `todos` table is scaffolding from the
template, not product. The matter/intake/escalation domain model is still to
be built — when adding it, follow the domain language above.
