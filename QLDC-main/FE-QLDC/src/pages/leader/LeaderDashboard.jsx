"use client"

import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"

const LeaderDashboard = () => {
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
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Tổ Trưởng</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{user?.email}</span>
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
              Đăng xuất
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Quick Links */}
          <div
            onClick={() => navigate("/leader/households")}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg cursor-pointer transition"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-2">Quản Lý Hộ Khẩu</h2>
            <p className="text-gray-600">Xem và quản lý danh sách hộ khẩu</p>
          </div>

          <div
            onClick={() => navigate("/leader/citizens")}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg cursor-pointer transition"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-2">Quản Lý Công Dân</h2>
            <p className="text-gray-600">Xem và quản lý thông tin công dân</p>
          </div>

          <div
            onClick={() => navigate("/leader/edit-requests")}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg cursor-pointer transition"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-2">Yêu Cầu Chỉnh Sửa</h2>
            <p className="text-gray-600">Duyệt các yêu cầu chỉnh sửa thông tin</p>
          </div>

          <div
            onClick={() => navigate("/leader/reward-proposals")}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg cursor-pointer transition"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-2">Đề Xuất Khen Thưởng</h2>
            <p className="text-gray-600">Duyệt các đề xuất khen thưởng</p>
          </div>

          <div
            onClick={() => navigate("/leader/audit-logs")}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg cursor-pointer transition"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-2">Nhật Ký Kiểm Toán</h2>
            <p className="text-gray-600">Xem lịch sử hoạt động hệ thống</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeaderDashboard
