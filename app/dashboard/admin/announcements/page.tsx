'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Announcement {
  id: string
  title: string
  body: string
  target: string
  isPinned: boolean
  isUrgent: boolean
  createdAt: string
  expiresAt: string | null
  author: {
    staffProfile: { fullName: string } | null
    email: string
  }
}

export default function AnnouncementsPage() {
  const router = useRouter()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showForm, setShowForm] = useState(false)

  const [form, setForm] = useState({
    title: '',
    body: '',
    target: 'ALL_STAFF',
    isPinned: false,
    isUrgent: false,
    expiresAt: '',
    authorId: 'admin-id',
  })

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/announcements')
      const data = await res.json()
      setAnnouncements(data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          body: form.body,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to create announcement')
        setSubmitting(false)
        return
      }

      setSuccess('Announcement published successfully!')
      setShowForm(false)
      setForm({
        title: '', body: '', target: 'ALL_STAFF',
        isPinned: false, isUrgent: false, expiresAt: '',
        authorId: 'admin-id',
      })
      fetchAnnouncements()
    } catch (err) {
      setError('Something went wrong')
    }
    setSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-green-800 text-white px-6 py-4 flex items-center justify-between">
        <div>
          <p className="font-bold">Katsina LGEA</p>
          <p className="text-green-200 text-xs">Staff Management & Monitoring System</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/dashboard/admin')} className="bg-green-700 px-3 py-1.5 rounded text-sm">← Back</button>
          <button onClick={() => router.push('/login')} className="bg-green-700 px-3 py-1.5 rounded text-sm">Logout</button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Announcements</h1>
            <p className="text-gray-500 text-sm mt-1">Broadcast messages to all staff</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            {showForm ? '✕ Cancel' : '+ New Announcement'}
          </button>
        </div>

        {/* Create Form */}
        {showForm && (
          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
            <h2 className="font-semibold text-gray-700 mb-4">📢 New Announcement</h2>
            {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="space-y-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input value={form.title}
                    onChange={(e) => setForm({...form, title: e.target.value})}
                    required placeholder="Announcement title"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                  <textarea value={form.body}
                    onChange={(e) => setForm({...form, body: e.target.value})}
                    required rows={5} placeholder="Write your announcement here..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience *</label>
                    <select value={form.target}
                      onChange={(e) => setForm({...form, target: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                      <option value="ALL_STAFF">All Staff</option>
                      <option value="TEACHERS_ONLY">Teachers Only</option>
                      <option value="LEA_ADMIN_ONLY">LEA Admin Only</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expires On</label>
                    <input type="date" value={form.expiresAt}
                      onChange={(e) => setForm({...form, expiresAt: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isPinned}
                      onChange={(e) => setForm({...form, isPinned: e.target.checked})}
                      className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-700">📌 Pin this announcement</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isUrgent}
                      onChange={(e) => setForm({...form, isUrgent: e.target.checked})}
                      className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-gray-700">🚨 Mark as urgent</span>
                  </label>
                </div>
              </div>
              <button type="submit" disabled={submitting}
                className="bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-6 rounded-lg disabled:opacity-50">
                {submitting ? 'Publishing...' : '📢 Publish Announcement'}
              </button>
            </form>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">{success}</div>
        )}

        {/* Announcements List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-3xl mb-2">⏳</p>
              <p>Loading...</p>
            </div>
          ) : announcements.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl text-center py-12 text-gray-400">
              <p className="text-3xl mb-2">📭</p>
              <p className="text-sm">No announcements yet</p>
            </div>
          ) : (
            announcements.map((a) => (
              <div key={a.id} className={`bg-white border rounded-xl p-5 ${a.isUrgent ? 'border-red-300' : a.isPinned ? 'border-green-300' : 'border-gray-200'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {a.isPinned && <span className="text-sm">📌</span>}
                    {a.isUrgent && <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-medium">🚨 URGENT</span>}
                    <h3 className="font-semibold text-gray-800">{a.title}</h3>
                  </div>
                  <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">
                    {a.target.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{a.body}</p>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>By: {a.author?.staffProfile?.fullName || a.author?.email}</span>
                  <span>{new Date(a.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}