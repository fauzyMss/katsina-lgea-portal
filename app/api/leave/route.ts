import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      applicantId,
      leaveType,
      startDate,
      endDate,
      reason,
      schoolId,
    } = body

    // Calculate days requested
    const start = new Date(startDate)
    const end = new Date(endDate)
    const daysRequested = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1

    const leave = await prisma.leaveApplication.create({
      data: {
        applicantId,
        leaveType,
        startDate: start,
        endDate: end,
        daysRequested,
        reason,
        schoolId: schoolId || null,
        status: 'PENDING',
      }
    })

    return NextResponse.json({
      message: 'Leave application submitted successfully',
      leaveId: leave.id,
    })

  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to submit leave application' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const applicantId = searchParams.get('applicantId')
    const status = searchParams.get('status')

    const where: any = {}
    if (applicantId) where.applicantId = applicantId
    if (status) where.status = status

    const leaves = await prisma.leaveApplication.findMany({
      where,
      include: {
        applicant: {
          include: { staffProfile: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(leaves)

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch leave applications' },
      { status: 500 }
    )
  }
}