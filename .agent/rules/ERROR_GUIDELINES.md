# Agent Development Guidelines

This document outlines local development and implementation guidelines to ensure code quality and avoid recurring build or runtime errors.

## 📦 Dependency & Package Management
- **Verify Every Installation**: Never assume a background `npm install` succeeded without checking its output.
- **Handling ERESOLVE Conflicts**: If an installation fails due to peer dependency conflicts (especially common with `vite v8.x`), check the specific conflict or use `--legacy-peer-deps` if appropriate to resolve version mismatches between packages and the host environment.
- **Restart After Install**: Always suggest or perform a restart of the dev server (`npm run dev`) after installing new packages to ensure they are properly indexed by the bundler.

## 🧩 Export & Import Standards
- **Strict Named Exports**: Follow the `COMMON_PATTERN.md` rule: Use only named exports for components (e.g., `export const MyComponent = ...`). NEVER use default exports for components.
- **Import Consistency**: Always use named imports (e.g., `import { MyComponent } from './MyComponent'`) to match the export style.
- **Order of Operations**: Ensure that any custom hook, service, or helper utility is physically created before it is imported and used in other files.

## 🎨 Styling & CSS
- **Standard `@import` Placement**: Always place `@import` rules (including font imports) at the very top of the CSS file, before any `@theme` declarations or CSS rules.
- **No Inline Styles**: Adhere strictly to Tailwind tokens. If a color or spacing is required, add it to the `@theme` block in the global CSS first.

## 🔍 Code Quality & Validation
- **Lint Before Build**: Proactively run `npm run lint` or check for lint warnings (unused variables, unused imports, unused catch parameters) before submitting code.
- **Fix "Unused" Warnings**: Always remove unused variable declarations and unused catch block parameters (`catch {}` instead of `catch (err) {}` if `err` is not used).

## 🗄️ Supabase & Data Logic
- **Verify Schema via Tooling**: Use the Supabase MCP (`list_tables`, `list_columns`) to verify the database schema before writing queries. Do not assume table or field names based on generic patterns.
- **Handle Async Errors**: Ensure every Supabase service call is wrapped in a try/catch block and that the resulting data/error states are properly managed in the Redux store.
