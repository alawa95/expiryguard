import { Globe, Lock, CreditCard } from 'lucide-react'
import { useTranslation } from '../i18n/LanguageContext'

// Maps an asset type to its Lucide icon + tinted chip.
const ICON_CONFIG = {
  domain: { Icon: Globe, chip: 'bg-brand-50 text-brand-600' },
  ssl: { Icon: Lock, chip: 'bg-sky-50 text-sky-600' },
  card: { Icon: CreditCard, chip: 'bg-violet-50 text-violet-600' },
}

export default function AssetIcon({ type, className = '' }) {
  const { t } = useTranslation()
  const cfg = ICON_CONFIG[type] ?? ICON_CONFIG.domain
  const { Icon } = cfg
  return (
    <span
      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${cfg.chip} ${className}`}
      title={t(`assetType.${type}`)}
    >
      <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
    </span>
  )
}
