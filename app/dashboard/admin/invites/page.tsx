'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface InviteCode {
  id: string
  code: string
  roleFor: string
  batchName: string
  isActive: boolean
  usedAt: string | null
  expiresAt: string
  createdAt: string
}

export default function InvitesPage() {
  const router = useRouter()
  const [codes, setCodes] = useState<InviteCode[]>([])
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [newCode, setNewCode] = useState('')

  const [form, setForm] = useState({
    roleFor: '',
    batchName: '',
    expiresInDays: '7',
    createdById: 'admin',
  })

  useEffect(() => {
    fetchCodes()
  }, [])

  const fetchCodes = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/invite')
      const data = await res.json()
      setCodes(data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setGenerating(true)
    setError('')
    setSuccess('')
    setNewCode('')

    try {
      const res = await fetch('/api/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to generate code')
        setGenerating(false)
        return
      }

      setNewCode(data.code)
      setSuccess('Invite code generated successfully!')
      fetchCodes()
    } catch (err) {
      setError('Something went wrong')
    }
    setGenerating(false)
  }

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    alert(`Code ${code} copied to clipboard!`)
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

      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Invite Codes</h1>
        <p className="text-gray-500 text-sm mb-6">Generate invite codes for staff to register themselves</p>

        {/* Generate Form */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
          <h2 className="font-semibold text-gray-700 mb-4">🔑 Generate New Invite Code</h2>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}

          {newCode && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-green-800 font-semibold text-sm mb-2">✅ New Invite Code Generated!</p>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-green-800 tracking-widest">{newCode}</span>
                <button onClick={() => copyCode(newCode)} className="bg-green-600 text-white px-3 py-1 rounded text-sm">Copy</button>
              </div>
              <p className="text-green-600 text-xs mt-2">Share this code with the staff member to register</p>
            </div>
          )}

          <form onSubmit={handleGenerate}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role For *</label>
                <select
                  value={form.roleFor}
                  onChange={(e) => setForm({...form, roleFor: e.target.value})}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Role</option>
                  <optgroup label="Senior Roles">
                    <option value="EDUCATION_SECRETARY">Education Secretary</option>
                    <option value="HOD_PRS">HOD PRS</option>
                    <option value="EMIS_UNIT_HEAD">EMIS Unit Head</option>
                    <option value="ME_UNIT_HEAD">M&E Unit Head</option>
                    <option value="HOD_PERSONNEL">HOD Personnel</option>
                    <option value="STAFF_OFFICER">Staff Officer</option>
                    <option value="HOD_FINANCE">HOD Finance</option>
                    <option value="HOD_ACADEMIC">HOD Academic</option>
                    <option value="HOD_QA">HOD Quality Assurance</option>
                    <option value="HOD_MOBILIZATION">HOD Mobilization</option>
                    <option value="HOD_PHYSICAL_PLANNING">HOD Physical Planning</option>
                    <option value="HOD_TEACHER_DEV">HOD Teacher Development</option>
                    <option value="HOD_SPECIAL_PROGRAM">HOD Special Program</option>
                  </optgroup>
                  <optgroup label="Field Roles">
                    <option value="AEO_ZONE_A">AEO Zone A</option>
                    <option value="AEO_ZONE_B">AEO Zone B</option>
                    <option value="AEO_ZONE_C">AEO Zone C</option>
                    <option value="AEO_ZONE_D">AEO Zone D</option>
                    <option value="AEO_ZONE_E">AEO Zone E</option>
                    <option value="AEO_ZONE_F">AEO Zone F</option>
                    <option value="HEADTEACHER">Headteacher</option>
                  </optgroup>
                  <optgroup label="Staff">
                    <option value="TEACHER">Teacher</option>
                    <option value="LEA_ADMIN_STAFF">LEA Admin Staff</option>
                  </optgroup>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expires In</label>
                <select
                  value={form.expiresInDays}
                  onChange={(e) => setForm({...form, expiresInDays: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="1">1 Day</option>
                  <option value="3">3 Days</option>
                  <option value="7">7 Days</option>
                  <option value="14">14 Days</option>
                  <option value="30">30 Days</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              disabled={generating}
              className="bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-6 rounded-lg transition disabled:opacity-50"
            >
              {generating ? 'Generating...' : '🔑 Generate Invite Code'}
            </button>
          </form>
        </div>

        {/* Codes List */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="font-semibold text-gray-700 mb-4">All Invite Codes</h2>
          {loading ? (
            <p className="text-center text-gray-400 py-8">Loading...</p>
          ) : codes.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p className="text-4xl mb-2">🔑</p>
              <p className="text-sm">No invite codes generated yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 text-gray-600">Code</th>
                    <th className="text-left py-3 px-2 text-gray-600">Role</th>
                    <th className="text-left py-3 px-2 text-gray-600">Batch</th>
                    <th className="text-left py-3 px-2 text-gray-600">Status</th>
                    <th className="text-left py-3 px-2 text-gray-600">Expires</th>
                    <th className="text-left py-3 px-2 text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {codes.map((c) => (
                    <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-2 font-mono font-bold text-green-700">{c.code}</td>
                      <td className="py-3 px-2 text-gray-600">{c.roleFor}</td>
                      <td className="py-3 px-2 text-gray-500">{c.batchName || '-'}</td>
                      <td className="py-3 px-2">
                        {c.isActive ? (
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">Active</span>
                        ) : (
                          <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs">Used</span>
                        )}
                      </td>
                      <td className="py-3 px-2 text-gray-500">
                        {new Date(c.expiresAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-2">
                        {c.isActive && (
                          <button
                            onClick={() => copyCode(c.code)}
                            className="bg-green-600 text-white px-3 py-1 rounded text-xs"
                          >
                            Copy
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}