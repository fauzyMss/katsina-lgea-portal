'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Complaint {
  id: string
  category: string
  description: string
  isConfidential: boolean
  status: string
  resolutionNotes: string | null
  createdAt: string
}

export default function TeacherComplaintsPage() {
  const router = useRouter()
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showForm, setShowForm] = useState(false)

  const [form, setForm] = useState({
    category: '',
    description: '',
    isConfidential: false,
    complainantId: 'temp-id',
  })

  useEffect(() => {
    fetchComplaints()
  }, [])

  const fetchComplaints = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/complaints')
      const data = await res.json()
      setComplaints(data)
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
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to submit')
        setSubmitting(false)
        return
      }

      setSuccess('Complaint submitted successfully!')
      setShowForm(false)
      setForm({ category: '', description: '', isConfidential: false, complainantId: 'temp-id' })
      fetchComplaints()
    } catch (err) {
      setError('Something went wrong')
    }
    setSubmitting(false)
  }

  const getStatusColor = (status: string) => {
    if (status === 'RESOLVED') return 'bg-green-100 text-green-700'
    if (status === 'UNDER_REVIEW') return 'bg-blue-100 text-blue-700'
    if (status === 'SUBMITTED') return 'bg-yellow-100 text-yellow-700'
    if (status === 'CLOSED') return 'bg-gray-100 text-gray-700'
    return 'bg-gray-100 text-gray-700'
  }

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

      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Complaints</h1>
            <p className="text-gray-500 text-sm mt-1">Submit and track your complaints</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            {showForm ? '✕ Cancel' : '+ File Complaint'}
          </button>
        </div>

        {/* Submit Form */}
        {showForm && (
          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
            <h2 className="font-semibold text-gray-700 mb-4">📣 New Complaint</h2>

            {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="space-y-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select value={form.category}
                    onChange={(e) => setForm({...form, category: e.target.value})}
                    required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option value="">Select Category</option>
                    <option value="WELFARE">Welfare</option>
                    <option value="SALARY">Salary Issue</option>
                    <option value="HARASSMENT">Harassment</option>
                    <option value="WORKLOAD">Workload</option>
                    <option value="POSTING">Posting</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <textarea value={form.description}
                    onChange={(e) => setForm({...form, description: e.target.value})}
                    required rows={4} placeholder="Describe your complaint in detail..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="confidential"
                    checked={form.isConfidential}
                    onChange={(e) => setForm({...form, isConfidential: e.target.checked})}
                    className="w-4 h-4 text-green-600" />
                  <label htmlFor="confidential" className="text-sm text-gray-700">
                    Mark as confidential — only senior management can see this
                  </label>
                </div>
              </div>
              <button type="submit" disabled={submitting}
                className="bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-6 rounded-lg transition disabled:opacity-50">
                {submitting ? 'Submitting...' : '📣 Submit Complaint'}
              </button>
            </form>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">{success}</div>
        )}

        {/* Complaints List */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-700">My Complaints ({complaints.length})</h2>
          </div>
          {loading ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-3xl mb-2">⏳</p>
              <p>Loading...</p>
            </div>
          ) : complaints.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-3xl mb-2">📭</p>
              <p className="text-sm">No complaints filed yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {complaints.map((c) => (
                <div key={c.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                        {c.category.replace(/_/g, ' ')}
                      </span>
                      {c.isConfidential && (
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">🔒 Confidential</span>
                      )}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(c.status)}`}>
                      {c.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{c.description}</p>
                  {c.resolutionNotes && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-2">
                      <p className="text-xs font-medium text-green-800 mb-1">Resolution:</p>
                      <p className="text-xs text-green-700">{c.resolutionNotes}</p>
                    </div>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    Filed on {new Date(c.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}