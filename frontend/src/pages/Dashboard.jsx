import { useEffect, useState } from "react"

export default function Dashboard({ token, role }) {
  const [matches, setMatches] = useState([])
  const [myWinnings, setMyWinnings] = useState([])
  const [filter, setFilter] = useState("")
  const [msg, setMsg] = useState("")

  useEffect(() => {
    fetch("http://localhost:3001/api/match", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json()).then(setMatches)
    fetchWinnings()
  }, [token])

  const fetchWinnings = () => {
    fetch("http://localhost:3001/api/winnings" + (filter ? `?status=${filter}` : ""), {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json()).then(setMyWinnings)
  }

  const predict = async (matchId) => {
    const homeScore = Number(prompt("Счет хозяев?"))
    const awayScore = Number(prompt("Счет гостей?"))
    if (isNaN(homeScore) || isNaN(awayScore)) return
    const res = await fetch("http://localhost:3001/api/prediction", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ matchId, homeScore, awayScore })
    })
    const data = await res.json()
    setMsg(data.error ? data.error : "Ставка принята!")
  }

  return (
    <div>
      <h2>Активные матчи</h2>
      {matches.map(m => (
        <div key={m.id}>
          <b>{m.homeTeam} — {m.awayTeam}</b> | начало: {new Date(m.startAt).toLocaleString()}
          <button onClick={() => predict(m.id)}>Сделать прогноз</button>
        </div>
      ))}
      <hr/>
      <h2>Мои выигрыши</h2>
      <button onClick={() => {setFilter(""); fetchWinnings()}}>Все</button>
      <button onClick={() => {setFilter("ACTIVE"); fetchWinnings()}}>Активные</button>
      <button onClick={() => {setFilter("REDEEMED"); fetchWinnings()}}>Погашенные</button>
      {myWinnings.map(w => (
        <div key={w.uuid} style={{margin:"1em 0", border:"1px solid #ccc", padding:"1em"}}>
          <b>{w.match.homeTeam} — {w.match.awayTeam}</b> | {w.status} <br/>
          UUID: {w.uuid} <br/>
          {w.status === "ACTIVE" && (
            <img src={`https://api.qrserver.com/v1/create-qr-code/?data=${w.uuid}&size=100x100`} alt="qr"/>
          )}
          {w.status === "REDEEMED" && w.redeemedAt && (
            <span>Погашен: {new Date(w.redeemedAt).toLocaleString()}</span>
          )}
        </div>
      ))}
      {msg && <div>{msg}</div>}
    </div>
  )
}