# Repository Guidelines

## Project Structure & Module Organization
- `src/app/`: Next.js App Router pages and routes.
  - `page.tsx`, `layout.tsx`, feature pages under `gallery/`, `my/`.
  - API routes in `src/app/api/*/route.ts` (generation, gallery, status, etc.).
- `src/components/`: Reusable UI and feature components (e.g., `StylePicker`, `UploadDropzone`, `ui/*`).
- `src/lib/`: Firebase clients (`firebaseClient.ts`, `firebaseAdmin.ts`), storage/utils, styles.
- `src/types.ts`: Shared TypeScript types.
- Config: `next.config.js`, `tailwind.config.ts`, `postcss.config.js`, `tsconfig.json`.
- Firebase: `firebase.json`, `firestore.rules`, `storage.rules`, `firestore.indexes.json`.
- Docs: `README.md`, `DEVELOPMENT_PROCESS.md`, `docs/security-audit-checklist.md`.

## Build, Test, and Development Commands
- `npm run dev`: Start Next.js dev server.
- `npm run build`: Production build.
- `npm start`: Run the built app.
- `npm run lint`: ESLint for code quality.
- `npm run typecheck`: TypeScript type checking (no emit).

## Coding Style & Naming Conventions
- Language: TypeScript + React (functional components).
- Indentation: 2 spaces; prefer named exports.
- Components: `PascalCase` (e.g., `FramePreview.tsx`); hooks/utilities `camelCase`.
- Files: colocate styles and utils under feature folders when practical.
- Formatting/Linting: Next.js ESLint config + Tailwind; keep JSX minimal and typed (use `zod` where helpful).

## Testing Guidelines
- Framework: Not configured yet. Keep new logic unit-testable and pure.
- Add tests alongside files (e.g., `component.test.tsx`) if introducing complex logic.
- Manual checks: verify API routes, gallery views, and generation flow locally.

## Commit & Pull Request Guidelines
- Commits: Imperative, concise; emoji prefixes accepted (e.g., `🎨 UI:`, `🔒 SECURITY:`).
- Scope in subject, details in body when needed. Group related changes.
- PRs: include summary, rationale, linked issues, and screenshots/GIFs for UI (gallery, frames, modals).
- Checklist: `npm run lint` + `npm run typecheck` pass; ensure no `.env` diffs; update docs when behavior changes.

## Security & Configuration Tips
- Env: copy `.env.example` → `.env`. Never commit secrets. Client-safe keys use `NEXT_PUBLIC_`.
- Firebase: update `firestore.rules`/`storage.rules` and `firestore.indexes.json` with any schema changes.
- Headers and quotas: review `next.config.js` and API route limits before deploying.
