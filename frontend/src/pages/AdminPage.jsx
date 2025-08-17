import { useEffect, useState } from "react"

export default function AdminPage({ token }) {
  const [matches, setMatches] = useState([])
  const [newMatch, setNewMatch] = useState({homeTeam:"",awayTeam:"",startAt:""})
  const [closeData, setCloseData] = useState({matchId:"",finalHome:"",finalAway:""})
  const [msg, setMsg] = useState("")

  useEffect(() => {
    fetch("http://localhost:3001/api/match", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r=>r.json()).then(setMatches)
  }, [token])

  const createMatch = async () => {
    const res = await fetch("http://localhost:3001/api/match", {
      method: "POST",
      headers: { "Content-Type":"application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(newMatch)
    })
    const data = await res.json()
    setMsg(data.error || "Матч создан")
  }

  const closeMatch = async () => {
    const res = await fetch("http://localhost:3001/api/admin/close-match", {
      method: "POST",
      headers: { "Content-Type":"application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        matchId: Number(closeData.matchId),
        finalHome: Number(closeData.finalHome),
        finalAway: Number(closeData.finalAway)
      })
    })
    const data = await res.json()
    setMsg(data.error || "Матч закрыт, победители выбраны")
  }

  return (
    <div>
      <h2>Создать матч</h2>
      <input placeholder="Хозяева" value={newMatch.homeTeam} onChange={e=>setNewMatch({...newMatch,homeTeam:e.target.value})}/>
      <input placeholder="Гости" value={newMatch.awayTeam} onChange={e=>setNewMatch({...newMatch,awayTeam:e.target.value})}/>
      <input type="datetime-local" value={newMatch.startAt} onChange={e=>setNewMatch({...newMatch,startAt:e.target.value})}/>
      <button onClick={createMatch}>Создать матч</button>
      <hr/>
      <h2>Завершить матч и выбрать победителей</h2>
      <select value={closeData.matchId} onChange={e=>setCloseData({...closeData,matchId:e.target.value})}>
        <option value="">Выбрать матч</option>
        {matches.map(m => <option key={m.id} value={m.id}>{m.homeTeam} — {m.awayTeam}</option>)}
      </select>
      <input placeholder="Счет хозяев" value={closeData.finalHome} onChange={e=>setCloseData({...closeData,finalHome:e.target.value})}/>
      <input placeholder="Счет гостей" value={closeData.finalAway} onChange={e=>setCloseData({...closeData,finalAway:e.target.value})}/>
      <button onClick={closeMatch}>Закрыть матч</button>
      {msg && <div>{msg}</div>}
    </div>
  )
}