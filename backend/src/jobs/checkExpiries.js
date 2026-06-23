/**
 * checkExpiries.js — Cron job de vérification des dates d'expiration
 *
 * S'exécute chaque nuit à 03:00 (Europe/Paris) via node-cron dans index.js.
 * Peut aussi être lancé manuellement : node src/jobs/checkExpiries.js
 *
 * Logique :
 *   - Récupère tous les actifs depuis Supabase
 *   - Regroupe par tenant (agence)
 *   - Pour chaque tenant, envoie un email si des actifs sont en zone critique (≤7j)
 *     ou en zone warning (≤30j) — un seul email par tenant et par niveau
 */

import 'dotenv/config'
import { supabase } from '../supabase.js'
import { sendExpiryAlert } from '../services/emailService.js'

const CRITICAL_DAYS = parseInt(process.env.ALERT_DAYS_CRITICAL || '7', 10)
const WARNING_DAYS = parseInt(process.env.ALERT_DAYS_WARNING || '30', 10)

function daysUntil(dateStr) {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const expiry = new Date(dateStr)
  expiry.setHours(0, 0, 0, 0)
  return Math.round((expiry - now) / (24 * 60 * 60 * 1000))
}

export async function runCheckExpiries() {
  console.log('[cron] Récupération des actifs...')

  // 1. Charger tous les actifs avec le tenant (join)
  const { data: assets, error: assetsError } = await supabase
    .from('assets')
    .select('*, tenants(name, email)')

  if (assetsError) {
    console.error('[cron] Erreur Supabase:', assetsError.message)
    return
  }

  console.log(`[cron] ${assets.length} actif(s) chargé(s)`)

  // 2. Enrichir avec daysLeft + filtrer expired & alertables
  const enriched = assets.map((a) => ({
    ...a,
    daysLeft: daysUntil(a.expiry_date),
  }))

  // 3. Regrouper par tenant_id
  const byTenant = enriched.reduce((acc, asset) => {
    if (!acc[asset.tenant_id]) acc[asset.tenant_id] = []
    acc[asset.tenant_id].push(asset)
    return acc
  }, {})

  let emailsSent = 0

  for (const [tenantId, tenantAssets] of Object.entries(byTenant)) {
    const tenant = tenantAssets[0]?.tenants
    if (!tenant?.email) {
      console.warn(`[cron] Tenant ${tenantId} sans email, ignoré.`)
      continue
    }

    // Critiques : daysLeft entre -∞ et CRITICAL_DAYS
    const critical = tenantAssets.filter((a) => a.daysLeft <= CRITICAL_DAYS)
    // Warnings : daysLeft entre CRITICAL_DAYS+1 et WARNING_DAYS
    const warnings = tenantAssets.filter(
      (a) => a.daysLeft > CRITICAL_DAYS && a.daysLeft <= WARNING_DAYS
    )

    if (critical.length > 0) {
      await sendExpiryAlert({
        to: tenant.email,
        agencyName: tenant.name,
        assets: critical,
        level: 'critical',
      })
      emailsSent++
    }

    if (warnings.length > 0) {
      await sendExpiryAlert({
        to: tenant.email,
        agencyName: tenant.name,
        assets: warnings,
        level: 'warning',
      })
      emailsSent++
    }
  }

  console.log(`[cron] Terminé. ${emailsSent} email(s) envoyé(s).`)
}

// Lancement direct : node src/jobs/checkExpiries.js
if (process.argv[1].endsWith('checkExpiries.js')) {
  runCheckExpiries().then(() => process.exit(0))
}
