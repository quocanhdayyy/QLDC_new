"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

const LoginPage = () => {
  const [email, setEmail] = useState("leader@example.com")
  const [password, setPassword] = useState("password")
  const [role, setRole] = useState("leader")
  const [error, setError] = useState("")
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Vui lòng nhập email và mật khẩu")
      return
    }

    try {
      login(email, password, role)
      navigate(role === "leader" ? "/leader/dashboard" : "/citizen/dashboard")
    } catch (err) {
      setError("Đăng nhập thất bại")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Quản Lý Dân Cư</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Vai trò</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="leader">Tổ trưởng</option>
              <option value="citizen">Công dân</option>
            </select>
          </div>

          {error && <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
          >
            Đăng nhập
          </button>
        </form>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
          <p className="font-semibold mb-2">Demo Credentials:</p>
          <p>Leader: leader@example.com / password</p>
          <p>Citizen: citizen@example.com / password</p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
