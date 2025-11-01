"use client"

import { useNavigate } from "react-router-dom"

const UnauthorizedPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">403</h1>
        <p className="text-xl text-gray-600 mb-8">Bạn không có quyền truy cập trang này</p>
        <button onClick={() => navigate("/")} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
          Quay lại trang chủ
        </button>
      </div>
    </div>
  )
}

export default UnauthorizedPage
