<div align="center">

# 💸 SpendWise

### Your Minimal, Powerful Personal Finance Tracker

A progressive web application (PWA) built to help you track your expenses, manage accounts, and stay on top of your financial goals in real-time.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-764ABC?logo=redux&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)

[Features](#-features) · [Pricing Plans](#-pricing-plans) · [Tech Stack](#-tech-stack) · [Quick Start](#-quick-start) · [Future Scope](#-future-scope)

</div>

---

## 🎯 What is SpendWise?

SpendWise is a responsive, offline-capable progressive web application for tracking personal finances. With an intense focus on a beautiful user interface, dark mode, and seamless interactions, SpendWise makes it effortless to record transactions, manage multiple accounts, and understand your spending patterns.

**Perfect for:**
- 📊 **Expense Tracking** — quickly log your daily spendings
- 🏦 **Account Management** — keep track of multiple bank accounts and wallets
- 📈 **Financial Planning** — understand where your money goes via intelligent statistics

---

## ✨ Features

### 🔄 Progressive Web App (PWA)
Fully installable on mobile devices with proper offline fallbacks. Built using Vite PWA strategies ensuring the app is always fast, responsive, and available.

### 🌓 Dynamic Dark Mode
A meticulously crafted semantic design system supporting seamless transitions between light and dark themes based on your system preferences.

### 📱 Mobile-Optimized Filters
Advanced, master-detail "drawer-style" transaction filters for date ranges, transaction types, amounts, and categories tailored specifically for a premium mobile experience.

### 🔒 Secure Authentication
Powered by Supabase Auth with mandatory onboarding flows ensuring your currency and initial accounts are set up automatically.

---

## 💎 Pricing Plans

We've designed SpendWise to scale with your needs.

<table>
<tr>
<th width="50%">🌱 Free Plan</th>
<th width="50%">⭐ Plus Plan</th>
</tr>
<tr>
<td>

Perfect for getting started with personal finance.

- **Up to 3 Accounts:** Manage your main checking, savings, and wallet.
- **Basic Categories:** Read-only standard categories + default "Other" category.
- **Current Month Stats:** Access to your current month's transaction history and statistics.
- **Standard Filtering:** Basic transaction filtering capabilities.

</td>
<td>

For power users who need complete control over their money.

- **Unlimited Accounts:** Add as many banks and credit cards as you need.
- **Custom Categories:** Create, manage, and delete highly customized categories.
- **Historical Data:** Full access to intelligent, advanced date range filters and all-time transaction history.
- **Advanced Filtering:** Multi-select advanced filters and priority support.

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

<table>
<tr>
<td align="center" width="50%"><b>Frontend Core</b></td>
<td align="center" width="50%"><b>Backend & State</b></td>
</tr>
<tr>
<td>

- React 18 + Vite
- Tailwind CSS
- PWA (vite-plugin-pwa)
- React Router DOM

</td>
<td>

- Supabase (Auth, RLS, DB)
- Redux Toolkit (Slices & Thunks)
- Context API (Theme Management)

</td>
</tr>
</table>

---

## 🚀 Quick Start

### Prerequisites
Make sure you have Node.js (v18+) and npm installed. You will also need a Supabase project set up.

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/spendwise.git
cd spendwise/frontend

# Install dependencies
npm install

# Setup environment variables
# Copy .env.example to .env.local and fill in your Supabase credentials
cp .env.example .env.local

# Run the development server
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 📁 Folder Structure

SpendWise strictly adheres to a clean, scalable architectural pattern:

```
src/
├── assets/          # Static files and images
├── components/      
│   ├── ui/          # Reusable dumb components (Button, Input, Card)
│   └── layout/      # Navbar, BottomNav, Sidebar wrappers
├── hooks/           # Custom React hooks (e.g., usePlan, useAuth)
├── pages/           # High-level route components
├── services/        # Supabase API handlers (no UI logic here)
├── store/           # Redux Toolkit configuration
│   └── slices/      # Accounts, Transactions, Auth slices
├── styles/          # Tailwind configuration & global CSS
├── utils/           # Formatting functions and generic helpers
└── lib/             # Supabase client initialization
```

---

## 🔮 Future Scope

SpendWise is continually evolving. Here are some of the features planned for the future roadmap:

1. **AI-Powered Insights:** Automatic categorization of transactions and personalized saving recommendations.
2. **Budgeting System:** Set monthly limits per category and receive notifications when you're nearing your budgets.
3. **Data Export/Import:** Seamlessly export data to CSV/PDF or import legacy data from other apps.
4. **Shared Wallets:** Collaborate with family members and track shared expenses dynamically.
5. **Multi-Currency Support:** Convert transactions fluidly for international travelers.
6. **Detailed Charts:** Integration of robust data visualization libraries for deeper statistical analysis.

---

<div align="center">

## 📝 License

Developed by **Vinay Bhoure**

</div>
