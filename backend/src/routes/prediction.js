import express from "express"
import { PrismaClient } from "@prisma/client"
import { auth } from "../middleware/auth.js"

const prisma = new PrismaClient()
const router = express.Router()

// Make a prediction
router.post("/", auth, async (req, res) => {
  const { matchId, homeScore, awayScore } = req.body
  if (typeof homeScore !== "number" || typeof awayScore !== "number")
    return res.status(400).json({ error: "Scores must be numbers" })
  const match = await prisma.match.findUnique({ where: { id: matchId } })
  if (!match || match.status !== "OPEN")
    return res.status(400).json({ error: "Invalid match" })
  // Only one prediction per user per match
  const predExists = await prisma.prediction.findFirst({
    where: { matchId, userId: req.user.userId }
  })
  if (predExists) return res.status(400).json({ error: "Already predicted" })
  const pred = await prisma.prediction.create({
    data: {
      matchId,
      userId: req.user.userId,
      homeScore,
      awayScore
    }
  })
  res.json(pred)
})

export default router