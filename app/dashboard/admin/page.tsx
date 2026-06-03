'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Stats {
  totalStaff: number
  totalSchools: number
  pendingLeaves: number
  openComplaints: number
  pendingPromotions: number
  pendingTransfers: number
  activeInviteCodes: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats>({
    totalStaff: 0,
    totalSchools: 0,
    pendingLeaves: 0,
    openComplaints: 0,
    pendingPromotions: 0,
    pendingTransfers: 0,
    activeInviteCodes: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const menuItems = [
    { label: 'Dashboard', icon: '🏠', path: '/dashboard/admin' },
    { label: 'Staff List', icon: '👥', path: '/dashboard/admin/stafflist' },
    { label: 'Add Staff', icon: '➕', path: '/dashboard/admin/staff' },
    { label: 'Schools', icon: '🏫', path: '/dashboard/admin/schools' },
    { label: 'Leave Applications', icon: '📋', path: '/dashboard/admin/leaves' },
    { label: 'Promotions', icon: '⬆️', path: '/dashboard/admin/promotions' },
    { label: 'Transfers', icon: '🔄', path: '/dashboard/admin/transfers' },
    { label: 'Complaints', icon: '📣', path: '/dashboard/admin/complaints' },
    { label: 'Invite Codes', icon: '🔑', path: '/dashboard/admin/invites' },
    { label: 'Announcements', icon: '📢', path: '/dashboard/admin/announcements' },
    { label: 'Audit Logs', icon: '🗂️', path: '/dashboard/admin/auditlogs' },
    { label: 'Settings', icon: '⚙️', path: '/dashboard/admin/settings' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-green-800 text-white px-6 py-4 flex items-center justify-between">
        <div>
          <p className="font-bold">Katsina LGEA</p>
          <p className="text-green-200 text-xs">Staff Management & Monitoring System</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm">Super Admin</span>
          <button onClick={() => router.push('/login')} className="bg-green-700 px-3 py-1.5 rounded text-sm">Logout</button>
        </div>
      </nav>
      <div className="flex">
        <aside className="w-64 min-h-screen bg-white shadow p-4">
          <p className="text-xs text-gray-400 uppercase font-semibold mb-3">Main Menu</p>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => router.push(item.path)}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center gap-3 text-gray-600 hover:bg-green-50 hover:text-green-800 transition"
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </aside>
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Super Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mb-6">Full system overview and control</p>

          {loading ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-4xl mb-2">⏳</p>
              <p>Loading live data...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  {label:'Total Staff',value:stats.totalStaff,bg:'bg-blue-50',border:'border-blue-200'},
                  {label:'Total Schools',value:stats.totalSchools,bg:'bg-green-50',border:'border-green-200'},
                  {label:'Pending Leaves',value:stats.pendingLeaves,bg:'bg-yellow-50',border:'border-yellow-200'},
                  {label:'Open Complaints',value:stats.openComplaints,bg:'bg-red-50',border:'border-red-200'},
                ].map((s) => (
                  <div key={s.label} className={`${s.bg} border ${s.border} rounded-xl p-4`}>
                    <p className="text-3xl font-bold text-gray-800">{s.value}</p>
                    <p className="text-sm text-gray-500 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  {label:'Pending Promotions',value:stats.pendingPromotions,bg:'bg-purple-50',border:'border-purple-200'},
                  {label:'Pending Transfers',value:stats.pendingTransfers,bg:'bg-orange-50',border:'border-orange-200'},
                  {label:'Active Invite Codes',value:stats.activeInviteCodes,bg:'bg-teal-50',border:'border-teal-200'},
                ].map((s) => (
                  <div key={s.label} className={`${s.bg} border ${s.border} rounded-xl p-4`}>
                    <p className="text-3xl font-bold text-gray-800">{s.value}</p>
                    <p className="text-sm text-gray-500 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
                <h2 className="font-semibold text-gray-700 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    {label:'Add Staff',color:'bg-green-600',path:'/dashboard/admin/staff'},
                    {label:'Add School',color:'bg-blue-600',path:'/dashboard/admin/schools'},
                    {label:'Generate Invite',color:'bg-purple-600',path:'/dashboard/admin/invites'},
                    {label:'Send Announcement',color:'bg-orange-600',path:'/dashboard/admin/announcements'},
                  ].map((a:{label:string,color:string,path:string}) => (
                    <button key={a.label}
                      onClick={() => router.push(a.path)}
                      className={`${a.color} text-white rounded-lg px-4 py-3 text-sm font-medium`}>
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h2 className="font-semibold text-gray-700 mb-4">System Summary</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">Total Active Users</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">{stats.totalStaff}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">Items Needing Attention</p>
                    <p className="text-2xl font-bold text-red-600 mt-1">
                      {stats.pendingLeaves + stats.openComplaints + stats.pendingPromotions + stats.pendingTransfers}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}