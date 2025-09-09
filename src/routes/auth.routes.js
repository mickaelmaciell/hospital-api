import { Router } from 'express'
import { prisma } from '../prisma.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
const r = Router()

r.post('/register', async (req, res) => {
  const { nome, email, senha, role, especialidade } = req.body
  const hash = await bcrypt.hash(senha, 10)
  const user = await prisma.user.create({ data: { nome, email, senha: hash, role } })
  if (role === 'MEDICO') {
    await prisma.medico.create({ data: { userId: user.id, especialidade: especialidade || 'Clínico' } })
  } else if (role === 'ATENDENTE') {
    await prisma.atendente.create({ data: { userId: user.id } })
  }
  res.status(201).json({ id: user.id })
})

r.post('/login', async (req, res) => {
  const { email, senha } = req.body
  const u = await prisma.user.findUnique({ where: { email } })
  if (!u || !(await bcrypt.compare(senha, u.senha))) return res.status(401).json({ error: 'credenciais inválidas' })
  const token = jwt.sign({ id: u.id, role: u.role, nome: u.nome }, process.env.JWT_SECRET, { expiresIn: '8h' })
  res.json({ token, user: { id: u.id, nome: u.nome, role: u.role } })
})

export default r
