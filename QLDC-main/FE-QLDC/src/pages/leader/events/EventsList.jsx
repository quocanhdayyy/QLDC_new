"use client"

import { useState, useEffect } from 'react'
import eventService from '../../../services/eventService'
import { useNavigate } from 'react-router-dom'

export default function EventsList() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetch()
  }, [])

  const fetch = async () => {
    setLoading(true)
    try {
      const res = await eventService.getAll({});
      setEvents(res.docs || res)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleOpen = async (id) => {
    await eventService.open(id)
    fetch()
  }

  const handleClose = async (id) => {
    await eventService.close(id)
    fetch()
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Quản lý sự kiện</h1>
        <div>
          <button onClick={() => navigate('/leader/events/add')} className="btn btn-primary">
            Tạo sự kiện
          </button>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="text-left">
              <th className="p-2">Tên</th>
              <th className="p-2">Loại</th>
              <th className="p-2">Thời gian</th>
              <th className="p-2">Slot</th>
              <th className="p-2">Trạng thái</th>
              <th className="p-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {events.map((ev) => (
              <tr key={ev._id} className="border-t">
                <td className="p-2">{ev.name}</td>
                <td className="p-2">{ev.type}</td>
                <td className="p-2">{new Date(ev.startDate).toLocaleString()} - {new Date(ev.endDate).toLocaleString()}</td>
                <td className="p-2">{ev.slotsTaken}/{ev.maxSlots}</td>
                <td className="p-2">{ev.status}</td>
                <td className="p-2 space-x-2">
                  <button onClick={() => navigate(`/leader/events/${ev._id}`)} className="px-2 py-1 bg-gray-200 rounded">Xem</button>
                  <button onClick={() => navigate(`/leader/events/${ev._id}/registrations`)} className="px-2 py-1 bg-blue-200 rounded">Đăng ký</button>
                  {ev.status !== 'OPEN' && <button onClick={() => handleOpen(ev._id)} className="px-2 py-1 bg-green-200 rounded">Mở</button>}
                  {ev.status === 'OPEN' && <button onClick={() => handleClose(ev._id)} className="px-2 py-1 bg-red-200 rounded">Đóng</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
