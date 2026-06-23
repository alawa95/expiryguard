import { daysUntil } from './status'

/**
 * Localised "time remaining" label driven by the i18n translator.
 *   - future  : "Dans 5 jours" / "In 5 days" / "En 5 días"
 *   - past    : "Il y a 3 jours" / "3 days ago" / "Hace 3 días"
 *   - special : today / tomorrow / yesterday
 * Months are used for long ranges (|days| > 60) to stay readable.
 */
export function relativeLabel(t, expiryDate, now = new Date()) {
  const days = daysUntil(expiryDate, now)
  const abs = Math.abs(days)

  if (days === 0) return t('relative.today')
  if (days === 1) return t('relative.tomorrow')
  if (days === -1) return t('relative.yesterday')

  if (abs > 60) {
    const months = Math.round(abs / 30)
    return days > 0
      ? t('relative.inMonths', { n: months })
      : t('relative.agoMonths', { n: months })
  }
  return days > 0
    ? t('relative.inDays', { n: abs })
    : t('relative.agoDays', { n: abs })
}

/**
 * Builds the secondary descriptive line shown under an asset name in the
 * table (e.g. "Registrar — Namecheap" or "Autorité — Let's Encrypt").
 * Localised prefix, real value from meta.
 */
export function subLabel(t, asset) {
  switch (asset.type) {
    case 'domain':
      return `${t('modal.fields.registrar')} — ${asset.meta?.registrar ?? '—'}`
    case 'ssl':
      return `${t('modal.fields.authority')} — ${asset.meta?.authority ?? '—'}`
    case 'card':
      return asset.meta?.last4
        ? `•••• ${asset.meta.last4}`
        : '—'
    default:
      return ''
  }
}
