import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      inviteCode,
      email,
      password,
      fullName,
      staffId,
      phone,
      gender,
      dateOfBirth,
      dateOfFirstAppointment,
      dateOfCurrentPosting,
      gradeLevel,
      step,
      highestQualification,
      stateOfOrigin,
      lgaOfOrigin,
      residentialAddress,
      staffType,
    } = body

    // Validate invite code
    const invite = await prisma.inviteCode.findUnique({
      where: { code: inviteCode }
    })

    if (!invite || !invite.isActive) {
      return NextResponse.json(
        { error: 'Invalid or already used invite code' },
        { status: 400 }
      )
    }

    if (invite.expiresAt && new Date() > invite.expiresAt) {
      return NextResponse.json(
        { error: 'Invite code has expired' },
        { status: 400 }
      )
    }

    // Check email exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      )
    }

    // Check staffId exists
    const existingStaffId = await prisma.staffProfile.findUnique({
      where: { staffId }
    })

    if (existingStaffId) {
      return NextResponse.json(
        { error: 'Staff ID already registered' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user and profile
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        role: invite.roleFor || 'TEACHER',
        staffType: staffType || 'TEACHER',
        isActive: true,
        emailVerified: true,
        inviteCodeUsed: inviteCode,
        staffProfile: {
          create: {
            fullName,
            staffId,
            phoneNumber: phone,
            gender,
            dateOfBirth: new Date(dateOfBirth),
            dateOfFirstAppointment: new Date(dateOfFirstAppointment),
            dateOfCurrentPosting: new Date(dateOfCurrentPosting),
            gradeLevel: parseInt(gradeLevel),
            step: parseInt(step),
            highestQualification,
            stateOfOrigin,
            lgaOfOrigin,
            residentialAddress,
          }
        }
      }
    })

    // Mark invite code as used
    await prisma.inviteCode.update({
      where: { code: inviteCode },
      data: {
        isActive: false,
        usedBy: user.id,
        usedAt: new Date(),
      }
    })

    return NextResponse.json({
      message: 'Registration successful! You can now log in.',
    })

  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    )
  }
}