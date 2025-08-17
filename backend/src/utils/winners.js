// Получить первых 20 победителей по времени ставки, кто угадал счет
export async function getWinners(prisma, matchId, finalHome, finalAway, limit = 20) {
  const predictions = await prisma.prediction.findMany({
    where: { matchId, homeScore: finalHome, awayScore: finalAway },
    orderBy: { createdAt: "asc" }
  })
  return predictions.slice(0, limit)
}