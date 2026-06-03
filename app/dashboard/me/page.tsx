'use client'
import { useRouter } from 'next/navigation'

export default function MEDashboard() {
  const router = useRouter()
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-green-800 text-white px-6 py-4 flex items-center justify-between">
        <div>
          <p className="font-bold">Katsina LGEA</p>
          <p className="text-green-200 text-xs">Staff Management & Monitoring System</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm">M&E Unit Head</span>
          <button onClick={() => router.push('/login')} className="bg-green-700 px-3 py-1.5 rounded text-sm">Logout</button>
        </div>
      </nav>
      <div className="flex">
        <aside className="w-64 min-h-screen bg-white shadow p-4">
          {['Dashboard','Visit Logs','Visit Schedule','School Flags','School Feedback','M&E Reports','Announcements'].map((item) => (
            <button key={item} className="w-full text-left px-3 py-2 rounded text-sm text-gray-600 hover:bg-gray-50 block mb-1">{item}</button>
          ))}
        </aside>
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">M&E Unit Dashboard</h1>
          <p className="text-gray-500 text-sm mb-6">Monitoring & Evaluation</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              {label:'Total Schools',value:'0',bg:'bg-blue-50',border:'border-blue-200'},
              {label:'Visits This Term',value:'0',bg:'bg-green-50',border:'border-green-200'},
              {label:'Pending Visits',value:'0',bg:'bg-yellow-50',border:'border-yellow-200'},
              {label:'Flagged Schools',value:'0',bg:'bg-red-50',border:'border-red-200'},
            ].map((s) => (
              <div key={s.label} className={`${s.bg} border ${s.border} rounded-xl p-4`}>
                <p className="text-3xl font-bold text-gray-800">{s.value}</p>
                <p className="text-sm text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              {label:'Completed Visits',value:'0',bg:'bg-green-50',border:'border-green-200'},
              {label:'Overdue Visits',value:'0',bg:'bg-red-50',border:'border-red-200'},
              {label:'Schools Feedback',value:'0',bg:'bg-purple-50',border:'border-purple-200'},
            ].map((s) => (
              <div key={s.label} className={`${s.bg} border ${s.border} rounded-xl p-4`}>
                <p className="text-3xl font-bold text-gray-800">{s.value}</p>
                <p className="text-sm text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
            <h2 className="font-semibold text-gray-700 mb-4">Zone Visit Status</h2>
            <div className="grid grid-cols-6 gap-3">
              {['A','B','C','D','E','F'].map((zone) => (
                <div key={zone} className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                  <p className="text-green-800 font-bold">Zone {zone}</p>
                  <p className="text-xs text-gray-500 mt-1">0 visits</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="font-semibold text-gray-700 mb-4">Recent Visits</h2>
            <div className="text-center py-8 text-gray-400">
              <p className="text-4xl mb-2">📭</p>
              <p className="text-sm">No visits recorded yet</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}