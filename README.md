# ExpiryGuard — Centralised Expiry Monitor

A clean, minimalist **SaaS B2B dashboard** for web & marketing agencies to track
the expiration of **domains, SSL certificates, and credit cards** — and get
alerted _before_ something breaks. Inspired by the look & feel of Linear / Stripe.

Built with **React + Vite + Tailwind CSS + Lucide React**. Fully **multilingual**
(FR / EN / ES) with a hand-rolled i18n layer (no external library).

---

## ✨ Features

| Area | What it does |
| --- | --- |
| **Alert logic** | 4 statuses computed live from each expiry date — 🟢 Safe (>30d), 🟡 Warning (≤30d), 🟠 Critical (≤7d), 🔴 Expired. |
| **Sidebar** | Logo, translated nav (Dashboard, Domains, SSL, Cards, Settings) with per-type counts, Pro upsell card. |
| **Top bar** | Global search (domain / service / client), **language switcher with flags**, tenant (client/agency) selector, notifications bell with a red badge counting urgents. |
| **KPI cards** | 4 big-number cards: Total assets, Urgent (🟠), Expired (🔴), Next 30 days (🟡). Clickable to filter. |
| **Main table** | Sortable by **expiry date** (nearest danger first by default). Columns: type icon, name/service, client, expiry, status pill + hint, Renew action. |
| **Filters** | Status filter chips above the table; per-type views via the sidebar. |
| **Add asset modal** | Type selector (Domain / SSL / Card) → **dynamic fields** per type, with validation. |
| **Multi-tenant** | Tenant selector scopes the table, KPIs and the urgent badge. |
| **i18n** | One `LanguageProvider` + `useTranslation()` hook drives the whole UI, including dates via `Intl.DateTimeFormat`. Switch language live, no reload. |

---

## 🚀 Getting started

```bash
npm install      # install dependencies
npm run dev      # start the dev server  → http://localhost:5173
npm run build    # production build → /dist
npm run preview  # preview the production build
```

Requires Node 18+ (built & tested on Node 22).

---

## 🧱 Project structure

```
src/
├─ App.jsx                  # Orchestrates state: assets, filters, modal, layout
├─ main.jsx                 # React entry point
├─ index.css                # Tailwind layers + component classes
├─ i18n/
│  ├─ translations.js       # FR / EN / ES dictionary (flat dot-namespace keys)
│  └─ LanguageContext.jsx   # Provider + useTranslation() hook + interpolation
├─ data/
│  └─ mockData.js           # 10 realistic assets + tenants (dates relative to today)
├─ lib/
│  ├─ status.js             # getStatus(), daysUntil(), countByStatus(), STATUS_META
│  ├─ format.js             # Locale-aware date formatting (Intl.DateTimeFormat)
│  └─ assetDisplay.js       # Localised relative label + asset sub-label helpers
└─ components/
   ├─ Sidebar.jsx           # Brand + nav + Pro card
   ├─ TopBar.jsx            # Search + language switcher + tenant + bell + avatar
   ├─ KPICards.jsx          # 4 big-number cards (clickable filters)
   ├─ FilterChips.jsx       # Status filter row
   ├─ AssetTable.jsx        # Sortable main table
   ├─ AssetIcon.jsx         # Type icon chip
   ├─ StatusBadge.jsx       # Status pill + time-remaining hint
   ├─ AddAssetModal.jsx     # Dynamic-form add modal
   └─ DashboardView.jsx     # Page layout (header + KPIs + table)
```

---

## 🌍 Internationalisation

No external i18n library. The dictionary lives in `src/i18n/translations.js`
as flat, dot-namespace keys, and each value is either a plain string (shared
across languages) or a `{ fr, en, es }` object.

```jsx
import { useTranslation } from './i18n/LanguageContext'

const { t, language, setLanguage, intlLocale } = useTranslation()

t('nav.dashboard')                // → "Tableau de bord" / "Dashboard" / "Panel"
t('relative.inDays', { n: 5 })     // → "Dans 5 jours" / "In 5 days" / "En 5 días"
```

Dates are rendered with the native `Intl` API and the active locale
(`fr-FR` / `en-GB` / `es-ES`), so `12 March 2026` becomes
`12 mars 2026` / `12 de marzo de 2026` automatically.

To add a 4th language: append it to `LANGUAGES` and to each `{ fr, en, es }`
object in `translations.js`.

---

## 🎨 Design tokens

- **Accent:** electric indigo (`brand-600` = `#4f46e5`), defined in `tailwind.config.js`.
- **Backgrounds:** white cards on a `#F9FAFB` (`gray-50`) canvas.
- **Type:** Inter (loaded via Google Fonts in `index.html`).
- **Status colors:** emerald (safe), amber (warning), orange (critical), red (expired).

---

## 🧪 Mock data

All expiry dates in `src/data/mockData.js` are computed with
`new Date(Date.now() + n * DAY)`, so the demo **always lands assets in each of
the four alert buckets** no matter when you open it. Card expiries snap to the
last day of their month.
```
