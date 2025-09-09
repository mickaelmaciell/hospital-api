import { Router } from 'express'
import { prisma } from '../prisma.js'
import { requireAuth } from '../middleware/auth.js'
import { requireRole } from '../middleware/rbac.js'
const r = Router()

r.use(requireAuth)

// cadastrar (ATENDENTE)
r.post('/', requireRole('ATENDENTE'), async (req, res) => {
  const { nome, motivo, prioridade } = req.body
  const p = await prisma.paciente.create({
    data: { nome, motivo: motivo || null, prioridade: prioridade || null }
  })
  res.status(201).json(p)
})

// fila por prioridade
r.get('/fila', async (_req, res) => {
  const order = { ALTA: 3, MEDIA: 2, BAIXA: 1 }
  const pacientes = await prisma.paciente.findMany({
    where: { OR: [{ status: 'TRIADO' }, { status: 'AGUARDANDO' }] },
    include: { triage: true },
    orderBy: [{ dataCadastro: 'asc' }]
  })
  const sorted = pacientes.sort((a, b) => (order[b.prioridade || 'BAIXA'] - order[a.prioridade || 'BAIXA']))
  res.json(sorted)
})

// alterar status
r.patch('/:id/status', async (req, res) => {
  const { id } = req.params
  const { status } = req.body
  const p = await prisma.paciente.update({ where: { id: +id }, data: { status } })
  res.json(p)
})

export default r
