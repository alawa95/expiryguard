import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.RESEND_FROM || 'alerts@expiryguard.app'

/**
 * Envoie un email d'alerte d'expiration.
 * @param {object} params
 * @param {string} params.to - Email du destinataire
 * @param {string} params.agencyName - Nom de l'agence
 * @param {Array}  params.assets - Liste des actifs à alerter [{name, type, expiry_date, daysLeft}]
 * @param {'critical'|'warning'} params.level - Niveau d'alerte
 */
export async function sendExpiryAlert({ to, agencyName, assets, level }) {
  const subject =
    level === 'critical'
      ? `🚨 [ExpiryGuard] ${assets.length} actif(s) expirent dans moins de 7 jours`
      : `⚠️ [ExpiryGuard] ${assets.length} actif(s) expirent dans les 30 prochains jours`

  const rows = assets
    .map(
      (a) => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb">${a.name}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-transform:capitalize">${a.type}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb">${new Date(a.expiry_date).toLocaleDateString('fr-FR')}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-weight:600;color:${a.daysLeft <= 0 ? '#dc2626' : a.daysLeft <= 7 ? '#ea580c' : '#d97706'}">
        ${a.daysLeft <= 0 ? 'Expiré' : `J-${a.daysLeft}`}
      </td>
    </tr>`
    )
    .join('')

  const html = `
  <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;color:#111827">
    <div style="background:#4f46e5;padding:24px;border-radius:12px 12px 0 0">
      <h1 style="color:white;margin:0;font-size:20px">🛡️ ExpiryGuard</h1>
    </div>
    <div style="background:#ffffff;padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
      <p style="font-size:16px;font-weight:600;margin-top:0">Bonjour ${agencyName},</p>
      <p style="color:#6b7280">Les actifs suivants nécessitent votre attention :</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px">
        <thead>
          <tr style="background:#f9fafb;color:#6b7280;font-size:12px;text-transform:uppercase">
            <th style="padding:8px 12px;text-align:left">Nom</th>
            <th style="padding:8px 12px;text-align:left">Type</th>
            <th style="padding:8px 12px;text-align:left">Expiration</th>
            <th style="padding:8px 12px;text-align:left">Délai</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <a href="${process.env.FRONTEND_URL}" style="display:inline-block;background:#4f46e5;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600;margin-top:8px">
        Voir le tableau de bord →
      </a>
      <p style="color:#9ca3af;font-size:12px;margin-top:24px">
        Cet email a été envoyé automatiquement par ExpiryGuard.
        Ne pas répondre à cet email.
      </p>
    </div>
  </div>`

  const { data, error } = await resend.emails.send({
    from: FROM,
    to,
    subject,
    html,
  })

  if (error) {
    console.error(`[email] Échec envoi à ${to}:`, error)
    return false
  }

  console.log(`[email] Alerte envoyée à ${to} (id: ${data.id})`)
  return true
}
