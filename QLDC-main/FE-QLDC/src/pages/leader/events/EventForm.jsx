"use client"

import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import eventService from '../../../services/eventService'

export default function EventForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    type: 'SPECIAL',
    startDate: '',
    endDate: '',
    maxSlots: 1,
    recurringAnnual: false,
    notifyOnOpen: false,
    conditions: '{}',
  })

  useEffect(() => {
    if (id) load()
  }, [id])

  const load = async () => {
    try {
      const data = await eventService.getById(id)
      setForm({
        name: data.name || '',
        type: data.type || 'SPECIAL',
        startDate: data.startDate ? new Date(data.startDate).toISOString().slice(0,16) : '',
        endDate: data.endDate ? new Date(data.endDate).toISOString().slice(0,16) : '',
        maxSlots: data.maxSlots || 1,
        recurringAnnual: data.recurringAnnual || false,
        notifyOnOpen: data.notifyOnOpen || false,
        conditions: JSON.stringify(data.conditions || {}, null, 2),
      })
    } catch (err) { console.error(err) }
  }

  const handleChange = (key, value) => setForm(prev => ({ ...prev, [key]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        name: form.name,
        type: form.type,
        startDate: new Date(form.startDate),
        endDate: new Date(form.endDate),
        maxSlots: Number(form.maxSlots),
        recurringAnnual: !!form.recurringAnnual,
        notifyOnOpen: !!form.notifyOnOpen,
        conditions: JSON.parse(form.conditions || '{}'),
      }
      if (id) {
        await eventService.update(id, payload)
      } else {
        await eventService.create(payload)
      }
      navigate('/leader/events')
    } catch (err) {
      alert(err.message || 'Lỗi khi lưu sự kiện')
    } finally { setLoading(false) }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{id ? 'Chỉnh sửa sự kiện' : 'Tạo sự kiện'}</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div>
          <label className="block text-sm">Tên sự kiện</label>
          <input value={form.name} onChange={e => handleChange('name', e.target.value)} className="w-full border rounded p-2" required />
        </div>
        <div>
          <label className="block text-sm">Loại</label>
          <select value={form.type} onChange={e => handleChange('type', e.target.value)} className="w-full border rounded p-2">
            <option value="ANNUAL">Thường niên</option>
            <option value="SPECIAL">Đặc biệt</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm">Bắt đầu</label>
            <input type="datetime-local" value={form.startDate} onChange={e => handleChange('startDate', e.target.value)} className="w-full border rounded p-2" required />
          </div>
          <div>
            <label className="block text-sm">Kết thúc</label>
            <input type="datetime-local" value={form.endDate} onChange={e => handleChange('endDate', e.target.value)} className="w-full border rounded p-2" required />
          </div>
        </div>
        <div>
          <label className="block text-sm">Số slot tối đa</label>
          <input type="number" min={1} value={form.maxSlots} onChange={e => handleChange('maxSlots', e.target.value)} className="w-32 border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm">Điều kiện (JSON)</label>
          <textarea value={form.conditions} onChange={e => handleChange('conditions', e.target.value)} rows={4} className="w-full border rounded p-2" />
        </div>
        <div className="flex gap-4">
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.recurringAnnual} onChange={e => handleChange('recurringAnnual', e.target.checked)} /> Tự động hàng năm</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.notifyOnOpen} onChange={e => handleChange('notifyOnOpen', e.target.checked)} /> Gửi thông báo khi mở</label>
        </div>
        <div className="flex gap-2">
          <button type="submit" className="px-4 py-2 bg-primary text-white rounded" disabled={loading}>{loading ? 'Đang lưu...' : 'Lưu'}</button>
          <button type="button" onClick={() => navigate('/leader/events')} className="px-4 py-2 border rounded">Hủy</button>
        </div>
      </form>
    </div>
  )
}
