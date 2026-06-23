import { useEffect, useMemo, useState } from 'react'
import { X, Globe, Lock, CreditCard, Check } from 'lucide-react'
import { ASSET_TYPE_KEYS, TENANTS } from '../data/mockData'
import { useTranslation } from '../i18n/LanguageContext'

// Field schema per asset type. Each field declares its i18n labelKey +
// placeholderKey, the underlying form value name, and a validator.
const FIELD_SCHEMAS = {
  domain: [
    { name: 'name', labelKey: 'modal.fields.domainName', placeholderKey: 'modal.fields.domainPlaceholder' },
    { name: 'registrar', labelKey: 'modal.fields.registrar', placeholderKey: 'modal.fields.registrarPlaceholder' },
    { name: 'expiryDate', labelKey: 'modal.fields.expiryDate', type: 'date' },
  ],
  ssl: [
    { name: 'name', labelKey: 'modal.fields.sslName', placeholderKey: 'modal.fields.sslPlaceholder' },
    { name: 'authority', labelKey: 'modal.fields.authority', placeholderKey: 'modal.fields.authorityPlaceholder' },
    { name: 'expiryDate', labelKey: 'modal.fields.expiryDate', type: 'date' },
  ],
  card: [
    { name: 'service', labelKey: 'modal.fields.cardService', placeholderKey: 'modal.fields.cardServicePlaceholder' },
    { name: 'last4', labelKey: 'modal.fields.last4', placeholderKey: 'modal.fields.last4Placeholder', inputMode: 'numeric', maxLength: 4 },
    { name: 'expiryDate', labelKey: 'modal.fields.cardExpiry', type: 'month' },
  ],
}

const TYPE_ICONS = { domain: Globe, ssl: Lock, card: CreditCard }

function emptyValues(type) {
  const base = { tenantId: TENANTS[1].id }
  for (const f of FIELD_SCHEMAS[type]) base[f.name] = ''
  return base
}

function validate(type, values, t) {
  const errors = {}
  for (const f of FIELD_SCHEMAS[type]) {
    const v = (values[f.name] ?? '').toString().trim()
    if (!v) {
      errors[f.name] = t('modal.errors.required')
      continue
    }
    if (f.name === 'last4' && !/^\d{4}$/.test(v)) {
      errors[f.name] = t('modal.errors.last4')
    }
  }
  return errors
}

export default function AddAssetModal({ open, onClose, onAdd }) {
  const { t } = useTranslation()
  const [type, setType] = useState('domain')
  const [values, setValues] = useState(() => emptyValues('domain'))
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  // Reset the form each time the modal opens.
  useEffect(() => {
    if (open) {
      setType('domain')
      setValues(emptyValues('domain'))
      setErrors({})
      setSubmitted(false)
    }
  }, [open])

  // Close on Escape.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // When the type changes, reset the dynamic fields (keep the tenant).
  const switchType = (next) => {
    setType(next)
    setValues((v) => ({ tenantId: v.tenantId, ...emptyValues(next) }))
    setErrors({})
    setSubmitted(false)
  }

  const update = (name, val) => {
    setValues((v) => ({ ...v, [name]: val }))
    if (submitted) {
      setErrors(validate(type, { ...values, [name]: val }, t))
    }
  }

  const fields = FIELD_SCHEMAS[type]

  const handleSubmit = (e) => {
    e.preventDefault()
    const v = validate(type, values, t)
    setErrors(v)
    setSubmitted(true)
    if (Object.keys(v).length > 0) return

    // Normalise into the same flat asset shape used by mockData.
    const base = {
      id: `a-${Date.now()}`,
      type,
      tenantId: values.tenantId,
      expiryDate: new Date(values.expiryDate),
    }
    if (type === 'domain') {
      onAdd({ ...base, name: values.name, meta: { registrar: values.registrar } })
    } else if (type === 'ssl') {
      onAdd({ ...base, name: values.name, meta: { authority: values.authority } })
    } else {
      onAdd({
        ...base,
        name: `${values.service} — Carte *${values.last4}`,
        meta: { service: values.service, last4: values.last4 },
      })
    }
    onClose()
  }

  const tenants = useMemo(
    () => TENANTS.filter((tt) => tt.id !== 'all'),
    [],
  )

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-lg animate-scale-in overflow-hidden rounded-2xl bg-white shadow-pop">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 p-5">
          <div>
            <h2 className="text-base font-semibold text-gray-900">{t('modal.title')}</h2>
            <p className="mt-0.5 text-xs text-gray-400">{t('modal.subtitle')}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto p-5">
          {/* Type selector */}
          <div>
            <label className="label">{t('modal.typeLabel')}</label>
            <div className="grid grid-cols-3 gap-2">
              {ASSET_TYPE_KEYS.map((tk) => {
                const Icon = TYPE_ICONS[tk]
                const selected = type === tk
                return (
                  <button
                    key={tk}
                    type="button"
                    onClick={() => switchType(tk)}
                    className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-xs font-semibold transition-all ${
                      selected
                        ? 'border-brand-500 bg-brand-50 text-brand-700 ring-2 ring-brand-100'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {t(`assetType.${tk}`)}
                    {selected && <Check className="h-3 w-3 text-brand-600" />}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Dynamic fields */}
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {fields.map((f) => {
              const isFull = f.type === 'date' || f.type === 'month' || f.name === 'service' || f.name === 'registrar'
              return (
                <div key={f.name} className={isFull ? 'sm:col-span-2' : ''}>
                  <label className="label" htmlFor={`f-${f.name}`}>
                    {t(f.labelKey)}
                  </label>
                  <input
                    id={`f-${f.name}`}
                    type={f.type ?? 'text'}
                    inputMode={f.inputMode}
                    maxLength={f.maxLength}
                    value={values[f.name] ?? ''}
                    onChange={(e) => update(f.name, e.target.value)}
                    placeholder={f.placeholderKey ? t(f.placeholderKey) : undefined}
                    className={`input ${errors[f.name] ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : ''}`}
                  />
                  {errors[f.name] && (
                    <p className="mt-1 text-xs font-medium text-red-600">{errors[f.name]}</p>
                  )}
                </div>
              )
            })}

            {/* Tenant selector */}
            <div className="sm:col-span-2">
              <label className="label" htmlFor="f-tenant">
                {t('modal.fields.tenant')}
              </label>
              <select
                id="f-tenant"
                value={values.tenantId}
                onChange={(e) => update('tenantId', e.target.value)}
                className="input"
              >
                {tenants.map((tt) => (
                  <option key={tt.id} value={tt.id}>
                    {tt.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 flex items-center justify-end gap-2 border-t border-gray-100 pt-5">
            <button type="button" onClick={onClose} className="btn-ghost">
              {t('modal.cancel')}
            </button>
            <button type="submit" className="btn-primary">
              {t('modal.submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
