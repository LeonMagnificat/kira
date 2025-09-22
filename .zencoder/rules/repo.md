# Repository Overview

- Name: Kira Clinic Dashboard
- Tech Stack: React, TypeScript, React Router (SSR enabled), Vite, Tailwind-like utility classes, custom theming via CSS variables (var(--color-*)).
- Entry points: App routes under `app/routes`, shared components under `app/components`, constants under `app/constants`, mock data under `app/data`, utilities under `app/utils`.
- Routing: Files in `app/routes` correspond to routes (e.g., `app/routes/admin/*`). `admin-layout.tsx` provides layout with sidebar and mobile nav, passing `isSidebarMinimized` via Outlet context.
- State & Data: Primarily local component state with mock data sources. Local persistence helper exists in `app/utils/localCrud.ts` to store entities in localStorage with SSR safety.
- UI Components: Shared UI in `app/components/ui` (Button, Card, Input, Select, Tabs, Modal, ConfirmDialog). Additional app-specific modals exist (e.g., invoices, groups).
- Theming: Uses CSS variables for color tokens (foreground, surface, primary, etc.) and utility classes for layout/spacing.

## Key Paths
- `app/routes/admin/` — Admin pages (employees, patients-admin, billing, messages, settings, etc.)
- `app/components/` — Shared top-level components (Header, NavItems, MobileNav, etc.)
- `app/components/ui/` — Reusable primitives (Modal, Button, Input, etc.)
- `app/utils/localCrud.ts` — Helpers to persist lists to localStorage with SSR checks
- `app/data/` — Mock data and helper calculators for views

## Known Gaps / Targets for Improvement
- Profile dropdown in `Header.tsx` is a placeholder; implement actionable dropdown.
- Settings context mismatch (`isMinimized` vs `isSidebarMinimized`).
- Many admin lists (Employees, Messages groups, Patients Admin) rely on mock data only; wire to `localStorage` for persistence.
- CRUD flows to use a consistent Dialog design for create/edit/delete operations.

## Conventions
- Use `~/*` alias for `app/*` per tsconfig paths.
- Keep SSR safety (check `typeof window !== 'undefined'`) when touching browser-only APIs.
- Prefer reusable primitives from `app/components/ui` and export in `app/components/index.ts` for easy imports.