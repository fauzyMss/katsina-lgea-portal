'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [inviteRole, setInviteRole] = useState('')

  const [form, setForm] = useState({
    inviteCode: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    staffId: '',
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
    staffType: 'TEACHER',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const validateCode = async () => {
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/invite/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: form.inviteCode }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error)
        setLoading(false)
        return
      }

      setInviteRole(data.roleFor)
      setStep(2)
    } catch (err) {
      setError('Something went wrong')
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error)
        setLoading(false)
        return
      }

      setSuccess('Registration successful! You can now log in.')
      setTimeout(() => router.push('/login'), 2000)
    } catch (err) {
      setError('Something went wrong')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-green-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">K</span>
          </div>
          <h1 className="text-2xl font-bold text-green-800">Katsina LGEA Portal</h1>
          <p className="text-gray-500 text-sm mt-1">Staff Registration</p>
        </div>

        {success ? (
          <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-8 rounded-xl text-center">
            <p className="text-4xl mb-3">✅</p>
            <p className="font-semibold text-lg">{success}</p>
            <p className="text-sm mt-2">Redirecting to login...</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-6">

            {/* Step Indicator */}
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
              <div className={`flex-1 h-1 rounded ${step >= 2 ? 'bg-green-700' : 'bg-gray-200'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>
            )}

            {/* Step 1 — Enter Invite Code */}
            {step === 1 && (
              <div>
                <h2 className="font-bold text-gray-800 text-lg mb-2">Enter Your Invite Code</h2>
                <p className="text-gray-500 text-sm mb-6">Enter the invite code provided by the KTLGEA admin</p>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Invite Code *</label>
                  <input
                    name="inviteCode"
                    value={form.inviteCode}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g. A1B2C3"
                    maxLength={12}
                  />
                </div>
                <button
                  onClick={validateCode}
                  disabled={loading || !form.inviteCode}
                  className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
                >
                  {loading ? 'Validating...' : 'Validate Code →'}
                </button>
                <p className="text-center text-sm text-gray-500 mt-4">
                  Already registered?{' '}
                  <button onClick={() => router.push('/login')} className="text-green-700 font-medium">Sign In</button>
                </p>
              </div>
            )}

            {/* Step 2 — Fill Registration Form */}
            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h2 className="font-bold text-gray-800 text-lg mb-1">Complete Your Registration</h2>
                  <p className="text-gray-500 text-sm mb-4">
                    Role: <span className="font-semibold text-green-700">{inviteRole?.replace(/_/g, ' ')}</span>
                  </p>
                </div>

                {/* Account */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input name="fullName" value={form.fullName} onChange={handleChange} required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Staff ID *</label>
                    <input name="staffId" value={form.staffId} onChange={handleChange} required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="e.g. KTLGEA/2024/001" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="your.email@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                    <input name="phone" value={form.phone} onChange={handleChange} required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="08012345678" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                    <input name="password" type="password" value={form.password} onChange={handleChange} required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Minimum 8 characters" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
                    <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Repeat password" />
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
                      placeholder="e.g. B.Ed, NCE" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Grade Level *</label>
                    <select name="gradeLevel" value={form.gradeLevel} onChange={handleChange} required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                      <option value="">Select GL</option>
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
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Residential Address *</label>
                    <textarea name="residentialAddress" value={form.residentialAddress} onChange={handleChange} required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Your full residential address" rows={2} />
                  </div>
                </div>

                <div className="flex gap-4 pt-2">
                  <button type="button" onClick={() => setStep(1)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg">
                    ← Back
                  </button>
                  <button type="submit" disabled={loading}
                    className="flex-1 bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50">
                    {loading ? 'Registering...' : 'Complete Registration ✅'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        <p className="text-center text-xs text-gray-400 mt-6">
          Katsina Local Government Education Authority © 2026
        </p>
      </div>
    </div>
  )
}