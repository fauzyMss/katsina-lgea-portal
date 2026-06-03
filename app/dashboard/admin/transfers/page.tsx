'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Transfer {
  id: string
  reason: string
  status: string
  notes: string | null
  createdAt: string
  toDepartment: string | null
  requestedBy: {
    email: string
    role: string
    staffProfile: {
      fullName: string
      staffId: string
    } | null
  }
  fromSchool: { name: string } | null
  toSchool: { name: string } | null
}

export default function ManageTransfersPage() {
  const router = useRouter()
  const [transfers, setTransfers] = useState<Transfer[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('PENDING')
  const [processing, setProcessing] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [schools, setSchools] = useState<{id:string,name:string}[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [form, setForm] = useState({
    requestedById: '',
    fromSchoolId: '',
    toSchoolId: '',
    toDepartment: '',
    reason: '',
    recommendedBy: '',
  })

  useEffect(() => {
    fetchTransfers()
    fetchSchools()
  }, [])

  const fetchTransfers = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/transfers')
      const data = await res.json()
      setTransfers(data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const fetchSchools = async () => {
    try {
      const res = await fetch('/api/schools')
      const data = await res.json()
      setSchools(data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch('/api/transfers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to create transfer')
        setSubmitting(false)
        return
      }

      setSuccess('Transfer request created!')
      setShowForm(false)
      setForm({
        requestedById: '', fromSchoolId: '', toSchoolId: '',
        toDepartment: '', reason: '', recommendedBy: '',
      })
      fetchTransfers()
    } catch (err) {
      setError('Something went wrong')
    }
    setSubmitting(false)
  }

  const handleAction = async (transferId: string, action: string) => {
    setProcessing(transferId)
    try {
      const res = await fetch('/api/transfers/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transferId,
          action,
          processedById: 'admin-id',
        }),
      })

      if (res.ok) fetchTransfers()
    } catch (err) {
      console.error(err)
    }
    setProcessing(null)
  }

  const filtered = transfers.filter(t =>
    filterStatus === 'ALL' ? true : t.status === filterStatus
  )

  const getStatusColor = (status: string) => {
    if (status === 'APPROVED') return 'bg-green-100 text-green-700'
    if (status === 'REJECTED') return 'bg-red-100 text-red-700'
    if (status === 'PENDING') return 'bg-yellow-100 text-yellow-700'
    if (status === 'UNDER_REVIEW') return 'bg-blue-100 text-blue-700'
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Transfers</h1>
            <p className="text-gray-500 text-sm mt-1">Manage staff transfer requests</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            {showForm ? '✕ Cancel' : '+ New Transfer'}
          </button>
        </div>

        {/* Add Transfer Form */}
        {showForm && (
          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
            <h2 className="font-semibold text-gray-700 mb-4">🔄 New Transfer Request</h2>
            {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}
            {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">{success}</div>}
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Staff ID *</label>
                  <input value={form.requestedById}
                    onChange={(e) => setForm({...form, requestedById: e.target.value})}
                    required placeholder="Enter staff user ID"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From School</label>
                  <select value={form.fromSchoolId}
                    onChange={(e) => setForm({...form, fromSchoolId: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option value="">Select School</option>
                    {schools.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To School</label>
                  <select value={form.toSchoolId}
                    onChange={(e) => setForm({...form, toSchoolId: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option value="">Select School</option>
                    {schools.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Recommended By</label>
                  <input value={form.recommendedBy}
                    onChange={(e) => setForm({...form, recommendedBy: e.target.value})}
                    placeholder="Name of recommending officer"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason *</label>
                  <textarea value={form.reason}
                    onChange={(e) => setForm({...form, reason: e.target.value})}
                    required rows={3} placeholder="Reason for transfer request"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              </div>
              <button type="submit" disabled={submitting}
                className="bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-6 rounded-lg disabled:opacity-50">
                {submitting ? 'Creating...' : '🔄 Create Transfer Request'}
              </button>
            </form>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            {label:'Total',value:transfers.length,bg:'bg-blue-50',border:'border-blue-200',filter:'ALL'},
            {label:'Pending',value:transfers.filter(t=>t.status==='PENDING').length,bg:'bg-yellow-50',border:'border-yellow-200',filter:'PENDING'},
            {label:'Approved',value:transfers.filter(t=>t.status==='APPROVED').length,bg:'bg-green-50',border:'border-green-200',filter:'APPROVED'},
            {label:'Rejected',value:transfers.filter(t=>t.status==='REJECTED').length,bg:'bg-red-50',border:'border-red-200',filter:'REJECTED'},
          ].map((s) => (
            <button key={s.label}
              onClick={() => setFilterStatus(s.filter)}
              className={`${s.bg} border ${s.border} rounded-xl p-4 text-left transition hover:opacity-80 ${filterStatus === s.filter ? 'ring-2 ring-green-500' : ''}`}>
              <p className="text-3xl font-bold text-gray-800">{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </button>
          ))}
        </div>

        {/* Transfers Table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-700">
              {filterStatus === 'ALL' ? 'All' : filterStatus} Transfers ({filtered.length})
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
              <p className="text-sm">No {filterStatus.toLowerCase()} transfers</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Staff Name</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">From</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">To</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Reason</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-800">
                        {t.requestedBy?.staffProfile?.fullName || 'N/A'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {t.requestedBy?.role?.replace(/_/g, ' ')}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-xs">
                      {t.fromSchool?.name || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-xs">
                      {t.toSchool?.name || t.toDepartment || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-xs max-w-32 truncate">
                      {t.reason}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(t.status)}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {t.status === 'PENDING' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAction(t.id, 'approve')}
                            disabled={processing === t.id}
                            className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 disabled:opacity-50"
                          >
                            ✅ Approve
                          </button>
                          <button
                            onClick={() => handleAction(t.id, 'reject')}
                            disabled={processing === t.id}
                            className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700 disabled:opacity-50"
                          >
                            ❌ Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}