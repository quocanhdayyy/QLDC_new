"use client"

import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"

const CitizenDashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Công Dân</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{user?.email}</span>
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
              Đăng xuất
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            onClick={() => navigate("/citizen/household")}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg cursor-pointer transition"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-2">Hộ Khẩu Của Tôi</h2>
            <p className="text-gray-600">Xem thông tin hộ khẩu</p>
          </div>

          <div
            onClick={() => navigate("/citizen/submit-edit-request")}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg cursor-pointer transition"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-2">Yêu Cầu Chỉnh Sửa</h2>
            <p className="text-gray-600">Gửi yêu cầu chỉnh sửa thông tin</p>
          </div>

          <div
            onClick={() => navigate("/citizen/submit-reward-proposal")}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg cursor-pointer transition"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-2">Đề Xuất Khen Thưởng</h2>
            <p className="text-gray-600">Gửi đề xuất khen thưởng</p>
          </div>

          <div
            onClick={() => navigate("/citizen/my-requests")}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg cursor-pointer transition"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-2">Yêu Cầu Của Tôi</h2>
            <p className="text-gray-600">Xem lịch sử yêu cầu</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CitizenDashboard
