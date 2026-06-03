'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface School {
  id: string
  name: string
  code: string
  ward: string
  lga: string
  address: string
  zone: string
  isActive: boolean
}

export default function SchoolsPage() {
  const router = useRouter()
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [search, setSearch] = useState('')
  const [filterZone, setFilterZone] = useState('')
  const [showForm, setShowForm] = useState(false)

  const [form, setForm] = useState({
    name: '',
    code: '',
    ward: '',
    lga: 'Katsina',
    address: '',
    zone: '',
  })

  useEffect(() => {
    fetchSchools()
  }, [])

  const fetchSchools = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/schools')
      const data = await res.json()
      setSchools(data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch('/api/schools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to create school')
        setSubmitting(false)
        return
      }

      setSuccess('School added successfully!')
      setForm({ name: '', code: '', ward: '', lga: 'Katsina', address: '', zone: '' })
      setShowForm(false)
      fetchSchools()
    } catch (err) {
      setError('Something went wrong')
    }
    setSubmitting(false)
  }

  const filtered = schools.filter(s => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase()) ||
      s.ward.toLowerCase().includes(search.toLowerCase())
    const matchZone = filterZone ? s.zone === filterZone : true
    return matchSearch && matchZone
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
            <h1 className="text-2xl font-bold text-gray-800">Schools</h1>
            <p className="text-gray-500 text-sm mt-1">All schools in Katsina LGEA</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            {showForm ? '✕ Cancel' : '+ Add School'}
          </button>
        </div>

        {/* Add School Form */}
        {showForm && (
          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
            <h2 className="font-semibold text-gray-700 mb-4">🏫 Add New School</h2>

            {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}
            {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">{success}</div>}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">School Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g. LEA Primary School Katsina" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">School Code *</label>
                  <input name="code" value={form.code} onChange={handleChange} required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g. KT/PS/001" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Zone *</label>
                  <select name="zone" value={form.zone} onChange={handleChange} required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option value="">Select Zone</option>
                    <option value="A">Zone A</option>
                    <option value="B">Zone B</option>
                    <option value="C">Zone C</option>
                    <option value="D">Zone D</option>
                    <option value="E">Zone E</option>
                    <option value="F">Zone F</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ward *</label>
                  <input name="ward" value={form.ward} onChange={handleChange} required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g. Katsina Ward" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">LGA *</label>
                  <input name="lga" value={form.lga} onChange={handleChange} required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g. Katsina" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input name="address" value={form.address} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="School address" />
                </div>
              </div>
              <button type="submit" disabled={submitting}
                className="bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-6 rounded-lg transition disabled:opacity-50">
                {submitting ? 'Adding...' : '🏫 Add School'}
              </button>
            </form>
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 flex gap-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, code or ward..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <select
            value={filterZone}
            onChange={(e) => setFilterZone(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">All Zones</option>
            {['A','B','C','D','E','F'].map(z => (
              <option key={z} value={z}>Zone {z}</option>
            ))}
          </select>
        </div>

        {/* Zone Stats */}
        <div className="grid grid-cols-6 gap-3 mb-6">
          {['A','B','C','D','E','F'].map(zone => (
            <div key={zone} className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
              <p className="text-green-800 font-bold">Zone {zone}</p>
              <p className="text-2xl font-bold text-gray-800">
                {schools.filter(s => s.zone === zone).length}
              </p>
              <p className="text-xs text-gray-500">schools</p>
            </div>
          ))}
        </div>

        {/* Schools Table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-gray-700">
              All Schools ({filtered.length})
            </h2>
          </div>
          {loading ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-2">⏳</p>
              <p>Loading schools...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-2">🏫</p>
              <p className="text-sm">No schools found</p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-3 bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
              >
                Add First School
              </button>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">School Name</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Code</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Zone</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Ward</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">LGA</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-800">{s.name}</td>
                    <td className="py-3 px-4 font-mono text-xs text-gray-600">{s.code}</td>
                    <td className="py-3 px-4">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                        Zone {s.zone}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{s.ward}</td>
                    <td className="py-3 px-4 text-gray-600">{s.lga}</td>
                    <td className="py-3 px-4">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">Active</span>
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-green-700 hover:text-green-800 text-xs font-medium">View</button>
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