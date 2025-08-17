import { useState } from "react"

export default function VerifyPrize({ token }) {
  const [uuid, setUuid] = useState("")
  const [result, setResult] = useState("")

  const verify = async () => {
    const res = await fetch("http://localhost:3001/api/admin/verify", {
      method: "POST",
      headers: { "Content-Type":"application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ uuid })
    })
    const data = await res.json()
    setResult(data.error || data.message)
  }

  return (
    <div>
      <h2>Верификация выигрыша по QR/UUID</h2>
      <input value={uuid} onChange={e=>setUuid(e.target.value)} placeholder="Вставьте UUID с QR"/>
      <button onClick={verify}>Проверить</button>
      {result && <div>{result}</div>}
    </div>
  )
}