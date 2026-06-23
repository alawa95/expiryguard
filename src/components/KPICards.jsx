import { Boxes, AlertTriangle, XCircle, Clock } from 'lucide-react'
import { useTranslation } from '../i18n/LanguageContext'

// KPI cards. `counts` comes from the derived status breakdown, so the numbers
// always match the table below. Cards with a `highlight` status are clickable
// filters.
const CARDS = [
  {
    key: 'total',
    Icon: Boxes,
    valueKey: 'total',
    iconChip: 'bg-brand-50 text-brand-600',
    valueClass: 'text-gray-900',
    labelKey: 'kpi.total.label',
    subKey: 'kpi.total.sub',
  },
  {
    key: 'critical',
    Icon: AlertTriangle,
    valueKey: 'critical',
    iconChip: 'bg-orange-50 text-orange-600',
    valueClass: 'text-orange-600',
    labelKey: 'kpi.critical.label',
    subKey: 'kpi.critical.sub',
    highlight: 'critical',
  },
  {
    key: 'expired',
    Icon: XCircle,
    valueKey: 'expired',
    iconChip: 'bg-red-50 text-red-600',
    valueClass: 'text-red-600',
    labelKey: 'kpi.expired.label',
    subKey: 'kpi.expired.sub',
    highlight: 'expired',
  },
  {
    key: 'warning',
    Icon: Clock,
    valueKey: 'warning',
    iconChip: 'bg-amber-50 text-amber-600',
    valueClass: 'text-amber-600',
    labelKey: 'kpi.warning.label',
    subKey: 'kpi.warning.sub',
    highlight: 'warning',
  },
]

export default function KPICards({ counts, onFilter, activeFilter }) {
  const { t } = useTranslation()

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {CARDS.map((card) => {
        const { Icon } = card
        const value = counts[card.valueKey] ?? 0
        const clickable = Boolean(card.highlight)
        const isActive = activeFilter === card.highlight
        return (
          <button
            key={card.key}
            type="button"
            disabled={!clickable}
            onClick={() => clickable && onFilter?.(card.highlight)}
            className={`group rounded-xl border bg-white p-5 text-left shadow-card transition-all ${
              isActive
                ? 'border-brand-300 ring-2 ring-brand-100'
                : 'border-gray-200'
            } ${
              clickable
                ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-pop hover:border-gray-300'
                : 'cursor-default'
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${card.iconChip}`}
              >
                <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
              </span>
              {clickable && (
                <span
                  className={`text-[11px] font-medium transition-colors ${
                    isActive ? 'text-brand-600' : 'text-gray-300 group-hover:text-brand-500'
                  }`}
                >
                  {t('kpi.filterAction')}
                </span>
              )}
            </div>
            <p className="mt-4 text-3xl font-bold tracking-tight tabular-nums">
              <span className={card.valueClass}>{value}</span>
            </p>
            <p className="mt-1 text-sm font-medium text-gray-600">{t(card.labelKey)}</p>
            <p className="mt-0.5 text-xs text-gray-400">{t(card.subKey)}</p>
          </button>
        )
      })}
    </div>
  )
}
