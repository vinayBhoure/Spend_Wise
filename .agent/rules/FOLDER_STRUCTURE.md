---
trigger: always_on
---

- Always scaffold the full `src/` folder structure before generating any component or page code.
- Every file has exactly one home. Components go in `components/`, API logic in `services/`, Redux slices in `store/slices/`, types in `types/`, utilities in `utils/`.
- Never create a file outside its designated folder. If a folder doesn't exist, create it first.
- Page files live only in `src/pages/`. No business logic inside page files — only composition of components and hooks.
- Shared reusable atoms (Button, Input, Badge, Card) live in `src/components/ui/`. Layout components (Navbar, Footer, Sidebar, PageWrapper) live in `src/components/layout/`.

src/
├── assets/
├── components/
│   ├── ui/
│   └── layout/
├── pages/
├── hooks/
├── lib/
│   └── supabase.ts
├── services/
├── store/
│   ├── index.ts
│   └── slices/
├── types/
├── utils/
└── styles/