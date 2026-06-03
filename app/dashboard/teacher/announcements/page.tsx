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
  author: {
    staffProfile: { fullName: string } | null
    email: string
  }
}

export default function ViewAnnouncementsPage() {
  const router = useRouter()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/announcements')
      .then(res => res.json())
      .then(data => {
        setAnnouncements(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-green-800 text-white px-6 py-4 flex items-center justify-between">
        <div>
          <p className="font-bold">Katsina LGEA</p>
          <p className="text-green-200 text-xs">Staff Management & Monitoring System</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/dashboard/teacher')} className="bg-green-700 px-3 py-1.5 rounded text-sm">← Back</button>
          <button onClick={() => router.push('/login')} className="bg-green-700 px-3 py-1.5 rounded text-sm">Logout</button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Announcements</h1>
          <p className="text-gray-500 text-sm mt-1">Latest messages from KTLGEA management</p>
        </div>

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
          <div className="space-y-4">
            {announcements.map((a) => (
              <div key={a.id} className={`bg-white border rounded-xl p-5 ${a.isUrgent ? 'border-red-300 bg-red-50' : a.isPinned ? 'border-green-300' : 'border-gray-200'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {a.isPinned && <span className="text-sm">📌</span>}
                    {a.isUrgent && <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-medium">🚨 URGENT</span>}
                    <h3 className="font-semibold text-gray-800">{a.title}</h3>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">{a.body}</p>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>From: {a.author?.staffProfile?.fullName || 'KTLGEA Management'}</span>
                  <span>{new Date(a.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}