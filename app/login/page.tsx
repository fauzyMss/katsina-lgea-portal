'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Login failed')
        setLoading(false)
        return
      }

      // Redirect based on role
      const role = data.role
      if (role === 'SUPER_ADMIN') router.push('/dashboard/admin')
      else if (role === 'EDUCATION_SECRETARY') router.push('/dashboard/es')
      else if (role === 'HEADTEACHER') router.push('/dashboard/headteacher')
      else if (role === 'TEACHER') router.push('/dashboard/teacher')
      else if (role === 'HOD_PERSONNEL') router.push('/dashboard/personnel')
      else if (role === 'HOD_FINANCE') router.push('/dashboard/finance')
      else if (role === 'HOD_ACADEMIC') router.push('/dashboard/academic')
      else if (role === 'HOD_QA') router.push('/dashboard/qa')
      else if (role === 'HOD_MOBILIZATION') router.push('/dashboard/mobilization')
      else if (role === 'HOD_PHYSICAL_PLANNING') router.push('/dashboard/planning')
      else if (role === 'HOD_TEACHER_DEV') router.push('/dashboard/teacherdev')
      else if (role === 'HOD_SPECIAL_PROGRAM') router.push('/dashboard/special')
      else if (role === 'HOD_PRS') router.push('/dashboard/prs')
      else if (role === 'EMIS_UNIT_HEAD') router.push('/dashboard/emis')
      else if (role === 'ME_UNIT_HEAD') router.push('/dashboard/me')
      else if (role === 'STAFF_OFFICER') router.push('/dashboard/staffofficer')
      else if (role.startsWith('AEO_ZONE_')) router.push('/dashboard/aeo')
      else router.push('/dashboard')

    } catch (err) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">

        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">K</span>
          </div>
          <h1 className="text-2xl font-bold text-green-800">
            Katsina LGEA Portal
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Staff Management System
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your.email@ktlgea.gov.ng"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Katsina Local Government Education Authority © 2026
        </p>
      </div>
    </div>
  )
}