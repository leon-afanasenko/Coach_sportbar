import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const router = express.Router()
const prisma = new PrismaClient()

router.post('/register', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' })
  if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) return res.status(400).json({ error: 'Invalid email' })
  if (password.length < 6) return res.status(400).json({ error: 'Password too short' })

  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists) return res.status(400).json({ error: 'Email already registered' })

  const hash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { email, password: hash }
  })

  const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' })
  res.json({ token, role: user.role })
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return res.status(401).json({ error: 'Invalid credentials' })
  const valid = await bcrypt.compare(password, user.password)
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' })

  const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' })
  res.json({ token, role: user.role })
})

export default router