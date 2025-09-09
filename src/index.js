import express from 'express'
import cors from 'cors'
import 'dotenv/config'

import authRoutes from './routes/auth.routes.js'
import pacientesRoutes from './routes/pacientes.routes.js'
import medicosRoutes from './routes/medicos.routes.js'
import atendimentosRoutes from './routes/atendimentos.routes.js'
import relatoriosRoutes from './routes/relatorios.routes.js'

const app = express()
app.use(cors())
app.use(express.json())

app.use('/auth', authRoutes)
app.use('/pacientes', pacientesRoutes)
app.use('/medicos', medicosRoutes)
app.use('/atendimentos', atendimentosRoutes)
app.use('/relatorios', relatoriosRoutes)

export default app

