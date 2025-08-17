import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import authRoutes from './routes/auth.js'
import matchRoutes from './routes/match.js'
import predictionRoutes from './routes/prediction.js'
import winningsRoutes from './routes/winnings.js'
import adminRoutes from './routes/admin.js'

const app = express()
const prisma = new PrismaClient()

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/match', matchRoutes)
app.use('/api/prediction', predictionRoutes)
app.use('/api/winnings', winningsRoutes)
app.use('/api/admin', adminRoutes)

app.get('/api/health', (_, res) => res.json({ status: 'ok' }))

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(process.env.PORT, () => {
  console.log(`Server started at http://localhost:${process.env.PORT}`)
})