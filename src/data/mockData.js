// ---------------------------------------------------------------------------
// ExpiryGuard — mock dataset
// ---------------------------------------------------------------------------
// Every expiry date is computed relative to `new Date()` so the demo always
// lands assets in each of the four alert buckets (safe / warning / critical /
// expired), no matter when it is opened.
//
// Helpers: date N days from now; last day of a given month (card expiry).
// ---------------------------------------------------------------------------

const DAY = 24 * 60 * 60 * 1000
const inDays = (n) => new Date(Date.now() + n * DAY)
// Card expiry lands on the last day of the given month.
const lastOfMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0)

// Tenants — the multi-tenant agency roster.
export const TENANTS = [
  { id: 'all', name: 'Studio Nord' }, // name overridden by i18n at render
  { id: 'studio-nord', name: 'Studio Nord' },
  { id: 'agence-orbit', name: 'Agence Orbit' },
  { id: 'atelier-mer', name: 'Atelier Mer' },
  { id: 'pixelhaus', name: 'PixelHaus' },
  { id: 'northbeam', name: 'Northbeam Media' },
]

// Each asset is a flat record regardless of type, so the table, KPIs and
// modal logic stay trivial. `meta` holds type-specific extras (registrar,
// authority, last4…) used for sub-labels and the add modal.
export const ASSETS = [
  // ------------------------------------------------------------- Critical (🟠, ≤ 7j)
  {
    id: 'a-001',
    type: 'domain',
    name: 'client-alpha.com',
    tenantId: 'studio-nord',
    expiryDate: inDays(2),
    meta: { registrar: 'Namecheap' },
  },
  {
    id: 'a-002',
    type: 'ssl',
    name: 'checkout.client-alpha.com',
    tenantId: 'studio-nord',
    expiryDate: inDays(5),
    meta: { authority: "Let's Encrypt" },
  },
  {
    id: 'a-003',
    type: 'card',
    name: 'AWS — Carte *4532',
    tenantId: 'agence-orbit',
    expiryDate: lastOfMonth(inDays(6)),
    meta: { service: 'AWS', last4: '4532' },
  },

  // ------------------------------------------------------------- Warning (🟡, ≤ 30j)
  {
    id: 'a-004',
    type: 'domain',
    name: 'orbital-marketing.fr',
    tenantId: 'agence-orbit',
    expiryDate: inDays(14),
    meta: { registrar: 'OVHcloud' },
  },
  {
    id: 'a-005',
    type: 'card',
    name: 'ChatGPT Team — Carte *8821',
    tenantId: 'atelier-mer',
    expiryDate: lastOfMonth(inDays(20)),
    meta: { service: 'ChatGPT Team', last4: '8821' },
  },
  {
    id: 'a-006',
    type: 'ssl',
    name: 'app.northbeam.io',
    tenantId: 'northbeam',
    expiryDate: inDays(27),
    meta: { authority: 'DigiCert' },
  },

  // ------------------------------------------------------------- Safe (🟢, > 30j)
  {
    id: 'a-007',
    type: 'card',
    name: 'Ahrefs — Carte *1190',
    tenantId: 'pixelhaus',
    expiryDate: lastOfMonth(inDays(96)),
    meta: { service: 'Ahrefs', last4: '1190' },
  },
  {
    id: 'a-008',
    type: 'domain',
    name: 'pixelhaus.studio',
    tenantId: 'pixelhaus',
    expiryDate: inDays(184),
    meta: { registrar: 'Porkbun' },
  },

  // ------------------------------------------------------------- Expired (🔴)
  {
    id: 'a-009',
    type: 'ssl',
    name: 'old.atelier-mer.com',
    tenantId: 'atelier-mer',
    expiryDate: inDays(-3),
    meta: { authority: 'Sectigo' },
  },
  {
    id: 'a-010',
    type: 'card',
    name: 'Stripe — Carte *0677',
    tenantId: 'studio-nord',
    expiryDate: lastOfMonth(inDays(-25)),
    meta: { service: 'Stripe', last4: '0677' },
  },
]

// Asset type identifiers — kept as plain constants. UI labels live in the
// translation dictionary (t('assetType.<type>')). Exported for switches.
export const ASSET_TYPE_KEYS = ['domain', 'ssl', 'card']
