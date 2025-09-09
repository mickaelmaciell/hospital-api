import { Router } from 'express'
import { prisma } from '../prisma.js'
import { requireAuth } from '../middleware/auth.js'
const r = Router()

r.use(requireAuth)

r.get('/', async (_req, res) => {
  const medicos = await prisma.medico.findMany({ include: { user: true } })
  res.json(medicos.map(m => ({ id: m.id, nome: m.user.nome, email: m.user.email, especialidade: m.especialidade })))
})

export default r
