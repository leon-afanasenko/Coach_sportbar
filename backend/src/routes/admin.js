import express from "express"
import { PrismaClient } from "@prisma/client"
import { auth } from "../middleware/auth.js"
import { isAdmin } from "../middleware/isAdmin.js"
import { v4 as uuidv4 } from "uuid"
import QRCode from "qrcode"
import sgMail from "@sendgrid/mail"

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const prisma = new PrismaClient()
const router = express.Router()

// Завершить матч, определить победителей, разослать письма с QR
router.post("/close-match", auth, isAdmin, async (req, res) => {
  const { matchId, finalHome, finalAway } = req.body
  const match = await prisma.match.update({
    where: { id: matchId },
    data: { finalHome, finalAway, status: "FINISHED" }
  })

  const winners = await prisma.prediction.findMany({
    where: { matchId, homeScore: finalHome, awayScore: finalAway },
    orderBy: { createdAt: "asc" }
  })
  const winners20 = winners.slice(0, 20)
  const results = []

  for (const pred of winners20) {
    const uuid = uuidv4()
    const qrPng = await QRCode.toBuffer(uuid)
    await prisma.winning.create({
      data: {
        userId: pred.userId,
        matchId,
        uuid,
        status: "ACTIVE"
      }
    })
    // Send email
    const user = await prisma.user.findUnique({ where: { id: pred.userId } })
    await sgMail.send({
      to: user.email,
      from: process.env.FROM_EMAIL,
      subject: `🎉 Вы выиграли приз! Матч: ${match.homeTeam} — ${match.awayTeam}`,
      html: `<h2>Поздравляем!</h2>
<p>Вы угадали счет матча <b>${match.homeTeam} — ${match.awayTeam}</b>!<br/>
Ваш уникальный QR-код для получения приза:<br/></p>
<img src="cid:qr" /><br/>
<b>UUID:</b> ${uuid}
<p>Покажите этот QR-код сотруднику для получения приза.</p>`,
      attachments: [{
        content: qrPng.toString("base64"),
        filename: "prize-qr.png",
        type: "image/png",
        disposition: "inline",
        content_id: "qr"
      }]
    })
    results.push({ userId: pred.userId, uuid })
  }

  res.json({ match, winners: results })
})

// Верификация QR (uuid)
router.post("/verify", auth, isAdmin, async (req, res) => {
  const { uuid } = req.body
  const winning = await prisma.winning.findUnique({ where: { uuid } })
  if (!winning) return res.status(404).json({ error: "Недействительный QR-код!" })

  if (winning.status === "REDEEMED")
    return res.status(400).json({ error: "Этот приз уже был использован!" })

  const updated = await prisma.winning.update({
    where: { uuid },
    data: {
      status: "REDEEMED",
      redeemedAt: new Date(),
      verifiedBy: req.user.userId
    }
  })
  res.json({ message: "Приз успешно выдан!", winning: updated })
})

export default router