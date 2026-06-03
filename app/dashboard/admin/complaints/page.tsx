'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Complaint {
  id: string
  category: string
  description: string
  isConfidential: boolean
  isSalaryIssue: boolean
  status: string
  resolutionNotes: string | null
  createdAt: string
  complainant: {
    email: string
    role: string
    staffProfile: {
      fullName: string
      staffId: string
    } | null
  }
}

export default function ManageComplaintsPage() {
  const router = useRouter()
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('SUBMITTED')
  const [selected, setSelected] = useState<Complaint | null>(null)
  const [resolution, setResolution] = useState('')
  const [processing, setProcessing] = useState(false)

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

  const handleResolve = async (complaintId: string, status: string) => {
    setProcessing(true)
    try {
      const res = await fetch('/api/complaints/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          complaintId,
          status,
          resolutionNotes: resolution,
          resolvedById: 'admin-id',
        }),
      })

      if (res.ok) {
        setSelected(null)
        setResolution('')
        fetchComplaints()
      }
    } catch (err) {
      console.error(err)
    }
    setProcessing(false)
  }

  const filtered = complaints.filter(c =>
    filterStatus === 'ALL' ? true : c.status === filterStatus
  )

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
          <button onClick={() => router.push('/dashboard/admin')} className="bg-green-700 px-3 py-1.5 rounded text-sm">← Back</button>
          <button onClick={() => router.push('/login')} className="bg-green-700 px-3 py-1.5 rounded text-sm">Logout</button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Complaints</h1>
          <p className="text-gray-500 text-sm mt-1">Review and resolve staff complaints</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            {label:'Total',value:complaints.length,bg:'bg-blue-50',border:'border-blue-200',filter:'ALL'},
            {label:'Submitted',value:complaints.filter(c=>c.status==='SUBMITTED').length,bg:'bg-yellow-50',border:'border-yellow-200',filter:'SUBMITTED'},
            {label:'Under Review',value:complaints.filter(c=>c.status==='UNDER_REVIEW').length,bg:'bg-blue-50',border:'border-blue-200',filter:'UNDER_REVIEW'},
            {label:'Resolved',value:complaints.filter(c=>c.status==='RESOLVED').length,bg:'bg-green-50',border:'border-green-200',filter:'RESOLVED'},
          ].map((s) => (
            <button key={s.label}
              onClick={() => setFilterStatus(s.filter)}
              className={`${s.bg} border ${s.border} rounded-xl p-4 text-left transition hover:opacity-80 ${filterStatus === s.filter ? 'ring-2 ring-green-500' : ''}`}>
              <p className="text-3xl font-bold text-gray-800">{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </button>
          ))}
        </div>

        {/* Resolution Modal */}
        {selected && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-lg w-full">
              <h3 className="font-bold text-gray-800 text-lg mb-2">Resolve Complaint</h3>
              <p className="text-sm text-gray-500 mb-4">
                From: {selected.complainant?.staffProfile?.fullName || selected.complainant?.email}
              </p>
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-sm text-gray-700">{selected.description}</p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Resolution Notes</label>
                <textarea
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  rows={3}
                  placeholder="Describe how this complaint was resolved..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="flex gap-3">
                <button onClick={() => handleResolve(selected.id, 'UNDER_REVIEW')}
                  disabled={processing}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50">
                  Mark Under Review
                </button>
                <button onClick={() => handleResolve(selected.id, 'RESOLVED')}
                  disabled={processing}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50">
                  ✅ Mark Resolved
                </button>
                <button onClick={() => setSelected(null)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Complaints List */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-700">
              {filterStatus === 'ALL' ? 'All' : filterStatus.replace(/_/g, ' ')} Complaints ({filtered.length})
            </h2>
          </div>
          {loading ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-3xl mb-2">⏳</p>
              <p>Loading...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-3xl mb-2">📭</p>
              <p className="text-sm">No complaints found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filtered.map((c) => (
                <div key={c.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-800">
                          {c.complainant?.staffProfile?.fullName || c.complainant?.email}
                        </span>
                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">
                          {c.category.replace(/_/g, ' ')}
                        </span>
                        {c.isConfidential && (
                          <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">🔒</span>
                        )}
                        {c.isSalaryIssue && (
                          <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs">💰 Salary</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{c.description}</p>
                      {c.resolutionNotes && (
                        <p className="text-xs text-green-700 bg-green-50 px-3 py-2 rounded-lg">
                          Resolution: {c.resolutionNotes}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(c.status)}`}>
                        {c.status.replace(/_/g, ' ')}
                      </span>
                      {c.status !== 'RESOLVED' && c.status !== 'CLOSED' && (
                        <button
                          onClick={() => setSelected(c)}
                          className="bg-green-700 text-white px-3 py-1 rounded text-xs hover:bg-green-800"
                        >
                          Respond
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}