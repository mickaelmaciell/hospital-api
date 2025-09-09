import { Router } from 'express'
import { prisma } from '../prisma.js'
import { requireAuth } from '../middleware/auth.js'
import { requireRole } from '../middleware/rbac.js'
const r = Router()

r.use(requireAuth)

// iniciar — médico seleciona paciente
r.post('/iniciar', requireRole('MEDICO'), async (req, res) => {
  const { pacienteId } = req.body
  const enc = await prisma.encounter.create({
    data: { pacienteId, medicoId: req.user.id, status: 'EM_ATENDIMENTO' }
  })
  await prisma.paciente.update({ where: { id: pacienteId }, data: { status: 'EM_ATENDIMENTO' } })
  res.status(201).json(enc)
})

// finalizar
r.post('/finalizar/:id', requireRole('MEDICO'), async (req, res) => {
  const { id } = req.params
  const dados = req.body
  const enc = await prisma.encounter.update({
    where: { id: +id },
    data: { ...dados, horaFim: new Date(), status: 'CONCLUIDO' }
  })
  await prisma.paciente.update({ where: { id: enc.pacienteId }, data: { status: 'CONCLUIDO' } })
  res.json(enc)
})

// histórico
r.get('/historico', async (req, res) => {
  const { nome, de, ate, status } = req.query
  const where = {
    ...(status ? { status } : {}),
    ...(de || ate
      ? { horaInicio: { gte: de ? new Date(String(de)) : undefined, lte: ate ? new Date(String(ate)) : undefined } }
      : {})
  }
  const enc = await prisma.encounter.findMany({
    where,
    include: { paciente: true, medico: true },
    orderBy: { horaInicio: 'desc' }
  })
  const data = nome ? enc.filter(e => e.paciente.nome.toLowerCase().includes(String(nome).toLowerCase())) : enc
  res.json(data)
})

export default r
