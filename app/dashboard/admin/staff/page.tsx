'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AddStaffPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    staffId: '',
    role: '',
    staffType: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    dateOfFirstAppointment: '',
    dateOfCurrentPosting: '',
    gradeLevel: '',
    step: '',
    highestQualification: '',
    stateOfOrigin: '',
    lgaOfOrigin: '',
    residentialAddress: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to create staff')
        setLoading(false)
        return
      }

      setSuccess('Staff member created successfully!')
      setForm({
        fullName: '', email: '', password: '', staffId: '',
        role: '', staffType: '', phone: '', gender: '',
        dateOfBirth: '', dateOfFirstAppointment: '',
        dateOfCurrentPosting: '', gradeLevel: '', step: '',
        highestQualification: '', stateOfOrigin: '',
        lgaOfOrigin: '', residentialAddress: '',
      })
      setLoading(false)

    } catch (err) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
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

      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Add New Staff</h1>
        <p className="text-gray-500 text-sm mb-6">Fill in the details to create a new staff account</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">{success}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Account Information */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="font-semibold text-gray-700 mb-4">🔐 Account Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input name="fullName" value={form.fullName} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g. Yusuf Ibrahim Musa" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g. yusuf@ktlgea.gov.ng" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                <input name="password" type="password" value={form.password} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Minimum 8 characters" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Staff ID *</label>
                <input name="staffId" value={form.staffId} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g. KTLGEA/2024/001" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                <select name="role" value={form.role} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="">Select Role</option>
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
                  <option value="AEO_ZONE_A">AEO Zone A</option>
                  <option value="AEO_ZONE_B">AEO Zone B</option>
                  <option value="AEO_ZONE_C">AEO Zone C</option>
                  <option value="AEO_ZONE_D">AEO Zone D</option>
                  <option value="AEO_ZONE_E">AEO Zone E</option>
                  <option value="AEO_ZONE_F">AEO Zone F</option>
                  <option value="HEADTEACHER">Headteacher</option>
                  <option value="TEACHER">Teacher</option>
                  <option value="LEA_ADMIN_STAFF">LEA Admin Staff</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Staff Type *</label>
                <select name="staffType" value={form.staffType} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="">Select Type</option>
                  <option value="TEACHER">Teacher</option>
                  <option value="LEA_ADMIN">LEA Admin</option>
                </select>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="font-semibold text-gray-700 mb-4">👤 Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input name="phone" value={form.phone} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g. 08012345678" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                <select name="gender" value={form.gender} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="">Select Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                <input name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State of Origin *</label>
                <input name="stateOfOrigin" value={form.stateOfOrigin} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g. Katsina" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LGA of Origin *</label>
                <input name="lgaOfOrigin" value={form.lgaOfOrigin} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g. Katsina LGA" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Highest Qualification *</label>
                <input name="highestQualification" value={form.highestQualification} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g. B.Ed, NCE, M.Ed" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Residential Address *</label>
                <textarea name="residentialAddress" value={form.residentialAddress} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Full residential address" rows={2} />
              </div>
            </div>
          </div>

          {/* Employment Information */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="font-semibold text-gray-700 mb-4">💼 Employment Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of First Appointment *</label>
                <input name="dateOfFirstAppointment" type="date" value={form.dateOfFirstAppointment} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Current Posting *</label>
                <input name="dateOfCurrentPosting" type="date" value={form.dateOfCurrentPosting} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grade Level *</label>
                <select name="gradeLevel" value={form.gradeLevel} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="">Select Grade Level</option>
                  {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17].map(g => (
                    <option key={g} value={g}>GL {g}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Step *</label>
                <select name="step" value={form.step} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="">Select Step</option>
                  {[1,2,3,4,5,6,7,8,9,10].map(s => (
                    <option key={s} value={s}>Step {s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button type="submit" disabled={loading}
              className="bg-green-700 hover:bg-green-800 text-white font-semibold py-3 px-8 rounded-lg transition disabled:opacity-50">
              {loading ? 'Creating...' : 'Create Staff Account'}
            </button>
            <button type="button" onClick={() => router.push('/dashboard/admin')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-8 rounded-lg transition">
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}