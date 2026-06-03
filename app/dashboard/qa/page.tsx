'use client'
import { useRouter } from 'next/navigation'

export default function QADashboard() {
  const router = useRouter()
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-green-800 text-white px-6 py-4 flex items-center justify-between">
        <div>
          <p className="font-bold">Katsina LGEA</p>
          <p className="text-green-200 text-xs">Staff Management & Monitoring System</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm">HOD Quality Assurance</span>
          <button onClick={() => router.push('/login')} className="bg-green-700 px-3 py-1.5 rounded text-sm">Logout</button>
        </div>
      </nav>
      <div className="flex">
        <aside className="w-64 min-h-screen bg-white shadow p-4">
          {['Dashboard','QA Assessments','School Scores','QA Reports','Announcements'].map((item) => (
            <button key={item} className="w-full text-left px-3 py-2 rounded text-sm text-gray-600 hover:bg-gray-50 block mb-1">{item}</button>
          ))}
        </aside>
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Quality Assurance Dashboard</h1>
          <p className="text-gray-500 text-sm mb-6">QA Assessments & School Scores</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              {label:'Total Schools',value:'0',bg:'bg-blue-50',border:'border-blue-200'},
              {label:'Assessed Schools',value:'0',bg:'bg-green-50',border:'border-green-200'},
              {label:'Pending Assessments',value:'0',bg:'bg-yellow-50',border:'border-yellow-200'},
              {label:'Grade A Schools',value:'0',bg:'bg-purple-50',border:'border-purple-200'},
            ].map((s) => (
              <div key={s.label} className={`${s.bg} border ${s.border} rounded-xl p-4`}>
                <p className="text-3xl font-bold text-gray-800">{s.value}</p>
                <p className="text-sm text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
            <h2 className="font-semibold text-gray-700 mb-4">Grade Distribution</h2>
            <div className="grid grid-cols-5 gap-3">
              {[
                {grade:'A',label:'80-100',color:'bg-green-100 border-green-300'},
                {grade:'B',label:'65-79',color:'bg-blue-100 border-blue-300'},
                {grade:'C',label:'50-64',color:'bg-yellow-100 border-yellow-300'},
                {grade:'D',label:'35-49',color:'bg-orange-100 border-orange-300'},
                {grade:'F',label:'Below 35',color:'bg-red-100 border-red-300'},
              ].map((g) => (
                <div key={g.grade} className={`${g.color} border rounded-lg p-3 text-center`}>
                  <p className="text-2xl font-bold">{g.grade}</p>
                  <p className="text-xs text-gray-500">{g.label}</p>
                  <p className="text-lg font-bold mt-1">0</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="font-semibold text-gray-700 mb-4">Recent Assessments</h2>
            <div className="text-center py-8 text-gray-400">
              <p className="text-4xl mb-2">📭</p>
              <p className="text-sm">No assessments yet</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
