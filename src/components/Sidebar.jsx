import {
  LayoutDashboard,
  Globe,
  Lock,
  CreditCard,
  Settings,
  ShieldCheck,
} from 'lucide-react'
import { useTranslation } from '../i18n/LanguageContext'

const NAV = [
  { id: 'dashboard', labelKey: 'nav.dashboard' },
  { id: 'domains', labelKey: 'nav.domains', filter: 'domain' },
  { id: 'ssl', labelKey: 'nav.ssl', filter: 'ssl' },
  { id: 'cards', labelKey: 'nav.cards', filter: 'card' },
]

function NavItem({ item, active, count, onClick, label }) {
  const { Icon } = item
  const isActive = active === item.id
  return (
    <button
      onClick={onClick}
      className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        isActive
          ? 'bg-brand-50 text-brand-700'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <Icon
        className={`h-[18px] w-[18px] ${
          isActive ? 'text-brand-600' : 'text-gray-400 group-hover:text-gray-600'
        }`}
        strokeWidth={2}
      />
      <span className="flex-1 text-left">{label}</span>
      {typeof count === 'number' && (
        <span
          className={`rounded-full px-1.5 py-0.5 text-[11px] font-semibold ${
            isActive
              ? 'bg-brand-100 text-brand-700'
              : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  )
}

export default function Sidebar({ activeView, onNavigate, counts = {} }) {
  const { t } = useTranslation()

  const navWithIcons = NAV.map((item) => {
    const IconMap = {
      dashboard: LayoutDashboard,
      domains: Globe,
      ssl: Lock,
      cards: CreditCard,
    }
    return { ...item, Icon: IconMap[item.id] }
  })

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-gray-200 bg-white lg:flex">
      {/* Brand */}
      <div className="flex h-16 items-center gap-2.5 px-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 shadow-sm">
          <ShieldCheck className="h-5 w-5 text-white" strokeWidth={2.2} />
        </span>
        <div className="leading-tight">
          <p className="text-[15px] font-bold tracking-tight text-gray-900">
            ExpiryGuard
          </p>
          <p className="text-[11px] font-medium text-gray-400">{t('app.tagline')}</p>
        </div>
      </div>

      {/* Primary nav */}
      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          {t('nav.sectionPilot')}
        </p>
        {navWithIcons.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            active={activeView}
            count={counts[item.id]}
            label={t(item.labelKey)}
            onClick={() => onNavigate(item.id)}
          />
        ))}

        <div className="mt-6" />
        <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          {t('nav.sectionAccount')}
        </p>
        <NavItem
          item={{ id: 'settings', labelKey: 'nav.settings', Icon: Settings }}
          active={activeView}
          label={t('nav.settings')}
          onClick={() => onNavigate('settings')}
        />
      </nav>

      {/* Footer upsell card — gives the SaaS a "real product" feel */}
      <div className="m-3 rounded-xl border border-brand-100 bg-gradient-to-br from-brand-50 to-white p-4">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-gray-900">{t('proCard.title')}</p>
          <span className="rounded bg-brand-600 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-white">
            {t('misc.proBadge')}
          </span>
        </div>
        <p className="mt-1 text-xs leading-relaxed text-gray-500">{t('proCard.body')}</p>
        <button className="btn-primary mt-3 w-full !py-1.5 text-xs">
          {t('proCard.cta')}
        </button>
      </div>
    </aside>
  )
}
