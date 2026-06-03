'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Staff {
  id: string
  email: string
  role: string
  isActive: boolean
  createdAt: string
  staffProfile: {
    fullName: string
    staffId: string
    phoneNumber: string
    gender: string
    gradeLevel: number
    step: number
    highestQualification: string
  } | null
}

export default function StaffListPage() {
  const router = useRouter()
  const [staff, setStaff] = useState<Staff[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState('')

  useEffect(() => {
    fetch('/api/staff')
      .then(res => res.json())
      .then(data => {
        setStaff(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filtered = staff.filter(s => {
    const matchSearch =
      s.staffProfile?.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.staffProfile?.staffId.toLowerCase().includes(search.toLowerCase())
    const matchRole = filterRole ? s.role === filterRole : true
    return matchSearch && matchRole
  })

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
            <h1 className="text-2xl font-bold text-gray-800">Staff List</h1>
            <p className="text-gray-500 text-sm mt-1">All registered staff members</p>
          </div>
          <button
            onClick={() => router.push('/dashboard/admin/staff')}
            className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            + Add Staff
          </button>
        </div>

        {/* Search and Filter */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 flex gap-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or staff ID..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">All Roles</option>
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="EDUCATION_SECRETARY">Education Secretary</option>
            <option value="HOD_PRS">HOD PRS</option>
            <option value="EMIS_UNIT_HEAD">EMIS Unit Head</option>
            <option value="ME_UNIT_HEAD">M&E Unit Head</option>
            <option value="HOD_PERSONNEL">HOD Personnel</option>
            <option value="STAFF_OFFICER">Staff Officer</option>
            <option value="HOD_FINANCE">HOD Finance</option>
            <option value="HOD_ACADEMIC">HOD Academic</option>
            <option value="HOD_QA">HOD QA</option>
            <option value="HOD_MOBILIZATION">HOD Mobilization</option>
            <option value="HOD_PHYSICAL_PLANNING">HOD Physical Planning</option>
            <option value="HOD_TEACHER_DEV">HOD Teacher Dev</option>
            <option value="HOD_SPECIAL_PROGRAM">HOD Special Program</option>
            <option value="HEADTEACHER">Headteacher</option>
            <option value="TEACHER">Teacher</option>
            <option value="LEA_ADMIN_STAFF">LEA Admin Staff</option>
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            {label:'Total Staff',value:staff.length,bg:'bg-blue-50',border:'border-blue-200'},
            {label:'Active Staff',value:staff.filter(s=>s.isActive).length,bg:'bg-green-50',border:'border-green-200'},
            {label:'Showing',value:filtered.length,bg:'bg-purple-50',border:'border-purple-200'},
          ].map((s) => (
            <div key={s.label} className={`${s.bg} border ${s.border} rounded-xl p-4`}>
              <p className="text-3xl font-bold text-gray-800">{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Staff Table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {loading ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-2">⏳</p>
              <p>Loading staff...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-2">👥</p>
              <p>No staff found</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Name</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Staff ID</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Email</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Role</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">GL/Step</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-800">
                          {s.staffProfile?.fullName || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-400">{s.staffProfile?.gender || ''}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600 font-mono text-xs">
                      {s.staffProfile?.staffId || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{s.email}</td>
                    <td className="py-3 px-4">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                        {s.role.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      GL{s.staffProfile?.gradeLevel}/{s.staffProfile?.step || '-'}
                    </td>
                    <td className="py-3 px-4">
                      {s.isActive ? (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">Active</span>
                      ) : (
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs">Inactive</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-green-700 hover:text-green-800 text-xs font-medium">
                        View
                      </button>
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