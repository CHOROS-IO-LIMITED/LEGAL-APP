# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack

**Laravel 12 + Inertia.js + React 19 + TypeScript + Tailwind CSS v4**

- PHP backend with PostgreSQL (SQLite for tests)
- React frontend rendered via Inertia.js (no separate API layer)
- Vite 6 for asset bundling
- shadcn/ui component library (Radix UI)
- Redis for caching/sessions/queues
- Stripe for payments, DomPDF/PHPWord for document generation
- Google OAuth via Laravel Socialite

## Commands

### Full dev environment (recommended)
```bash
composer run dev        # Starts PHP server + queue worker + Vite concurrently
```

### Individual processes
```bash
php artisan serve       # PHP development server
npm run dev             # Vite dev server only
php artisan queue:listen
php artisan pail --timeout=0   # Stream logs
```

### Frontend
```bash
npm run build           # Production build
npm run lint            # ESLint with auto-fix
npm run format          # Prettier formatting
npm run format:check    # Check formatting without writing
npm run types           # TypeScript type check
```

### Backend
```bash
php artisan migrate
php artisan key:generate
```

### Testing
```bash
php artisan test                        # Run all tests
php artisan test --filter=TestName      # Run a single test
php artisan test tests/Feature/         # Run feature tests only
```
PHPUnit config: `phpunit.xml`. Tests use SQLite in-memory database.

## Architecture

### Request flow
Browser → Laravel router → Inertia middleware → Controller → returns `Inertia::render('PageName', $props)` → React page component receives props as typed TypeScript.

There is no REST API for the frontend. All data flows through Inertia shared props and page props.

### Route organization
`routes/` is split into sub-files included from `web.php`:
- `routes/Web/` — public pages (products, blogs, contact, legal)
- `routes/User/` — authenticated user area
- `routes/Admin/` — admin-only area

### Frontend structure
```
resources/js/
├── pages/          # Inertia page components (map 1:1 to routes)
├── components/     # Shared/reusable React components
├── layouts/        # Layout wrappers (AdminLayout, UserLayout, etc.)
├── hooks/          # Custom React hooks
├── lib/            # Utility functions
└── types/          # TypeScript type definitions
```

Page components in `resources/js/pages/` receive Laravel data directly as props. No Redux/Zustand — state lives in Inertia page props and local React state.

### Styling conventions
- Tailwind CSS v4 — configured via `resources/css/app.css` (not `tailwind.config.js`)
- Custom OKLCH color theme: cream backgrounds, espresso text, caramel accents
- Custom fonts: Neue Montreal (body), Aristiq Signature (decorative)
- Dark mode is disabled (`className="light"` forced on root in `app.tsx`)
- shadcn/ui components live in `resources/js/components/ui/`

### Code style
- Prettier: single quotes, 150-char line width, 4-space tab width (see `.prettierrc`)
- ESLint strict TypeScript rules — run `npm run lint` before committing frontend changes
- Imports organized by prettier-plugin-organize-imports automatically on format

### Authentication
Two roles: Admin and User. Middleware separates the two. Google OAuth is configured via Socialite. Session-based auth (not JWT/Sanctum tokens).

### Models
Core models: `User`, `Blog`, `Document`, `UserDocument`. All in `app/Models/`.

### Services / Actions
Business logic lives in `app/Services/`. One-off operations use `app/Actions/`. Keep controllers thin.
