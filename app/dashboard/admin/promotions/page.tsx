'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Promotion {
  id: string
  fromGradeLevel: number
  fromStep: number
  toGradeLevel: number
  toStep: number
  effectiveDate: string
  status: string
  notes: string | null
  createdAt: string
  staff: {
    email: string
    role: string
    staffProfile: {
      fullName: string
      staffId: string
    } | null
  }
}

export default function ManagePromotionsPage() {
  const router = useRouter()
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('PENDING')
  const [processing, setProcessing] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [form, setForm] = useState({
    staffId: '',
    fromGradeLevel: '',
    fromStep: '',
    toGradeLevel: '',
    toStep: '',
    effectiveDate: '',
    notes: '',
  })

  useEffect(() => {
    fetchPromotions()
  }, [])

  const fetchPromotions = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/promotions')
      const data = await res.json()
      setPromotions(data)
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
      const res = await fetch('/api/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to create promotion')
        setSubmitting(false)
        return
      }

      setSuccess('Promotion record created!')
      setShowForm(false)
      setForm({
        staffId: '', fromGradeLevel: '', fromStep: '',
        toGradeLevel: '', toStep: '', effectiveDate: '', notes: '',
      })
      fetchPromotions()
    } catch (err) {
      setError('Something went wrong')
    }
    setSubmitting(false)
  }

  const handleAction = async (promotionId: string, action: string) => {
    setProcessing(promotionId)
    try {
      const res = await fetch('/api/promotions/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promotionId,
          action,
          confirmedById: 'admin-id',
        }),
      })

      if (res.ok) fetchPromotions()
    } catch (err) {
      console.error(err)
    }
    setProcessing(null)
  }

  const filtered = promotions.filter(p =>
    filterStatus === 'ALL' ? true : p.status === filterStatus
  )

  const getStatusColor = (status: string) => {
    if (status === 'APPROVED') return 'bg-green-100 text-green-700'
    if (status === 'REJECTED') return 'bg-red-100 text-red-700'
    if (status === 'PENDING') return 'bg-yellow-100 text-yellow-700'
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
            <h1 className="text-2xl font-bold text-gray-800">Promotions</h1>
            <p className="text-gray-500 text-sm mt-1">Manage staff promotion records</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            {showForm ? '✕ Cancel' : '+ Add Promotion'}
          </button>
        </div>

        {/* Add Promotion Form */}
        {showForm && (
          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
            <h2 className="font-semibold text-gray-700 mb-4">⬆️ New Promotion Record</h2>
            {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}
            {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">{success}</div>}
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Staff ID *</label>
                  <input value={form.staffId}
                    onChange={(e) => setForm({...form, staffId: e.target.value})}
                    required placeholder="Enter staff user ID"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From Grade Level *</label>
                  <select value={form.fromGradeLevel}
                    onChange={(e) => setForm({...form, fromGradeLevel: e.target.value})}
                    required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option value="">Select GL</option>
                    {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17].map(g => (
                      <option key={g} value={g}>GL {g}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From Step *</label>
                  <select value={form.fromStep}
                    onChange={(e) => setForm({...form, fromStep: e.target.value})}
                    required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option value="">Select Step</option>
                    {[1,2,3,4,5,6,7,8,9,10].map(s => (
                      <option key={s} value={s}>Step {s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Effective Date *</label>
                  <input type="date" value={form.effectiveDate}
                    onChange={(e) => setForm({...form, effectiveDate: e.target.value})}
                    required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To Grade Level *</label>
                  <select value={form.toGradeLevel}
                    onChange={(e) => setForm({...form, toGradeLevel: e.target.value})}
                    required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option value="">Select GL</option>
                    {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17].map(g => (
                      <option key={g} value={g}>GL {g}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To Step *</label>
                  <select value={form.toStep}
                    onChange={(e) => setForm({...form, toStep: e.target.value})}
                    required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option value="">Select Step</option>
                    {[1,2,3,4,5,6,7,8,9,10].map(s => (
                      <option key={s} value={s}>Step {s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <input value={form.notes}
                    onChange={(e) => setForm({...form, notes: e.target.value})}
                    placeholder="Optional notes"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              </div>
              <button type="submit" disabled={submitting}
                className="bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-6 rounded-lg disabled:opacity-50">
                {submitting ? 'Creating...' : '⬆️ Create Promotion Record'}
              </button>
            </form>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            {label:'Pending',value:promotions.filter(p=>p.status==='PENDING').length,bg:'bg-yellow-50',border:'border-yellow-200',filter:'PENDING'},
            {label:'Approved',value:promotions.filter(p=>p.status==='APPROVED').length,bg:'bg-green-50',border:'border-green-200',filter:'APPROVED'},
            {label:'Rejected',value:promotions.filter(p=>p.status==='REJECTED').length,bg:'bg-red-50',border:'border-red-200',filter:'REJECTED'},
          ].map((s) => (
            <button key={s.label}
              onClick={() => setFilterStatus(s.filter)}
              className={`${s.bg} border ${s.border} rounded-xl p-4 text-left transition hover:opacity-80 ${filterStatus === s.filter ? 'ring-2 ring-green-500' : ''}`}>
              <p className="text-3xl font-bold text-gray-800">{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </button>
          ))}
        </div>

        {/* Promotions Table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-700">
              {filterStatus} Promotions ({filtered.length})
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
              <p className="text-sm">No {filterStatus.toLowerCase()} promotions</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Staff Name</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">From</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">To</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Effective Date</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-800">
                        {p.staff?.staffProfile?.fullName || 'N/A'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {p.staff?.staffProfile?.staffId || p.staff?.email}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      GL{p.fromGradeLevel} / Step {p.fromStep}
                    </td>
                    <td className="py-3 px-4 text-green-700 font-medium">
                      GL{p.toGradeLevel} / Step {p.toStep}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(p.effectiveDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(p.status)}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {p.status === 'PENDING' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAction(p.id, 'approve')}
                            disabled={processing === p.id}
                            className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 disabled:opacity-50"
                          >
                            ✅ Approve
                          </button>
                          <button
                            onClick={() => handleAction(p.id, 'reject')}
                            disabled={processing === p.id}
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