import express from "express"
import { PrismaClient } from "@prisma/client"
import { auth } from "../middleware/auth.js"

const prisma = new PrismaClient()
const router = express.Router()

// Get my winnings (optionally filter by status)
router.get("/", auth, async (req, res) => {
  const { status } = req.query
  const where = { userId: req.user.userId }
  if (status) where.status = status
  const winnings = await prisma.winning.findMany({
    where,
    include: { match: true },
    orderBy: { createdAt: "desc" }
  })
  res.json(winnings)
})

export default router