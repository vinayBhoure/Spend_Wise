---
trigger: always_on
---

# Agent Rules — PWA (Vite + React(Javascript) + Redux Toolkit + Supabase)

## 🏪 Redux Toolkit Rules

- Every feature gets its own slice file inside `src/store/slices/`. Never put multiple unrelated features in one slice.
- Slice structure always follows: `initialState` → `reducers` → `extraReducers` (for async thunks) → named exports of actions → default export of reducer.
- All async operations use `createAsyncThunk`. Never dispatch raw promises from components.
- Thunks call service functions from `src/services/` only. No Supabase imports inside slice files.
- Selectors are defined at the bottom of each slice file and exported. Components never access raw state shape — they use selectors.
- The Redux store is configured once in `src/store/index.ts` and never modified at runtime.


## ⚙️ PWA / Service Worker Rules

- PWA is configured via `vite-plugin-pwa` in `vite.config.ts` only. No manual service worker files unless Workbox strategies are insufficient.
- Manifest must always include: `name`, `short_name`, `start_url`, `display: standalone`, `theme_color`, `background_color`, and both 192×192 and 512×512 icons including a maskable icon.
- `registerType` must always be set to `autoUpdate` — never prompt the user to manually refresh.
- Caching strategy rules:
  - Static assets (JS, CSS, fonts, images) → **Cache First**
  - Supabase API calls → **Network First** with a 3-second timeout fallback
  - HTML navigation routes → **Network First**
- Never cache authenticated API responses. Supabase auth tokens must always be fetched fresh.
- The app must render a meaningful offline fallback UI, not a blank screen, when the network is unavailable.
- Service worker scope must cover the entire app (`/`). Never restrict scope without an explicit reason.
- Before every production build, run a Lighthouse PWA audit. The PWA score must be 90 or above before deployment is considered valid.

---

## 🔒 General Safety Rules

- `.env.local` is never committed. It is always in `.gitignore` before the first commit.
- No `any` types in TypeScript. Every unknown type gets a proper interface in `src/types/`.
- No commented-out code is left in committed files.
- Every route that requires authentication is wrapped in a `<ProtectedRoute>` component. Public access to protected routes is never assumed safe.
- Design tokens (colors, font, spacing) are always defined in `tailwind.config.ts` under `theme.extend`. Raw values never appear in component files.


## ✅ Definition of Done — Per Feature

A feature is only complete when all of the following are true:

- [ ] Component handles loading, empty, and error states
- [ ] Redux slice and selectors are written and tested
- [ ] Service function in `src/services/` is the only Supabase caller
- [ ] RLS is enabled on all related Supabase tables
- [ ] Route is protected if it requires authentication
- [ ] No hardcoded values — all tokens from Tailwind config