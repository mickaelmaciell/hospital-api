import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
const prisma = new PrismaClient()

async function run() {
  const passAt = await bcrypt.hash('atendente123', 10)
  const passMe = await bcrypt.hash('medico123', 10)

  // atendente
  const userAt = await prisma.user.upsert({
    where: { email: 'atendente@alphamed.com' },
    update: {},
    create: { nome: 'Atendente', email: 'atendente@alphamed.com', senha: passAt, role: 'ATENDENTE' }
  })
  await prisma.atendente.upsert({
    where: { userId: userAt.id },
    update: {},
    create: { userId: userAt.id }
  })

  // médico
  const userMe = await prisma.user.upsert({
    where: { email: 'medico@alphamed.com' },
    update: {},
    create: { nome: 'Dr. House', email: 'medico@alphamed.com', senha: passMe, role: 'MEDICO' }
  })
  await prisma.medico.upsert({
    where: { userId: userMe.id },
    update: {},
    create: { userId: userMe.id, especialidade: 'Clínico Geral' }
  })

  console.log('Seed OK')
}

run().finally(() => prisma.$disconnect())
