import { Router } from 'express'
import { supabase } from '../supabase.js'

const router = Router()

// GET /api/assets — liste tous les actifs (filtre par tenant si query param)
router.get('/', async (req, res) => {
  const { tenant_id } = req.query
  let query = supabase.from('assets').select('*').order('expiry_date', { ascending: true })
  if (tenant_id) query = query.eq('tenant_id', tenant_id)

  const { data, error } = await query
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// GET /api/assets/:id
router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('assets')
    .select('*')
    .eq('id', req.params.id)
    .single()
  if (error) return res.status(404).json({ error: 'Actif introuvable' })
  res.json(data)
})

// POST /api/assets — créer un actif
router.post('/', async (req, res) => {
  const { type, name, tenant_id, expiry_date, meta } = req.body
  if (!type || !name || !tenant_id || !expiry_date) {
    return res.status(400).json({ error: 'type, name, tenant_id et expiry_date sont requis' })
  }
  const { data, error } = await supabase
    .from('assets')
    .insert({ type, name, tenant_id, expiry_date, meta: meta || {} })
    .select()
    .single()
  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data)
})

// PUT /api/assets/:id — mettre à jour (ex: renouvellement)
router.put('/:id', async (req, res) => {
  const { expiry_date, meta } = req.body
  const { data, error } = await supabase
    .from('assets')
    .update({ expiry_date, meta, updated_at: new Date().toISOString() })
    .eq('id', req.params.id)
    .select()
    .single()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// DELETE /api/assets/:id
router.delete('/:id', async (req, res) => {
  const { error } = await supabase.from('assets').delete().eq('id', req.params.id)
  if (error) return res.status(500).json({ error: error.message })
  res.status(204).end()
})

export default router
