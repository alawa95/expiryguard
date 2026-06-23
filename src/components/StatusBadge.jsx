import { STATUS_META } from '../lib/status'
import { relativeLabel } from '../lib/assetDisplay'
import { useTranslation } from '../i18n/LanguageContext'

/**
 * Coloured pill that summarises an asset's alert state.
 * Combines the status dot + localised label + optional "time remaining" hint.
 */
export default function StatusBadge({ status, expiryDate, showHint = false }) {
  const { t } = useTranslation()
  const meta = STATUS_META[status]
  return (
    <div className="flex flex-col gap-1">
      <span
        className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${meta.badge}`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${meta.dot}`}
          aria-hidden="true"
        />
        {t(`status.${status}`)}
      </span>
      {showHint && (
        <span className={`text-[11px] font-medium ${meta.accent}`}>
          {relativeLabel(t, expiryDate)}
        </span>
      )}
    </div>
  )
}
