import express from "express"
import { PrismaClient } from "@prisma/client"
import { auth } from "../middleware/auth.js"
import { isAdmin } from "../middleware/isAdmin.js"

const prisma = new PrismaClient()
const router = express.Router()

// Get all open matches
router.get("/", auth, async (req, res) => {
  const matches = await prisma.match.findMany({
    where: { status: "OPEN" },
    orderBy: { startAt: "asc" }
  })
  res.json(matches)
})

// Admin: create match
router.post("/", auth, isAdmin, async (req, res) => {
  const { homeTeam, awayTeam, startAt } = req.body
  if (!homeTeam || !awayTeam || !startAt)
    return res.status(400).json({ error: "Missing fields" })
  const match = await prisma.match.create({
    data: { homeTeam, awayTeam, startAt: new Date(startAt) }
  })
  res.json(match)
})

export default router