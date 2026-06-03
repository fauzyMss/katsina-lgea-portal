'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface LeaveApplication {
  id: string
  leaveType: string
  startDate: string
  endDate: string
  daysRequested: number
  reason: string
  status: string
  createdAt: string
  applicant: {
    email: string
    role: string
    staffProfile: {
      fullName: string
      staffId: string
    } | null
  }
}

export default function ManageLeavesPage() {
  const router = useRouter()
  const [leaves, setLeaves] = useState<LeaveApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('PENDING')
  const [processing, setProcessing] = useState<string | null>(null)

  useEffect(() => {
    fetchLeaves()
  }, [])

  const fetchLeaves = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/leave')
      const data = await res.json()
      setLeaves(data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const handleAction = async (leaveId: string, action: string) => {
    setProcessing(leaveId)
    try {
      const res = await fetch('/api/leave/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leaveId,
          action,
          reviewedById: 'admin-id',
        }),
      })

      if (res.ok) {
        fetchLeaves()
      }
    } catch (err) {
      console.error(err)
    }
    setProcessing(null)
  }

  const filtered = leaves.filter(l =>
    filterStatus === 'ALL' ? true : l.status === filterStatus
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
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Leave Applications</h1>
          <p className="text-gray-500 text-sm mt-1">Review and approve leave requests</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            {label:'Total',value:leaves.length,bg:'bg-blue-50',border:'border-blue-200',filter:'ALL'},
            {label:'Pending',value:leaves.filter(l=>l.status==='PENDING').length,bg:'bg-yellow-50',border:'border-yellow-200',filter:'PENDING'},
            {label:'Approved',value:leaves.filter(l=>l.status==='APPROVED').length,bg:'bg-green-50',border:'border-green-200',filter:'APPROVED'},
            {label:'Rejected',value:leaves.filter(l=>l.status==='REJECTED').length,bg:'bg-red-50',border:'border-red-200',filter:'REJECTED'},
          ].map((s) => (
            <button key={s.label}
              onClick={() => setFilterStatus(s.filter)}
              className={`${s.bg} border ${s.border} rounded-xl p-4 text-left transition hover:opacity-80 ${filterStatus === s.filter ? 'ring-2 ring-green-500' : ''}`}>
              <p className="text-3xl font-bold text-gray-800">{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </button>
          ))}
        </div>

        {/* Leaves Table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-700">
              {filterStatus === 'ALL' ? 'All' : filterStatus} Applications ({filtered.length})
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
              <p className="text-sm">No {filterStatus.toLowerCase()} applications</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Staff Name</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Leave Type</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Duration</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Days</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Reason</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((leave) => (
                  <tr key={leave.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-800">
                        {leave.applicant?.staffProfile?.fullName || 'N/A'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {leave.applicant?.staffProfile?.staffId || leave.applicant?.email}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {leave.leaveType.replace(/_/g, ' ')}
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-xs">
                      {new Date(leave.startDate).toLocaleDateString()} →{' '}
                      {new Date(leave.endDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{leave.daysRequested}</td>
                    <td className="py-3 px-4 text-gray-500 text-xs max-w-32 truncate">{leave.reason}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(leave.status)}`}>
                        {leave.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {leave.status === 'PENDING' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAction(leave.id, 'approve')}
                            disabled={processing === leave.id}
                            className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 disabled:opacity-50"
                          >
                            ✅ Approve
                          </button>
                          <button
                            onClick={() => handleAction(leave.id, 'reject')}
                            disabled={processing === leave.id}
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