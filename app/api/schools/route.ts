import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, code, ward, lga, address, zone } = body

    // Check if school code already exists
    const existing = await prisma.school.findUnique({
      where: { code }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'School code already exists' },
        { status: 400 }
      )
    }

    const school = await prisma.school.create({
      data: {
        name,
        code,
        ward,
        lga,
        address,
        zone,
        isActive: true,
      }
    })

    return NextResponse.json({
      message: 'School created successfully',
      schoolId: school.id,
    })

  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to create school' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const schools = await prisma.school.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json(schools)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch schools' },
      { status: 500 }
    )
  }
}