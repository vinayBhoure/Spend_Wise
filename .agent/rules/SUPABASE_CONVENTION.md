---
trigger: always_on
---

- The Supabase client is initialized exactly once in `src/lib/supabase.ts` and imported from there everywhere. Never call `createClient` anywhere else.
- All Supabase queries live in `src/services/`. Each domain gets its own file: `auth.ts`, `users.ts`, `posts.ts`, etc.
- Services export plain async functions only — no hooks, no React code inside services.
- Hooks in `src/hooks/` consume services and expose data + loading + error to components.
- All environment variables are accessed as `import.meta.env.VITE_SUPABASE_URL` and `import.meta.env.VITE_SUPABASE_ANON_KEY`. Never hardcode credentials.
- Supabase auth state is managed in a dedicated Redux slice: `store/slices/authSlice.ts`. The `useAuth` hook reads from this slice only.
- Row Level Security must be enabled on every Supabase table before any data feature is considered complete.