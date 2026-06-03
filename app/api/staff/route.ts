import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      email,
      password,
      role,
      staffType,
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
    } = body

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      )
    }

    // Check if staffId already exists
    const existingStaffId = await prisma.staffProfile.findUnique({
      where: { staffId }
    })

    if (existingStaffId) {
      return NextResponse.json(
        { error: 'Staff ID already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user and staff profile together
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        role,
        staffType,
        isActive: true,
        emailVerified: true,
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

    return NextResponse.json({
      message: 'Staff created successfully',
      userId: user.id,
    })

  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to create staff' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const staff = await prisma.user.findMany({
      where: { isActive: true },
      include: {
        staffProfile: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(staff)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch staff' },
      { status: 500 }
    )
  }
}