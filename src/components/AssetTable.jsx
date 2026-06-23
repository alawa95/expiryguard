import { useMemo, useState } from 'react'
import { ArrowUpDown, RefreshCw, ArrowUp, ArrowDown, Inbox } from 'lucide-react'
import AssetIcon from './AssetIcon'
import StatusBadge from './StatusBadge'
import FilterChips from './FilterChips'
import { getStatus } from '../lib/status'
import { formatDateMedium, formatCardExpiry } from '../lib/format'
import { subLabel } from '../lib/assetDisplay'
import { TENANTS } from '../data/mockData'
import { useTranslation } from '../i18n/LanguageContext'

// Sortable columns. `default` for expiryDate is 'asc' (nearest danger first).
const COLUMNS = [
  { key: 'type', labelKey: 'table.colType', sortable: false, hideOnMobile: true },
  { key: 'name', labelKey: 'table.colName', sortable: false },
  { key: 'tenant', labelKey: 'table.colTenant', sortable: false, hideOnMobile: true },
  { key: 'expiryDate', labelKey: 'table.colExpiry', sortable: true, defaultDir: 'asc' },
  { key: 'status', labelKey: 'table.colStatus', sortable: false },
  { key: 'action', labelKey: 'table.colAction', sortable: false, align: 'right' },
]

function tenantName(tenantId, t) {
  if (tenantId === 'all') return t('topbar.allTenants')
  return TENANTS.find((tt) => tt.id === tenantId)?.name ?? tenantId
}

export default function AssetTable({ assets, onRenew }) {
  const { t, intlLocale } = useTranslation()

  // sort: { key, dir } — defaults to expiryDate asc (nearest danger first).
  const [sort, setSort] = useState({ key: 'expiryDate', dir: 'asc' })
  const [statusFilter, setStatusFilter] = useState(null)

  const toggleSort = (col) => {
    setSort((prev) => {
      if (prev.key === col.key) {
        return { key: col.key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
      }
      return { key: col.key, dir: col.defaultDir ?? 'asc' }
    })
  }

  const visible = useMemo(() => {
    let list = assets
    if (statusFilter) {
      list = list.filter((a) => getStatus(a.expiryDate) === statusFilter)
    }
    const sorted = [...list].sort((a, b) => {
      const av = new Date(a[sort.key]).getTime()
      const bv = new Date(b[sort.key]).getTime()
      return sort.dir === 'asc' ? av - bv : bv - av
    })
    return sorted
  }, [assets, statusFilter, sort])

  const statusCounts = useMemo(() => {
    const c = { total: assets.length, safe: 0, warning: 0, critical: 0, expired: 0 }
    for (const a of assets) c[getStatus(a.expiryDate)]++
    return c
  }, [assets])

  const SortIcon = ({ col }) => {
    if (!col.sortable) return null
    const active = sort.key === col.key
    if (!active) {
      return <ArrowUpDown className="h-3.5 w-3.5 text-gray-300 transition-colors group-hover:text-gray-400" />
    }
    return sort.dir === 'asc'
      ? <ArrowUp className="h-3.5 w-3.5 text-brand-600" />
      : <ArrowDown className="h-3.5 w-3.5 text-brand-600" />
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-card">
      {/* Table header: title + filters + result count */}
      <div className="flex flex-col gap-3 border-b border-gray-100 p-4 md:flex-row md:items-center md:justify-between md:p-5">
        <div>
          <h2 className="text-base font-semibold text-gray-900">{t('table.title')}</h2>
          <p className="mt-0.5 text-xs text-gray-400">
            {t('table.resultsCount', { count: visible.length })}
          </p>
        </div>
        <FilterChips
          active={statusFilter}
          counts={statusCounts}
          onChange={setStatusFilter}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/60">
              {COLUMNS.map((col) => {
                const isRight = col.align === 'right'
                return (
                  <th
                    key={col.key}
                    className={`px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500 md:px-5 ${
                      isRight ? 'text-right' : 'text-left'
                    } ${col.hideOnMobile ? 'hidden md:table-cell' : ''}`}
                  >
                    {col.sortable ? (
                      <button
                        onClick={() => toggleSort(col)}
                        className={`group inline-flex items-center gap-1.5 transition-colors hover:text-gray-900 ${
                          isRight ? 'flex-row-reverse' : ''
                        }`}
                      >
                        {t(col.labelKey)}
                        <SortIcon col={col} />
                      </button>
                    ) : (
                      <span>{t(col.labelKey)}</span>
                    )}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {visible.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} className="px-5 py-16 text-center">
                  <Inbox className="mx-auto h-8 w-8 text-gray-300" />
                  <p className="mt-2 text-sm text-gray-400">{t('table.empty')}</p>
                </td>
              </tr>
            ) : (
              visible.map((asset) => {
                const status = getStatus(asset.expiryDate)
                return (
                  <tr
                    key={asset.id}
                    className="group transition-colors hover:bg-gray-50/70"
                  >
                    {/* Type icon */}
                    <td className="px-4 py-3 md:px-5">
                      <AssetIcon type={asset.type} />
                    </td>

                    {/* Name + sub-label */}
                    <td className="px-4 py-3 md:px-5">
                      <p className="text-sm font-semibold text-gray-900">{asset.name}</p>
                      <p className="mt-0.5 text-xs text-gray-400">{subLabel(t, asset)}</p>
                    </td>

                    {/* Tenant */}
                    <td className="hidden px-4 py-3 md:table-cell md:px-5">
                      <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
                        <span className="flex h-5 w-5 items-center justify-center rounded bg-gray-100 text-[10px] font-bold text-gray-500">
                          {tenantName(asset.tenantId, t).charAt(0)}
                        </span>
                        {tenantName(asset.tenantId, t)}
                      </span>
                    </td>

                    {/* Expiry date */}
                    <td className="px-4 py-3 md:px-5">
                      <p className="text-sm font-medium text-gray-700 tabular-nums">
                        {asset.type === 'card'
                          ? formatCardExpiry(asset.expiryDate, intlLocale)
                          : formatDateMedium(asset.expiryDate, intlLocale)}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3 md:px-5">
                      <StatusBadge status={status} expiryDate={asset.expiryDate} showHint />
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3 text-right md:px-5">
                      <button
                        onClick={() => onRenew?.(asset)}
                        className="btn-ghost group/btn:!text-brand-600"
                        title={t('table.renew')}
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">{t('table.renew')}</span>
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
