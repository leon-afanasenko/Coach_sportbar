import sgMail from "@sendgrid/mail"
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export async function sendPrizeEmail({ to, qrPng, match, uuid }) {
  return sgMail.send({
    to,
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
}