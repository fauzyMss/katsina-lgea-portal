import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { complainantId, category, description, isConfidential } = body

    const complaint = await prisma.complaint.create({
      data: {
        complainantId,
        category,
        description,
        isConfidential: isConfidential || false,
        isSalaryIssue: category === 'SALARY',
        status: 'SUBMITTED',
      }
    })

    return NextResponse.json({
      message: 'Complaint submitted successfully',
      complaintId: complaint.id,
    })

  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to submit complaint' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const complainantId = searchParams.get('complainantId')
    const status = searchParams.get('status')

    const where: any = {}
    if (complainantId) where.complainantId = complainantId
    if (status) where.status = status

    const complaints = await prisma.complaint.findMany({
      where,
      include: {
        complainant: {
          include: { staffProfile: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(complaints)

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch complaints' },
      { status: 500 }
    )
  }
}