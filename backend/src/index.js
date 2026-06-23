import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cron from 'node-cron'

import assetsRouter from './routes/assets.js'
import tenantsRouter from './routes/tenants.js'
import authRouter from './routes/auth.js'
import { runCheckExpiries } from './jobs/checkExpiries.js'

const app = express()
const PORT = process.env.PORT || 3001

// --- Middleware ---
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }))
app.use(express.json())

// --- Routes API ---
app.use('/api/auth', authRouter)
app.use('/api/assets', assetsRouter)
app.use('/api/tenants', tenantsRouter)

app.get('/api/health', (_req, res) => res.json({ status: 'ok', ts: new Date().toISOString() }))

// --- Cron : vérification chaque nuit à 03:00 ---
cron.schedule('0 3 * * *', () => {
  console.log('[cron] Démarrage de la vérification des expirations...')
  runCheckExpiries()
}, { timezone: 'Europe/Paris' })

app.listen(PORT, () => {
  console.log(`ExpiryGuard API démarrée sur http://localhost:${PORT}`)
})
