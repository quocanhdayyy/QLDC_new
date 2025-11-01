"use client"

import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

const RewardProposalReview = () => {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/leader/dashboard")} className="text-blue-600 hover:text-blue-800">
              ← Quay lại
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Duyệt Đề Xuất Khen Thưởng</h1>
          </div>
          <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
            Đăng xuất
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Danh Sách Đề Xuất Khen Thưởng</h2>
          <p className="text-gray-600">Danh sách đề xuất sẽ được hiển thị tại đây</p>
        </div>
      </div>
    </div>
  )
}

export default RewardProposalReview
