import { Router } from 'express'
import { supabase } from '../supabase.js'

const router = Router()

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  const { email, password, agency_name } = req.body
  if (!email || !password || !agency_name) {
    return res.status(400).json({ error: 'email, password et agency_name sont requis' })
  }

  // 1. Créer l'utilisateur Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })
  if (authError) return res.status(400).json({ error: authError.message })

  // 2. Créer le tenant associé
  const { error: tenantError } = await supabase
    .from('tenants')
    .insert({ id: authData.user.id, name: agency_name, email })
  if (tenantError) return res.status(500).json({ error: tenantError.message })

  res.status(201).json({ message: 'Compte créé avec succès', user_id: authData.user.id })
})

// POST /api/auth/login — Supabase gère l'auth côté client,
// cette route est un proxy pratique pour les tests backend.
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return res.status(401).json({ error: error.message })
  res.json({ access_token: data.session.access_token, user: data.user })
})

export default router
