"use client"

import { useState, useEffect } from 'react'
import eventService from '../../../services/eventService'

export default function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetch() }, [])

  const fetch = async () => {
    setLoading(true)
    try {
      // fetch open events only
      const res = await eventService.getAll({ status: 'OPEN' })
      setEvents(res.docs || res)
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  const handleRegister = async (id) => {
    try {
      await eventService.register(id, { citizenName: 'Người dùng' })
      alert('Đăng ký thành công')
      fetch()
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Đăng ký thất bại')
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Sự kiện mở</h1>
      {loading ? <div>Loading...</div> : (
        <div className="grid gap-4">
          {events.map(ev => (
            <div key={ev._id} className="p-4 border rounded">
              <div className="flex justify-between">
                <div>
                  <h2 className="font-semibold">{ev.name}</h2>
                  <p className="text-sm text-muted">{ev.type} • {new Date(ev.startDate).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p>Slots: {ev.slotsTaken}/{ev.maxSlots}</p>
                  <button onClick={() => handleRegister(ev._id)} className="mt-2 px-3 py-1 bg-primary text-white rounded">Đăng ký ngay</button>
                </div>
              </div>
              <div className="mt-2 text-sm">Điều kiện: {JSON.stringify(ev.conditions || {})}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
