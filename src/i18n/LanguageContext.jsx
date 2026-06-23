import { createContext, useContext, useMemo, useState } from 'react'
import { translations, DEFAULT_LANGUAGE, LANGUAGES } from './translations'

// ---------------------------------------------------------------------------
// ExpiryGuard — lightweight i18n (no external library).
//
//   const { t, locale, language, setLanguage } = useTranslation()
//   t('nav.dashboard')                 -> "Tableau de bord"
//   t('relative.inDays', { n: 5 })     -> "Dans 5 jours"
// ---------------------------------------------------------------------------

const LanguageContext = createContext(null)

/**
 * Each value in translations.js is either:
 *   - a string (same in all languages), or
 *   - an object keyed by language code { fr, en, es }.
 *
 * Given a locale, this resolves either form to a display string.
 */
function resolve(node, locale) {
  if (node == null) return ''
  if (typeof node === 'string') return node
  if (typeof node === 'object') {
    if (typeof node[locale] === 'string') return node[locale]
    // graceful fallback to default language then to first available
    if (typeof node[DEFAULT_LANGUAGE] === 'string') return node[DEFAULT_LANGUAGE]
    const first = Object.values(node)[0]
    if (typeof first === 'string') return first
  }
  return ''
}

function lookup(path, locale) {
  const parts = path.split('.')
  let node = translations
  for (const part of parts) {
    if (node && typeof node === 'object' && part in node) {
      node = node[part]
    } else {
      return null // missing key — caller falls back to the raw path
    }
  }
  return resolve(node, locale)
}

export function LanguageProvider({ children, initialLanguage = DEFAULT_LANGUAGE }) {
  const [language, setLanguage] = useState(initialLanguage)

  const value = useMemo(() => {
    const meta = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0]

    /**
     * Translate a dot-namespace key, with optional {var} interpolation.
     * Missing keys return the path itself (visible but not a crash).
     */
    const t = (path, vars) => {
      const raw = lookup(path, language)
      let str = raw ?? path
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          str = str.replaceAll(`{${k}}`, String(v))
        }
      }
      return str
    }

    return {
      t,
      language,
      setLanguage,
      locale: language, // 'fr' | 'en' | 'es'
      intlLocale: meta.intlLocale, // for Intl.DateTimeFormat / NumberFormat
      languages: LANGUAGES,
    }
  }, [language])

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  )
}

export function useTranslation() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useTranslation must be used inside a <LanguageProvider>')
  }
  return ctx
}
