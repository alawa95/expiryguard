import { useMemo, useState } from 'react'
import { LanguageProvider } from './i18n/LanguageContext'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import DashboardView from './components/DashboardView'
import AddAssetModal from './components/AddAssetModal'
import { ASSETS, TENANTS } from './data/mockData'
import { getStatus } from './lib/status'

function ExpiryGuardApp() {
  const [assets, setAssets] = useState(ASSETS)
  const [activeView, setActiveView] = useState('dashboard')
  const [tenant, setTenant] = useState('all')
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)

  // Apply tenant + global search filters at the top level so the TopBar's
  // urgent badge and the table stay perfectly in sync.
  const visibleAssets = useMemo(() => {
    const q = search.trim().toLowerCase()
    return assets.filter((a) => {
      if (tenant !== 'all' && a.tenantId !== tenant) return false
      if (!q) return true
      const tenantName = TENANTS.find((tt) => tt.id === a.tenantId)?.name ?? ''
      const haystack = [
        a.name,
        a.meta?.registrar,
        a.meta?.authority,
        a.meta?.service,
        a.meta?.last4,
        tenantName,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return haystack.includes(q)
    })
  }, [assets, tenant, search])

  // Urgent = critical OR expired, scoped to the current filters.
  const urgentCount = useMemo(
    () =>
      visibleAssets.filter(
        (a) => getStatus(a.expiryDate) === 'critical' || getStatus(a.expiryDate) === 'expired',
      ).length,
    [visibleAssets],
  )

  // Per-type counts for the sidebar badges.
  const sidebarCounts = useMemo(
    () => ({
      dashboard: assets.length,
      domains: assets.filter((a) => a.type === 'domain').length,
      ssl: assets.filter((a) => a.type === 'ssl').length,
      cards: assets.filter((a) => a.type === 'card').length,
    }),
    [assets],
  )

  const handleAddAsset = (asset) => {
    setAssets((prev) => [asset, ...prev])
  }

  const handleRenew = (asset) => {
    // Placeholder: bump the expiry one year forward so the demo feels alive.
    const next = new Date(asset.expiryDate)
    next.setFullYear(next.getFullYear() + 1)
    setAssets((prev) =>
      prev.map((a) => (a.id === asset.id ? { ...a, expiryDate: next } : a)),
    )
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50">
      <Sidebar
        activeView={activeView}
        onNavigate={setActiveView}
        counts={sidebarCounts}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          search={search}
          onSearch={setSearch}
          tenant={tenant}
          onTenantChange={setTenant}
          urgentCount={urgentCount}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <DashboardView
              activeView={activeView}
              assets={visibleAssets}
              onAddAsset={() => setModalOpen(true)}
              onRenew={handleRenew}
            />
          </div>
        </main>
      </div>

      <AddAssetModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAddAsset}
      />
    </div>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <ExpiryGuardApp />
    </LanguageProvider>
  )
}
