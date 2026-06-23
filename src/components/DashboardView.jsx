import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import KPICards from './KPICards'
import AssetTable from './AssetTable'
import { countByStatus } from '../lib/status'
import { useTranslation } from '../i18n/LanguageContext'

// Maps a sidebar nav id to an asset-type filter (null = all).
const VIEW_TYPE_FILTER = {
  dashboard: null,
  domains: 'domain',
  ssl: 'ssl',
  cards: 'card',
  settings: null,
}

export default function DashboardView({ activeView, assets, onAddAsset, onRenew }) {
  const { t } = useTranslation()
  const [statusFilter, setStatusFilter] = useState(null)

  // Type filter derived from the active sidebar view.
  const typeFilter = VIEW_TYPE_FILTER[activeView] ?? null

  const scopedAssets = useMemo(
    () => (typeFilter ? assets.filter((a) => a.type === typeFilter) : assets),
    [assets, typeFilter],
  )

  const counts = useMemo(() => countByStatus(scopedAssets), [scopedAssets])

  const isSettings = activeView === 'settings'

  if (isSettings) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-card">
        <p className="text-sm text-gray-400">{t('nav.settings')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">{t('page.title')}</h1>
          <p className="mt-1 text-sm text-gray-500">{t('page.subtitle')}</p>
        </div>
        <button onClick={onAddAsset} className="btn-primary">
          <Plus className="h-4 w-4" />
          {t('page.addAsset')}
        </button>
      </div>

      {/* KPI cards */}
      <KPICards
        counts={counts}
        activeFilter={statusFilter}
        onFilter={(s) => setStatusFilter((prev) => (prev === s ? null : s))}
      />

      {/* Main table */}
      <AssetTable assets={scopedAssets} onRenew={onRenew} />
    </div>
  )
}
