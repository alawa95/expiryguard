// Centralised alert logic — the heart of ExpiryGuard.
//
// Status thresholds (per the spec):
//   🟢 safe     — expires in more than 30 days
//   🟡 warning  — expires in 30 days or less
//   🟠 critical — expires in 7 days or less
//   🔴 expired  — date is in the past
//
// Everything here is derived from a single source of truth so the badges,
// KPI cards and table never disagree.

export const STATUS = {
  safe: 'safe',
  warning: 'warning',
  critical: 'critical',
  expired: 'expired',
}

// Visual config only — label text comes from i18n (t('status.<key>')).
export const STATUS_META = {
  [STATUS.safe]: {
    key: 'safe',
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20',
    accent: 'text-emerald-600',
    rank: 0,
  },
  [STATUS.warning]: {
    key: 'warning',
    dot: 'bg-amber-400',
    badge: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20',
    accent: 'text-amber-600',
    rank: 1,
  },
  [STATUS.critical]: {
    key: 'critical',
    dot: 'bg-orange-500',
    badge: 'bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-600/20',
    accent: 'text-orange-600',
    rank: 2,
  },
  [STATUS.expired]: {
    key: 'expired',
    dot: 'bg-red-500',
    badge: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20',
    accent: 'text-red-600',
    rank: 3,
  },
}

const MS_PER_DAY = 24 * 60 * 60 * 1000

/**
 * Whole days from `now` (defaults to current time) until `expiryDate`.
 * Negative when the date is in the past.
 */
export function daysUntil(expiryDate, now = new Date()) {
  const start = new Date(now)
  start.setHours(0, 0, 0, 0)
  const end = new Date(expiryDate)
  end.setHours(0, 0, 0, 0)
  return Math.round((end.getTime() - start.getTime()) / MS_PER_DAY)
}

/**
 * Resolve an asset's alert status from its expiry date.
 */
export function getStatus(expiryDate, now = new Date()) {
  const days = daysUntil(expiryDate, now)
  if (days < 0) return STATUS.expired
  if (days <= 7) return STATUS.critical
  if (days <= 30) return STATUS.warning
  return STATUS.safe
}

/**
 * Counts how many assets fall in each status bucket.
 */
export function countByStatus(assets, now = new Date()) {
  const counts = { total: assets.length, safe: 0, warning: 0, critical: 0, expired: 0 }
  for (const a of assets) {
    counts[getStatus(a.expiryDate, now)]++
  }
  return counts
}
