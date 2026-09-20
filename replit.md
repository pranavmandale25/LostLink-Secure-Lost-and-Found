# LostLink

LostLink helps campus communities report lost and found items, surface potential matches, verify ownership privately, and complete safer handovers.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/lostlink/src/pages/lostlink-pages.tsx` — product routes and user flows
- `artifacts/lostlink/src/components/lostlink-ui.tsx` — shared shell, form, status, and trust components
- `artifacts/lostlink/src/index.css` — LostLink visual system and responsive styling
- `artifacts/api-server/src/routes/lostlink.ts` — MVP REST API, deterministic matching, seeded demo data, and verification logic
- `lib/api-spec/openapi.yaml` — source of truth for generated API hooks and schemas

## Architecture decisions

- OpenAPI is the contract for the LostLink API; frontend requests use generated React Query hooks.
- The hackathon MVP uses an in-memory seeded service so the demo works without external AI or database setup.
- Public item and match DTOs strip private ownership clues; verification compares submitted evidence only on the server.
- Matching is deterministic and explainable, combining category, brand, color, location, and description signals.

## Product

- Public landing page with the FIND → MATCH → VERIFY → RETURN message
- Dashboard, lost/found reporting, image upload, deterministic potential matching, claims, private verification, safe handover, and moderation metrics
- Seeded Lenovo laptop, wallet, and AirPods scenarios, including failed verification, passed verification, and resolved items

## User preferences

- Keep the product calm, trustworthy, mobile-first, and explicit about the difference between identity verification and ownership verification.

## Gotchas

- The MVP data resets when the API workflow restarts; use the seeded demo records for repeatable walkthroughs.
- Never return private clues, serial numbers, IMEI values, or device access details from public item or match responses.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
