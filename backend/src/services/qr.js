import QRCode from "qrcode"

export async function generateQR(text) {
  return await QRCode.toBuffer(text)
}