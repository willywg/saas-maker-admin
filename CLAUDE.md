# Admin Panel

## Overview

Admin panel for the SaaS platform. Manages organizations and users across the system.

## Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS 4 + Shadcn/ui (gray palette)
- **State**: TanStack React Query
- **Routing**: React Router 8 (`react-router`)

## Project Structure

```
admin/
├── src/
│   ├── components/
│   │   ├── auth/         # Auth guards
│   │   ├── layout/       # AdminLayout, Sidebar, Header
│   │   ├── shared/       # Reusable components
│   │   └── ui/           # Shadcn/ui components
│   ├── hooks/            # React Query hooks
│   ├── lib/              # API client, utilities
│   ├── pages/            # Route pages
│   │   ├── organizations/
│   │   └── users/
│   ├── types/            # TypeScript types
│   ├── App.tsx
│   ├── router.tsx
│   └── main.tsx
```

## Commands

Requires Node 24 (see `.nvmrc`, `nvm use`).

```bash
# Development
npm run dev           # Starts on port 5191

# Build
npm run build

# Preview production build
npm run preview

# Type check
npm run typecheck

# Lint / tests
npm run lint
npm test

# Security audit / upgrade deps
npm run audit
npm run upgrade
```

## Authentication

- Admin JWT tokens stored in localStorage (`admin_token`)
- Separate from tenant user authentication
- API endpoints: `/admin/auth/*`, `/admin/organizations/*`, `/admin/users/*`

## Design

Follow `../DESIGN.md`. The admin uses the same tokens with a neutral (near-black) primary; do not apply the brand hue here.

## Color Palette

Gray/neutral palette using oklch() for Linear App style:
- Primary: oklch(0.205 0 0) - Almost black
- Background: oklch(0.985 0 0) - Almost white
- Success: oklch(0.65 0.15 145) - Green
- Warning: oklch(0.75 0.15 85) - Yellow
- Destructive: oklch(0.55 0.2 25) - Red

## Conventions

- All text in Spanish (es-ES locale)
- Soft delete pattern (is_active toggle)
- Pagination with 20 items per page
- Search with debounce on list pages

## API Base URL

Development: `http://localhost:8090`
Production: Configured via environment or nginx proxy
