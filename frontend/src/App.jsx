import { useEffect, useState } from "react"
import { Routes, Route, Link, useNavigate } from "react-router-dom"
import AuthPage from "./pages/AuthPage"
import Dashboard from "./pages/Dashboard"
import AdminPage from "./pages/AdminPage"
import VerifyPrize from "./pages/VerifyPrize"

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"))
  const [role, setRole] = useState(localStorage.getItem("role"))
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) navigate("/auth")
  }, [token])

  const logout = () => {
    localStorage.clear()
    setToken("")
    setRole("")
    navigate("/auth")
  }

  return (
    <div>
      <nav>
        <Link to="/">Личный кабинет</Link>{" "}
        {role === "ADMIN" && <Link to="/admin">Админка</Link>}{" "}
        {role === "ADMIN" && <Link to="/verify">Верификация QR</Link>}{" "}
        {token && <button onClick={logout}>Выйти</button>}
      </nav>
      <Routes>
        <Route path="/auth" element={<AuthPage setToken={setToken} setRole={setRole}/>} />
        <Route path="/" element={<Dashboard token={token} role={role} />} />
        <Route path="/admin" element={<AdminPage token={token} />} />
        <Route path="/verify" element={<VerifyPrize token={token}/>} />
      </Routes>
    </div>
  )
}