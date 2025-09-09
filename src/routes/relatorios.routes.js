import { Router } from 'express'
import { prisma } from '../prisma.js'
import { requireAuth } from '../middleware/auth.js'
import { toCsv } from '../utils/csv.js'
const r = Router()

r.use(requireAuth)

r.get('/estatisticas', async (_req, res) => {
  const byDoctor = await prisma.encounter.groupBy({ by: ['medicoId'], _count: true })
  const waits = await prisma.encounter.findMany({ include: { paciente: { include: { triage: true } } } })
  const diffs = waits
    .map(w => w.paciente.triage?.completedAt ? (w.horaInicio - w.paciente.triage.completedAt) : null)
    .filter(Boolean)
  const avg = diffs.length ? Math.round(diffs.reduce((a, b) => a + b, 0) / diffs.length / 60000) : 0

  const byPriority = await prisma.triage.groupBy({ by: ['prioridade'], _count: true })

  res.json({
    pacientesPorMedico: byDoctor.map(x => ({ medicoId: x.medicoId, total: x._count })),
    tempoMedioEsperaMin: avg,
    pacientesPorPrioridade: byPriority.map(x => ({ prioridade: x.prioridade, total: x._count }))
  })
})

r.get('/csv', async (_req, res) => {
  const enc = await prisma.encounter.findMany({ include: { paciente: true, medico: true } })
  const rows = enc.map(e => ({
    paciente: e.paciente.nome,
    medicoId: e.medicoId,
    inicio: e.horaInicio.toISOString(),
    fim: e.horaFim ? e.horaFim.toISOString() : '',
    cid10: e.cid10 || '',
    tipo: e.tipo || '',
    status: e.status || ''
  }))
  const csv = toCsv(rows)
  res.header('Content-Type', 'text/csv')
  res.attachment('relatorio.csv')
  res.send(csv)
})

export default r
