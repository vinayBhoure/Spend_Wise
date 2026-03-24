---
trigger: always_on
---

- Always build in this order: `ui atoms` → `composite components` → `pages`. Never reverse this.
- Every component must be a named export, never a default export from `components/` files.
- No inline styles. No hardcoded hex colors in JSX. All values come from Tailwind config tokens.
- Every component must handle three states explicitly: **loading**, **empty**, and **error**. Never leave any of these implicit.
- Props must always be typed with a TypeScript interface defined at the top of the file, never inline.
- Components must never call Supabase directly. They receive data via hooks only.
- No component should exceed 150 lines. If it does, split it.