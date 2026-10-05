# Pathwise & Free Advice Platform (Merged Fullstack Project)

This repository contains the merged frontend and backend for the advice and guidance platform:
- **Frontend**: Next.js 14 (App Router) + React 18 + TypeScript + Tailwind CSS (in the root directory).
- **Backend**: PHP + MySQL application with user management, categories, questions, answers, replies, likes, notifications, reports, and admin dashboard (in [`backend/`](file:///Users/harshpatel/Downloads/WP%20IE%20Project/backend)).

---

## Quick Start & Running the Project

### 1. Install Dependencies
```bash
npm install
```

### 2. Available Run Commands

| Command | Description | URL |
|---|---|---|
| `npm run dev` | Runs the Next.js frontend dev server | [http://localhost:3000](http://localhost:3000) |
| `npm run dev:frontend` | Runs the Next.js frontend dev server | [http://localhost:3000](http://localhost:3000) |
| `npm run dev:backend` | Runs the PHP backend built-in server | [http://localhost:8000](http://localhost:8000) |
| `npm run dev:all` | Runs **both** PHP backend & Next.js frontend concurrently | Port 8000 + Port 3000 |
| `npm run build` | Builds the Next.js production bundle | - |
| `npm run start` | Starts the Next.js production server | [http://localhost:3000](http://localhost:3000) |

> **Note on Backend Proxy**: `next.config.js` is pre-configured with a rewrite rule (`/backend-api/:path*` -> `http://127.0.0.1:8000/:path*`) so the frontend can transparently proxy requests to the PHP backend without CORS issues.

---

## Route list
| Route | Description |
|---|---|
| `/` | Landing page: hero, categories, featured advice/experts, articles |
| `/categories` | Category discovery + search |
| `/categories/[slug]` | Category detail: advice, experts, articles |
| `/ask` | Multi-field advice request form → generates mock advice |
| `/advice/[id]` | Advice result page (works for stock advice AND user-submitted questions) |
| `/search` | Cross-entity search (advice, experts, articles, categories) with filters + recent searches |
| `/experts` | Expert discovery with search/filter/sort |
| `/experts/[id]` | Expert profile + booking modal (date/time/type → confirmation) |
| `/blog` | Blog index with search/filter |
| `/blog/[slug]` | Article reader with save/share |
| `/how-it-works`, `/about`, `/contact`, `/faq` | Marketing/support pages |
| `/login`, `/signup`, `/forgot-password` | Mock auth UI |
| `/dashboard` | Overview: stats, recent questions/saved, upcoming consultation |
| `/dashboard/questions` | List of user's submitted questions |
| `/dashboard/saved` | Saved advice/articles, with search + category filter + remove |
| `/dashboard/history` | Recently viewed advice/articles/experts, clearable |
| `/dashboard/consultations` | Mock bookings grouped by status |
| `/dashboard/profile` | Editable name/bio/preferred categories |
| `/dashboard/settings` | Theme, notification & privacy toggles, logout, delete account |

## How mock authentication works
`services/userService.ts` exposes `mockLogin(email)` / `mockSignup(name, email)`. Both accept
any input and fabricate a `User` object client-side (no server round trip). The signed-in user is
held in `store/useAuthStore.ts`, a Zustand store persisted to `localStorage` under `pw_user`.
`app/dashboard/layout.tsx` guards every `/dashboard/*` route and redirects to `/login` when
there's no user in the store.

## How state & localStorage work
Each concern has its own Zustand store under `store/`, all using the `persist` middleware so
state survives refreshes without any manual `localStorage.getItem/setItem` calls in components:
- `useAuthStore` → current user (`pw_user`)
- `useSavedStore` → bookmarked advice/articles (`pw_saved`)
- `useQuestionsStore` → user-submitted questions + generated advice (`pw_questions`)
- `useBookingsStore` → mock expert bookings (`pw_bookings`)
- `useHistoryStore` → recently viewed items, capped at 30 (`pw_history`)
- `useThemeStore` → light/dark/auto preference (`pw_theme`)
- `useRecentSearchStore` → last 6 search queries (`pw_recent_search`)

## Where a real backend plugs in
All data access goes through `services/*.ts` (`adviceService`, `expertService`,
`articleService`, `userService`). Every function in these files currently reads from the mock
data in `data/*.ts` and wraps the result in `delay()` to simulate network latency. To connect a
real backend, replace the body of each function with a `fetch("/api/...")` call that returns the
same shape — no component or page needs to change, since they only ever import from `services/`,
never from `data/` directly (except for a few server-rendered detail pages, which can be swapped
to `async` Server Components calling the same services).

## Important files/folders
```
app/            Route segments (App Router) — one folder per route above
components/
  layout/       Navbar, Footer, DashboardSidebar, ThemeToggle
  ui/           Button, Input, Select, Modal, Toast, Badge, EmptyState, LoadingSkeleton
  advice/       AdviceCard, AdviceForm, AdviceActions
  experts/      ExpertCard, ExpertFilters, BookingModal
  blog/         ArticleCard
  common/       CategoryCard, SearchBar, Disclaimer
data/           Mock data: categories, advice, experts, articles, response templates
services/       Mock "API" boundary — swap for real fetch calls later
store/          Zustand stores (all localStorage-persisted)
lib/            Shared TypeScript types + utils
```

## Notes / what's intentionally simplified
- Pages are Client Components (since almost everything reads Zustand/localStorage state), so
  per-page `generateMetadata` isn't wired up beyond the root layout's defaults — an easy follow-up
  is splitting data-heavy pages into a thin Server Component wrapper (for metadata + SEO) around
  a Client Component for interactivity.
- Mock data volume (12 categories, ~30 advice items, 12 experts, ~18 articles) is enough to make
  the app feel real without bloating the repo; `data/advice.ts` and `data/articles.ts` generate
  entries programmatically per category, so bumping the numbers is a one-line change.
- Framer Motion is listed as a natural next dependency for page/card transitions but isn't wired
  in yet, to keep the initial handoff focused and easy to review.
