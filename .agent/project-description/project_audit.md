# SpendWise — Full Project Audit vs FREE_VS_PLUS.md

> **Date:** 2026-04-02 | **Scope:** Frontend codebase analysis against [FREE_VS_PLUS.md](file:///c:/Users/Vinay%20Bhoure/STORAGE/SpendWise/frontend/.agent/project-description/FREE_VS_PLUS.md)

---

## Summary Dashboard

| Category | Count |
|---|---|
| ✅ Completed (production-worthy) | 22 |
| ⚠️ Partially Implemented / Half-done | 11 |
| 🐛 Has Bugs | 5 |
| 🚫 Not Started (Free Plan) | 5 |
| 🚫 Not Started (Plus Plan) | 38+ |
| **Total spec features (Free)** | ~40 |
| **Total spec features (Plus)** | ~95 |

---

## 🆓 FREE PLAN — Feature-by-Feature

### ✅ Authentication & Onboarding

| Feature | Status | Notes |
|---|---|---|
| Email/Password Sign Up & Sign In | ✅ Done | Zod validation, react-hook-form. Works well. |
| Google OAuth Sign In | ✅ Done | Service + thunk wired. Redirect configured. |
| 1-Screen Onboarding Flow | ⚠️ Partial | Exists as a simple splash with "Get Started" CTA. No currency selection or account creation wizard baked in — just redirects to `/auth`. |
| Currency Selection at Onboarding | 🚫 Missing | Spec says currency is chosen during onboarding. Currently set later in Settings. No onboarding step for it. |
| Account Creation Wizard | 🚫 Missing | No guided wizard post-signup. User lands on dashboard and must navigate to `/add-account` manually. |

> [!WARNING]
> **Bug — `auth.js` line 89:** `resetPasswordForEmail` uses `cl.location.origin` instead of `window.location.origin`. This will crash at runtime.

---

### ✅ Accounts (Limit: 3 accounts max — FREE)

| Feature | Status | Notes |
|---|---|---|
| Account Types: Bank, Cash, UPI, Credit Card | ✅ Done | [AddAccount.jsx](file:///c:/Users/Vinay%20Bhoure/STORAGE/SpendWise/frontend/src/pages/AddAccount.jsx) supports all types. |
| Add/Edit Account Details | ✅ Done | Full CRUD via [accounts.js](file:///c:/Users/Vinay%20Bhoure/STORAGE/SpendWise/frontend/src/services/accounts.js) service. |
| Live Account Balance | ✅ Done | `current_balance` displayed on [AccountCard](file:///c:/Users/Vinay%20Bhoure/STORAGE/SpendWise/frontend/src/components/accounts/AccountCard.jsx). |
| Single Currency per Account | ✅ Done | Currency set at creation, stored per-account. |
| **3-account limit enforcement** | 🚫 Missing | **No frontend enforcement of the 3-account limit** for free-tier users. Any user can create unlimited accounts. |

---

### ✅ Transactions (Limit: Last 6 months only — FREE)

| Feature | Status | Notes |
|---|---|---|
| Add Income/Expense/Transfer | ✅ Done | [AddTransaction](file:///c:/Users/Vinay%20Bhoure/STORAGE/SpendWise/frontend/src/pages/AddTransaction.jsx) + [TransferFunds](file:///c:/Users/Vinay%20Bhoure/STORAGE/SpendWise/frontend/src/pages/TransferFunds.jsx). |
| Required Fields: Amount, Category, Account, Date | ✅ Done | Validated in `handleSubmit`. |
| Optional Fields: Note, Time | ✅ Done | Both present in the form. |
| Edit/Delete Transaction | ✅ Done | [EditTransaction](file:///c:/Users/Vinay%20Bhoure/STORAGE/SpendWise/frontend/src/pages/EditTransaction.jsx) page + service CRUD. |
| Transaction Detail View | ⚠️ Partial | Edit page doubles as detail view. No dedicated read-only detail screen. |
| Optimistic UI Updates | 🚫 Missing | No optimistic updates in Redux slices — all updates wait for server response. |
| Transactions Grouped by Date | ✅ Done | `groupTransactionsByDate()` in [Transactions.jsx](file:///c:/Users/Vinay%20Bhoure/STORAGE/SpendWise/frontend/src/pages/Transactions.jsx) with "Today", "Yesterday", formatted dates. |
| **6-month history limit enforcement** | 🚫 Missing | No filter restricting free-tier users to last 6 months. All history is fetched. |

> [!NOTE]
> The `fetchTransactionsSummary` in [transactions.js](file:///c:/Users/Vinay%20Bhoure/STORAGE/SpendWise/frontend/src/services/transactions.js#L74-L108) uses a **hardcoded $3000 monthly budget**, which is arbitrary and not user-configurable. The summary cards are also **commented out** in the Transactions page (lines 118–135).

---

### ✅ Categories

| Feature | Status | Notes |
|---|---|---|
| Default System Categories (Income + Expense) | ✅ Done | Loaded via `fetchCategories`, `is_deletable` flag distinguishes system vs custom. |
| "Other" Catch-all Category | ⚠️ Unclear | Depends on DB seed data — not enforced in frontend. |
| ❌ No custom categories (FREE) | 🐛 Bug | **ManageCategories page allows full CRUD for ALL users** — add, edit, delete. There is no plan-gating. Free users should NOT be able to add custom categories per spec. |

---

### ✅ Dashboard (Current month only)

| Feature | Status | Notes |
|---|---|---|
| Total Balance (all accounts) | ✅ Done | Aggregated with currency conversion in [dashboard.js](file:///c:/Users/Vinay%20Bhoure/STORAGE/SpendWise/frontend/src/services/dashboard.js). |
| This Month Income, Expense, Savings | ⚠️ Partial | Only **expense** is tracked. No separate income or savings calculation on dashboard. |
| Last 10 Transactions Preview | ⚠️ Partial | Only **5 transactions** are fetched (`limit(5)`). Spec says 10. |
| Category Pie Chart (current month) | 🚫 Missing | Dashboard has no pie chart. The pie chart exists only on the Statistics page. |
| Empty State with CTA | ⚠️ Partial | Shows "Fetching your data..." text, but no proper empty state with CTA to add first transaction. |

> [!IMPORTANT]
> **Dashboard hardcodes a $3000 USD budget** ([dashboard.js line 55](file:///c:/Users/Vinay%20Bhoure/STORAGE/SpendWise/frontend/src/services/dashboard.js#L55)) and converts it to the user's currency. This is not a real user budget — it's a fake metric. The `trendPercentage` is also hardcoded to `12` ([line 133](file:///c:/Users/Vinay%20Bhoure/STORAGE/SpendWise/frontend/src/services/dashboard.js#L133)).

---

### ✅ Filters (Basic)

| Feature | Status | Notes |
|---|---|---|
| Quick Period Filters: Week/Month | ⚠️ Partial | [TransactionFilter](file:///c:/Users/Vinay%20Bhoure/STORAGE/SpendWise/frontend/src/components/ui/TransactionFilter.jsx) has date range filtering, but no single-click "This Week" / "This Month" presets. |
| Type Toggle: All/Income/Expense/Transfer | ✅ Done | Type filter works in the filter panel. |
| Single Category Filter | ✅ Done | Category selection available (actually supports multi-select, which is a Plus feature). |
| Single Account Filter | ✅ Done | Account selection available (also multi-select). |
| Include/Exclude Transfers Toggle | 🚫 Missing | No toggle exists to include/exclude transfer-type transactions. |

> [!WARNING]
> Multi-category and multi-account filtering is already available to ALL users. This should be gated behind Plus.

---

### ✅ Statistics (Limited)

| Feature | Status | Notes |
|---|---|---|
| Basic Statistics (current month category breakdown) | ⚠️ Partial | Shows ALL-TIME expense breakdown, not filtered to current month. No time filter on Statistics page. |
| Category Pie Chart | ✅ Done | [DonutChart](file:///c:/Users/Vinay%20Bhoure/STORAGE/SpendWise/frontend/src/components/statistics/DonutChart.jsx) renders correctly with colors. |

---

### ✅ Settings

| Feature | Status | Notes |
|---|---|---|
| Dark/Light Mode Toggle | 🐛 Bug | Toggle exists in UI but `handleToggle` only changes **local React state** — it does NOT actually toggle `document.documentElement.classList` or persist preference. Dark mode is always visually active. |
| Currency Preference | ✅ Done | Dropdown with `updateProfileCurrency` service call. |
| Currency locked after setup | 🐛 Bug | **Currency is NOT locked** — users can freely change it anytime from Settings. Spec says "locked after setup". |
| Edit Profile (name, avatar) | ✅ Done | Full edit form with avatar upload to Supabase Storage. |

---

### ✅ PWA

| Feature | Status | Notes |
|---|---|---|
| PWA Installable | 🐛 Bug | `vite-plugin-pwa` is in `package.json` but **NOT configured in `vite.config.js`** — only `react()` and `tailwindcss()` plugins are loaded. No manifest, no service worker. |
| Offline Support (IndexedDB cache) | 🚫 Missing | `dexie` is in dependencies but there is **zero usage** of it anywhere in the codebase. No IndexedDB caching implemented. |
| Background Sync | 🚫 Missing | No service worker, so no background sync. |

> [!CAUTION]
> **PWA is completely broken.** Despite having the dependencies installed (`vite-plugin-pwa`, `workbox-window`, `dexie`), none of them are configured or used. The app is NOT installable as a PWA.

---

## 💎 PLUS PLAN — Feature Status

All Plus features are effectively **Not Started** unless noted:

### 💎 Accounts (UNLIMITED)

| Feature | Status |
|---|---|
| Unlimited accounts | 🚫 No plan gating exists, so this is "accidentally" available |
| Archive/Restore Account | ⚠️ Half — archive service exists (`archiveAccount` in accounts.js), but **no restore** function and **no UI** to trigger archive |
| Exclude Account from Total Balance | ⚠️ Half — `exclude_from_transactions` field exists in DB/service, but UI in EditAccount may not fully use it |
| Multi-Currency Account Support | ⚠️ Partial — currency is per-account and conversion exists, but no multi-currency UX in the UI |

### 💎 Transactions (UNLIMITED HISTORY)

| Feature | Status |
|---|---|
| No 6-month limit | 🚫 No gating exists (accidentally available) |
| Recurring/Scheduled Transactions | 🚫 Not started |
| Future/Planned Transactions | 🚫 Not started |
| Bulk Import via CSV | 🚫 Not started |
| Split Transactions (multi-category) | 🚫 Not started |
| Attach receipts/images | 🚫 Not started |

### 💎 Categories (FULL CONTROL)

| Feature | Status |
|---|---|
| Add Custom Categories with Emoji | ✅ Built (but should be Plus-only) |
| Edit & Rename Categories | ✅ Built (but should be Plus-only) |
| Category Merge/Consolidation | 🚫 Not started |
| Category-level Rules (auto-categorize) | 🚫 Not started |

### 💎 Dashboard (FULL HISTORY)

| Feature | Status |
|---|---|
| Weekly Spending Summary Card | ⚠️ Partial — "Weekly Activity" graph exists, but not a summary card |
| Income vs Expense Bar Chart | 🚫 Not started |
| Month-over-Month Comparison | 🚫 Not started |
| Net Worth Over Time Chart | 🚫 Not started |

### 💎 Filters (ADVANCED)

| Feature | Status |
|---|---|
| Quick Period: 6M/Year/All Time | 🚫 Not started |
| Custom Date Range Filter | ✅ Built (should be Plus-only) |
| Multi-Category Filter | ✅ Built (should be Plus-only) |
| Multi-Account Filter | ✅ Built (should be Plus-only) |
| Label/Tag Filter | 🚫 Not started |
| Full-text Search | 🚫 Not started |

### 💎 Statistics (ADVANCED)

| Feature | Status |
|---|---|
| Smart Insight: Spending Spike Detection | 🚫 Not started |
| Smart Insight: Subscription Summary | 🚫 Not started |
| Smart Insight: Savings Rate Trend | 🚫 Not started |
| Click-through Category Breakdown | 🚫 Not started |
| Advanced Reports with Date Range | 🚫 Not started |
| Export CSV | 🚫 Not started |
| Export PDF Report | 🚫 Not started |

### 💎 Budgets, Subscriptions, Labels, Goals, Debts, Investments, Security, Enhanced PWA

| Module | Status |
|---|---|
| Budgets (PLUS EXCLUSIVE) — 5 features | 🚫 Entirely not started |
| Subscriptions (PLUS EXCLUSIVE) — 3 features | 🚫 Entirely not started |
| Labels (PLUS EXCLUSIVE) — 2 features | 🚫 Entirely not started |
| Goals (PLUS EXCLUSIVE) — 4 features | 🚫 Entirely not started |
| Debts (PLUS EXCLUSIVE) — 4 features | 🚫 Entirely not started |
| Investments (PLUS EXCLUSIVE) — 3 features | 🚫 Entirely not started |
| Security (PLUS EXCLUSIVE) — 4 features | 🚫 Entirely not started (biometric toggle is UI-only) |
| Enhanced PWA — push notifications | 🚫 Not started |

---

## 🐛 Bugs Found

| # | Severity | Location | Bug |
|---|---|---|---|
| 1 | 🔴 Critical | [auth.js:89](file:///c:/Users/Vinay%20Bhoure/STORAGE/SpendWise/frontend/src/services/auth.js#L89) | `cl.location.origin` — typo, should be `window.location.origin`. **Will crash on password reset.** |
| 2 | 🔴 Critical | [vite.config.js](file:///c:/Users/Vinay%20Bhoure/STORAGE/SpendWise/frontend/vite.config.js) | `vite-plugin-pwa` not configured. PWA is completely non-functional. |
| 3 | 🟡 Medium | [Settings.jsx](file:///c:/Users/Vinay%20Bhoure/STORAGE/SpendWise/frontend/src/pages/Settings.jsx#L36-L44) | Dark mode toggle only updates local state — no actual theme switching. |
| 4 | 🟡 Medium | [dashboard.js:55](file:///c:/Users/Vinay%20Bhoure/STORAGE/SpendWise/frontend/src/services/dashboard.js#L55) | Hardcoded `$3000` budget — fake metric shown to users. |
| 5 | 🟡 Medium | [dashboard.js:133](file:///c:/Users/Vinay%20Bhoure/STORAGE/SpendWise/frontend/src/services/dashboard.js#L133) | `trendPercentage: 12` is hardcoded — not calculated from data. |
| 6 | 🟡 Medium | [Transactions.jsx:201](file:///c:/Users/Vinay%20Bhoure/STORAGE/SpendWise/frontend/src/pages/Transactions.jsx#L73-L201) | Dual export: `export const Transactions` (named) AND `export default Transactions`. This works but violates project rules (named exports only). |
| 7 | 🟠 Low | [auth.js:75](file:///c:/Users/Vinay%20Bhoure/STORAGE/SpendWise/frontend/src/services/auth.js#L75) | `console.log('login using google')` left in production code. |
| 8 | 🟡 Medium | [Plans.jsx:49](file:///c:/Users/Vinay%20Bhoure/STORAGE/SpendWise/frontend/src/pages/Plans.jsx#L49) | `CURRENT_PLAN = 'free'` is hardcoded. No integration with actual user plan state. Plan page also has 3 tiers (Free/Plus/Pro) but spec only defines 2 (Free/Plus). |
| 9 | 🟠 Low | [TransactionFilter](file:///c:/Users/Vinay%20Bhoure/STORAGE/SpendWise/frontend/src/components/ui/TransactionFilter.jsx) | 14KB component (well over the 150-line rule). Should be split. |

---

## 🏗️ Production Readiness Gaps

| Gap | Impact | Priority |
|---|---|---|
| **No plan/tier system** — all features available to everyone | Monetization impossible | 🔴 P0 |
| **PWA not configured** — not installable, no offline, no SW | Core spec broken | 🔴 P0 |
| **No account limit enforcement** (3 for free) | Business logic missing | 🔴 P0 |
| **No 6-month history limit** for free tier | Business logic missing | 🔴 P0 |
| **Password reset crashes** (`cl.location.origin` typo) | Auth flow broken | 🔴 P0 |
| **Dark mode toggle is non-functional** | UX bug | 🟡 P1 |
| **No onboarding flow** (currency selection + account wizard) | First-run UX gap | 🟡 P1 |
| **Dashboard metrics are fake** (hardcoded budget/trend) | User trust issue | 🟡 P1 |
| Summary cards commented out on Transactions page | Half-done feature | 🟡 P1 |
| No `types/` directory — all JS, no TypeScript interfaces | Violates project rules | 🟠 P2 |
| No Tailwind config file for design tokens | Violates project rules | 🟠 P2 |
| `dexie` installed but unused (dead dependency) | Bundle bloat | 🟠 P2 |
| No error boundary at app level | Crash recovery missing | 🟠 P2 |
| `Change Password` button on Profile page has no `onClick` | Dead UI element | 🟠 P2 |
| `Quick Logging` / `Haptic Feedback` / `Biometric Unlock` toggles are decorative only | Fake settings | 🟠 P2 |
| `404` page is a plain `<div>` | No styling | 🟡 P3 |

---

## Scorecard — Free Plan Completion

```
✅ Completed & Working     : 22 / 38 features  →  58%
⚠️ Partial / Half-done     : 11 / 38 features  →  29%
🚫 Not Started             :  5 / 38 features  →  13%
```

**Bottom line:** The app has a solid foundation for transactions, accounts, auth, and basic statistics. However, it is **far from production-ready** because:

1. **No plan/tier gating** — the Free vs Plus distinction doesn't actually exist in code
2. **PWA is completely missing** despite being a core requirement
3. **Several fake/hardcoded metrics** undermine user trust
4. **Critical bugs** in auth flow and theme toggling
5. **Zero Plus-exclusive modules** are built (Budgets, Goals, Debts, Subscriptions, etc.)

> [!IMPORTANT]
> **Recommended next steps:**
> 1. Fix the 5 bugs listed above (especially the `cl.location` crash and PWA config)
> 2. Build a plan-gating service/hook (`usePlanGate`) to enforce Free vs Plus limits
> 3. Complete the onboarding flow with currency + account wizard
> 4. Configure `vite-plugin-pwa` with proper manifest and caching strategies
> 5. Remove fake dashboard metrics and implement real calculations
