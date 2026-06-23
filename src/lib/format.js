// Locale-aware formatting helpers built on the native Intl API.
// Each helper takes the active intl locale (e.g. 'fr-FR') from the i18n layer.

/** "12 mars 2026" / "12 March 2026" / "12 de marzo de 2026" */
export function formatDateLong(date, intlLocale = 'fr-FR') {
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return '—'
  return new Intl.DateTimeFormat(intlLocale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d)
}

/** "12 Mar 2026" — short, friendly. */
export function formatDateMedium(date, intlLocale = 'fr-FR') {
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return '—'
  return new Intl.DateTimeFormat(intlLocale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d)
}

/** "12/03/2026" — compact, sortable. */
export function formatDateShort(date, intlLocale = 'fr-FR') {
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return '—'
  return new Intl.DateTimeFormat(intlLocale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d)
}

/** "Mar 2026" — used for credit-card expiry. */
export function formatCardExpiry(date, intlLocale = 'fr-FR') {
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return '—'
  return new Intl.DateTimeFormat(intlLocale, {
    month: 'short',
    year: 'numeric',
  }).format(d)
}
