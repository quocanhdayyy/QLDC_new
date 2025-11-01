"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import eventService from '../../../services/eventService'

export default function Registrations() {
  const { id } = useParams()
  const [regs, setRegs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { if (id) fetch() }, [id])

  const fetch = async () => {
    setLoading(true)
    try {
      const data = await eventService.getRegistrations(id)
      setRegs(data)
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  const handleMarkGiven = async (registrationId) => {
    try {
      await eventService.markGiven(id, registrationId)
      fetch()
    } catch (err) { alert('Lỗi: ' + (err.response?.data?.message || err.message)) }
  }

  const handleExport = async () => {
    try {
      const blob = await eventService.exportRegistrationsCsv(id)
      const url = window.URL.createObjectURL(new Blob([blob]))
      const a = document.createElement('a')
      a.href = url
      a.download = `registrations-${id}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (err) { console.error(err); alert('Export failed') }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Danh sách đăng ký</h1>
        <div>
          <button onClick={handleExport} className="px-3 py-1 bg-blue-600 text-white rounded">Xuất CSV</button>
        </div>
      </div>
      {loading ? <div>Loading...</div> : (
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th>STT</th>
              <th>Họ tên</th>
              <th>CMND</th>
              <th>Hộ khẩu</th>
              <th>Thời gian</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {regs.map((r, i) => (
              <tr key={r._id} className="border-t">
                <td className="p-2">{i+1}</td>
                <td className="p-2">{r.citizenName}</td>
                <td className="p-2">{r.nationalId}</td>
                <td className="p-2">{r.household}</td>
                <td className="p-2">{new Date(r.registeredAt).toLocaleString()}</td>
                <td className="p-2">{r.status}</td>
                <td className="p-2">{r.status !== 'GIVEN' && <button onClick={() => handleMarkGiven(r._id)} className="px-2 py-1 bg-green-200 rounded">Đã phát</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
