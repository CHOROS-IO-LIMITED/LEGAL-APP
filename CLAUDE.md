# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Working agreements

- **Do not use Artifacts.** Never publish work to an Artifact (claude.ai hosted page). Deliver everything as files in this repo plus terminal output - reports, plans, summaries and reviews included.

## Stack

**Laravel 12 (PHP 8.2+) + Inertia.js 2 + React 19 + TypeScript + Tailwind CSS v4**

- PostgreSQL in dev/prod, SQLite in-memory for tests
- Vite 6 bundling, shadcn/ui (Radix) components, Ziggy for route names in JS
- Redis (predis) for cache/session/queue
- Third-party: Stripe (payments), ComplyCube (KYC), DocuSign (e-signature), Google Gemini (AI), Google OAuth via Socialite
- PDF generation via DomPDF (`barryvdh/laravel-dompdf`) from Blade views

## Commands

```bash
composer run dev        # PHP server + queue worker + Vite (does NOT start pail)
composer run dev:ssr    # Same + SSR server; SSR is disabled in config/inertia.php by default

php artisan serve
npm run dev
php artisan queue:listen
php artisan pail --timeout=0   # Stream logs (run separately)

npm run build           # Production build
npm run lint            # ESLint with --fix
npm run format          # Prettier write over resources/
npm run types           # tsc --noEmit
vendor/bin/pint         # PHP formatting (Laravel preset, no pint.json)

php artisan migrate
php artisan db:seed     # AdminSeeder, UserSeeder, DocumentSeeder, BlogsSeeder

php artisan test
php artisan test --filter=TestName
php artisan test tests/Feature/
```

### Test suite state

Tests are PHPUnit 11 class-style (`phpunit.xml`, SQLite `:memory:`). **The existing suite is stale starter-kit
leftovers — 21 of 26 tests fail on a clean checkout** because this app renamed the scaffolded auth/settings routes
(`login` → `auth.login`, no password-reset routes, etc.). Do not treat a red suite as a regression you caused;
check whether the failing test predates your change.

`tests/Pest.php` exists but Pest is **not** installed — ignore it and write PHPUnit classes extending `Tests\TestCase`.

`.env.example` was deleted from the repo. Required config keys are discoverable in `config/services.php`
(Google, Gemini, Stripe, DocuSign) plus `COMPLYCUBE_API_KEY`, which is read via `env()` directly in `KYCController`.

## Architecture

### Request flow
Browser → router → `HandleInertiaRequests` → controller → `Inertia::render('Path/To/Page', $props)` → React page.
No REST API for the frontend; all data arrives as page props or shared props.

`resources/views/app.blade.php` does `@vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])`,
so **every Inertia component name must resolve to a real file under `resources/js/pages/`** — a typo in the render
string is a Vite build error, not just a 404.

Shared props (`HandleInertiaRequests::share`): `auth.user` (id/name/email/role), `flash.{success,error,info}`,
`ziggy`, `name`, `quote`.

### Route organization
`routes/web.php` requires sub-files under `routes/Admin/`, `routes/User/`, `routes/Web/`.
Name prefixes: `admin.*` (admin area), `user.*` (user dashboard), unprefixed for public/funnel routes.
Webhooks live in `routes/Web/api.php` and are CSRF-exempt via `bootstrap/app.php`
(`webhook/complycube`, `webhook/stripe`); the DocuSign Connect webhook exempts itself inline in `routes/Admin/admin-dashboard.php`.

### Roles and authorization
Role is a plain `user_role` string column on `users` (`'admin'` / `'user'`) — no packages, no enum.
`AdminMiddleware` / `UserMiddleware` / `GuestMiddleware` gate route groups; `UserDocumentPolicy` and
`DocumentPolicy` gate per-record actions. The policy methods encode *state-machine* permissions
(`answerQuestions`, `submitForApproval`, `approveForSignature`, `sign`, …) and delegate to the
`canBe*()` predicates on `UserDocument`. When adding a lifecycle action, add both the `canBeX()` predicate
on the model and the matching policy method.

## The core domain: UserDocument lifecycle

This is the heart of the app. A `Document` is an admin-authored product/template. A `UserDocument` is one
customer's instance of it. Related `UserDocument` rows are grouped by `batch_uuid` (a user selects several
products at once and moves them through the funnel together — most funnel controllers look up records by
`?batch_uuid=`, not by id).

Status constants on `UserDocument`, in funnel order:

```
selected → kyc_pending → kyc_completed → checkout_pending → checkout_completed
  → verification_pending → verification_completed → qna_pending → qna_completed
  → pdf_generated → pending_approval → signature → completed
                                     ↘ rejected (back to user) ↗
```

`dashboard_status` is a computed accessor collapsing those into five user-facing buckets
(`draft`, `pending_approval`, `signature`, `rejected`, `completed`); `scopeForDashboard` /
`scopeForAdminDashboard` filter to what each dashboard shows.

The funnel maps 1:1 onto `routes/Web/products.php` steps:

1. **Selection** — `CreateUserDocumentSelectionAction` creates one `UserDocument` per chosen product with a shared `batch_uuid`
2. **KYC** — `KYCController` → ComplyCube hosted flow; `webhook/complycube` reports back
3. **Checkout** — `PaymentController` → Stripe PaymentIntents; `webhook/stripe` confirms
4. **Verification** — `EmailVerificationController::continue` also seeds the question schema and flips status to `qna_pending`
5. **Q&A** — `QuestionController` renders the schema, validates answers, generates the PDF
6. **Review/sign** — user submits for approval → admin approves → DocuSign envelope → signed PDF stored back

### Schema-driven documents

Question schemas are **PHP-defined, versioned, and snapshotted twice**:

```
LoanAgreementQuestionSchema::make()          app/Support/Documents/LoanAgreement/ — steps/questions/follow_ups, has a `version`
  → DocumentSchemaRegistry::questionSchemaByType()   match on Document.document_type (DocumentType enum)
  → SyncDocumentSchemasAction                 validates (QuestionSchemaValidator), snapshots into
                                              documents.default_question_schema_json (on admin create/update)
  → GenerateUserDocumentQuestionSchemaAction  copies into user_documents.question_schema_json (per-customer snapshot)
  → React QnA page renders steps
  → UserDocumentAnswersValidation             validates only *visible* questions against the stored snapshot
  → user_documents.answers_json
  → LoanAgreementAnswerMapper                 answers → view data
  → resources/views/pdf/loan-agreement/       Blade clause partials → DomPDF → storage
```

Because the schema is snapshotted onto each `UserDocument`, editing `LoanAgreementQuestionSchema` does **not**
retroactively change in-flight documents. Bump its `version` and re-sync the `Document` to roll out changes.

Conditional questions use `follow_ups` with a `when` clause; visibility is resolved server-side in
`QuestionAnswerRulesBuilder::getVisibleQuestions()` and `UserDocumentAnswersValidation` — keep the React
conditional rendering in sync with those, or users will be blocked by validation on hidden fields.

**Only `loan_agreement` is fully implemented.** `DocumentType::NDA` exists but `DocumentSchemaRegistry` returns
`null` for it and `GenerateUserDocumentPdfAction` throws on unknown types. Adding a document type means touching:
`DocumentType` enum → a `App\Support\Documents\<Type>\` schema + answer mapper → `DocumentSchemaRegistry` →
`GenerateUserDocumentPdfAction` → a Blade template tree under `resources/views/pdf/`.

### AI (Gemini)

`app/Services/Ai/` holds a hand-rolled Gemini HTTP client (no SDK): `GeminiAnswerNormalizer` (cleans up free-text
answers), `GeminiLegalDocumentComposer`, `GeminiFileUploader`, `LoanAgreementChatService` (the in-form assistant at
`POST /ai/loan-agreement/chat/{userDocument}`). Config in `config/services.php` under `gemini`.

Note: **answer normalization is currently disabled** — the binding in `AppServiceProvider` is commented out and
`QuestionController::update` has a commented-out normalizing version above the live one. Both are intentional
fallbacks, not dead code to delete; if re-enabling, restore the binding and swap the method body.

### Controllers / Actions / Services
Controllers stay thin. `app/Actions/` mirrors the route areas (`Admin/`, `User/`) and holds single-purpose
`handle()` classes; `app/Services/` holds stateful/third-party integrations; `app/Support/` holds pure
document-domain logic (schemas, mappers). Form Requests validate, policies authorize.

## Frontend conventions

- Page components are nested to match routes (`pages/Web/Products/Explore/QnA/Index.tsx`). Section components
  (`HomeHero`, `BlogArticles`, …) also live under `pages/` beside the page that uses them; only genuinely shared
  components go in `components/`.
- Layouts: `layouts/admin-layout.tsx`, `layouts/user-layout.tsx`. Public pages use `components/web/Header|Footer`.
- No Redux/Zustand — state is Inertia page props + local React state. `react-hot-toast` for notifications,
  `framer-motion` for animation, `recharts` for admin charts.
- Types live in `resources/js/types/`; `@/` aliases `resources/js/`.

### Styling — read this before touching colors

`resources/css/app.css` still contains the **default shadcn neutral** OKLCH variable set. The brand palette
documented in `THEME.md` (cream `#FCF9F2`, espresso `#3D2B1F`, caramel `#A68A64`, latte `#E8E2D6`, deep bean
`#1A1614`) is **not** wired into those variables — it is applied as hard-coded Tailwind arbitrary values
(`bg-[#FCF9F2]`, `text-[#3D2B1F]`) in ~700 places across `resources/js/`. Match the surrounding file's hex usage
rather than reaching for `bg-background` / `text-primary`, which will render as neutral gray.

Fonts: `Neue Montreal` (body, `@font-face` in `app.css` from `/fonts/`) and `Aristiq Signature` (decorative).
Instrument Sans is still linked in `app.blade.php` but is overridden.

Dark mode is deliberately off: `app.tsx` strips the `dark` class from `<html>` and the `initializeTheme()` call is
commented out. `.dark` variables still exist in `app.css` — don't rely on them.

### Code style
Prettier: single quotes, 150-char width, 4-space tabs (`.prettierrc`), with `prettier-plugin-organize-imports`
and `prettier-plugin-tailwindcss`. ESLint uses typescript-eslint + react-hooks. Run `npm run lint` and
`npm run types` before committing frontend changes; `vendor/bin/pint` for PHP.

## Known rough edges

- A debug route `GET /debug-docusign/{id}` with no auth middleware sits in `routes/Admin/admin-dashboard.php`.
- `app/Services/ComplyCubeService.php` is an empty file; KYC logic lives inline in `KYCController`.
- `*-Backup.tsx` page files (`Login-Backup`, `Register-Backup`, `KYC/Index-Backup`) are stale copies, not routed.
