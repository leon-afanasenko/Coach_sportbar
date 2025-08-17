import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function AuthPage({ setToken, setRole }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLogin, setIsLogin] = useState(true)
  const navigate = useNavigate()

  const submit = async () => {
    const url = `http://localhost:3001/api/auth/${isLogin ? "login" : "register"}`
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json()
    if (data.token) {
      localStorage.setItem("token", data.token)
      localStorage.setItem("role", data.role)
      setToken(data.token)
      setRole(data.role)
      navigate("/")
    } else alert(data.error)
  }

  return (
    <div>
      <h2>{isLogin ? "Вход" : "Регистрация"}</h2>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}/><br/>
      <input placeholder="Пароль" type="password" value={password} onChange={e => setPassword(e.target.value)}/><br/>
      <button onClick={submit}>{isLogin ? "Войти" : "Зарегистрироваться"}</button>
      <br/>
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Нет аккаунта? Регистрация" : "Уже есть аккаунт? Вход"}
      </button>
    </div>
  )
}