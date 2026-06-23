import { Router } from 'express'
import { supabase } from '../supabase.js'

const router = Router()

// GET /api/tenants
router.get('/', async (_req, res) => {
  const { data, error } = await supabase.from('tenants').select('*').order('name')
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// POST /api/tenants
router.post('/', async (req, res) => {
  const { name, email } = req.body
  if (!name || !email) return res.status(400).json({ error: 'name et email sont requis' })
  const { data, error } = await supabase
    .from('tenants')
    .insert({ name, email })
    .select()
    .single()
  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data)
})

// DELETE /api/tenants/:id
router.delete('/:id', async (req, res) => {
  const { error } = await supabase.from('tenants').delete().eq('id', req.params.id)
  if (error) return res.status(500).json({ error: error.message })
  res.status(204).end()
})

export default router
