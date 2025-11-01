"use client"

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import eventService from '../../../services/eventService'

export default function EventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { if (id) fetch() }, [id])

  const fetch = async () => {
    setLoading(true)
    try {
      const data = await eventService.getById(id)
      setEvent(data)
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  const handleOpen = async () => {
    try { await eventService.open(id); fetch() } catch (err) { alert('Failed to open') }
  }
  const handleClose = async () => {
    try { await eventService.close(id); fetch() } catch (err) { alert('Failed to close') }
  }

  if (loading) return <div className="p-6">Loading...</div>
  if (!event) return <div className="p-6">Not found</div>

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{event.name}</h1>
        <div className="space-x-2">
          <button onClick={() => navigate(`/leader/events/${id}/registrations`)} className="px-3 py-1 bg-blue-600 text-white rounded">Đăng ký</button>
          <button onClick={() => navigate(`/leader/events/${id}/edit`)} className="px-3 py-1 border rounded">Chỉnh sửa</button>
          {event.status !== 'OPEN' ? (
            <button onClick={handleOpen} className="px-3 py-1 bg-green-600 text-white rounded">Mở đăng ký</button>
          ) : (
            <button onClick={handleClose} className="px-3 py-1 bg-red-600 text-white rounded">Đóng sớm</button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 border rounded">
          <p><strong>Loại:</strong> {event.type}</p>
          <p><strong>Thời gian:</strong> {new Date(event.startDate).toLocaleString()} - {new Date(event.endDate).toLocaleString()}</p>
          <p><strong>Slot:</strong> {event.slotsTaken}/{event.maxSlots}</p>
          <p><strong>Trạng thái:</strong> {event.status}</p>
        </div>
        <div className="p-4 border rounded">
          <p><strong>Điều kiện:</strong></p>
          <pre className="text-sm mt-2">{JSON.stringify(event.conditions || {}, null, 2)}</pre>
        </div>
      </div>
    </div>
  )
}
