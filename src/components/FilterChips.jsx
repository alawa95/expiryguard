import { STATUS_META } from '../lib/status'
import { useTranslation } from '../i18n/LanguageContext'

// Status filter row sitting above the table. `active` is a status key or null.
const CHIPS = [
  { key: null, labelKey: 'filters.all', dot: null },
  { key: 'critical', labelKey: 'filters.criticalChip', dot: STATUS_META.critical.dot },
  { key: 'warning', labelKey: 'filters.warningChip', dot: STATUS_META.warning.dot },
  { key: 'expired', labelKey: 'filters.expiredChip', dot: STATUS_META.expired.dot },
]

export default function FilterChips({ active, counts, onChange }) {
  const { t } = useTranslation()

  const countFor = (key) => {
    if (key === null) return counts.total
    return counts[key] ?? 0
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {CHIPS.map((chip) => {
        const selected = active === chip.key
        return (
          <button
            key={String(chip.key)}
            onClick={() => onChange(chip.key)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
              selected
                ? 'border-brand-300 bg-brand-50 text-brand-700'
                : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {chip.dot && (
              <span className={`h-1.5 w-1.5 rounded-full ${chip.dot}`} />
            )}
            {t(chip.labelKey)}
            <span
              className={`ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums ${
                selected ? 'bg-brand-100 text-brand-700' : 'bg-gray-100 text-gray-500'
              }`}
            >
              {countFor(chip.key)}
            </span>
          </button>
        )
      })}

      {active !== null && (
        <button
          onClick={() => onChange(null)}
          className="ml-1 text-xs font-medium text-gray-400 underline-offset-2 hover:text-brand-600 hover:underline"
        >
          {t('filters.clear')}
        </button>
      )}
    </div>
  )
}
