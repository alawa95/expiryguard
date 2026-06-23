import { Search, Bell, ChevronDown, Check } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { TENANTS } from '../data/mockData'
import { useTranslation } from '../i18n/LanguageContext'

// ---- Tenant switcher (localised) ----
function TenantSwitcher({ value, onChange }) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const tenants = [{ id: 'all', name: t('topbar.allTenants') }, ...TENANTS.slice(1)]
  const current = tenants.find((tt) => tt.id === value) ?? tenants[0]

  useEffect(() => {
    function onDocClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-100 text-[11px] font-bold text-brand-700">
          {current.name.charAt(0)}
        </span>
        <span className="hidden max-w-[140px] truncate sm:inline">{current.name}</span>
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </button>

      {open && (
        <div className="absolute right-0 z-30 mt-2 w-56 origin-top-right animate-scale-in overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-pop">
          <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            {t('topbar.tenantLabel')}
          </p>
          {tenants.map((tt) => {
            const selected = tt.id === value
            return (
              <button
                key={tt.id}
                onClick={() => {
                  onChange(tt.id)
                  setOpen(false)
                }}
                className={`flex w-full items-center gap-2 px-3 py-1.5 text-sm transition-colors ${
                  selected
                    ? 'bg-brand-50 font-medium text-brand-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-md text-[11px] font-bold ${
                    selected
                      ? 'bg-brand-600 text-white'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {tt.name.charAt(0)}
                </span>
                <span className="flex-1 text-left">{tt.name}</span>
                {selected && <Check className="h-4 w-4 text-brand-600" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ---- Language switcher with flags ----
function LanguageSwitcher() {
  const { language, setLanguage, languages } = useTranslation()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const current = languages.find((l) => l.code === language) ?? languages[0]

  useEffect(() => {
    function onDocClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
        aria-label="Change language"
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="hidden sm:inline">{current.short}</span>
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </button>

      {open && (
        <div className="absolute right-0 z-30 mt-2 w-44 origin-top-right animate-scale-in overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-pop">
          {languages.map((l) => {
            const selected = l.code === language
            return (
              <button
                key={l.code}
                onClick={() => {
                  setLanguage(l.code)
                  setOpen(false)
                }}
                className={`flex w-full items-center gap-2.5 px-3 py-1.5 text-sm transition-colors ${
                  selected
                    ? 'bg-brand-50 font-medium text-brand-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-base leading-none">{l.flag}</span>
                <span className="flex-1 text-left">{l.label}</span>
                {selected && <Check className="h-4 w-4 text-brand-600" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function TopBar({ search, onSearch, tenant, onTenantChange, urgentCount }) {
  const { t } = useTranslation()
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-gray-200 bg-white/80 px-4 backdrop-blur-md md:px-6">
      {/* Global search */}
      <div className="relative flex-1 max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={t('topbar.searchPlaceholder')}
          className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
      </div>

      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <TenantSwitcher value={tenant} onChange={onTenantChange} />

        {/* Notifications with urgent badge */}
        <button
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-700"
          title={t('topbar.notifications')}
        >
          <Bell className="h-[18px] w-[18px]" />
          {urgentCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] animate-pulse-ring items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
              {urgentCount}
            </span>
          )}
        </button>

        {/* User avatar */}
        <button className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-xs font-bold text-white shadow-sm">
          LM
        </button>
      </div>
    </header>
  )
}
