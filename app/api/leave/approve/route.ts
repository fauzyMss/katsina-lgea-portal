import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { leaveId, action, reviewedById, rejectionReason } = body

    const leave = await prisma.leaveApplication.update({
      where: { id: leaveId },
      data: {
        status: action === 'approve' ? 'APPROVED' : 'REJECTED',
        approvedById: reviewedById,
        approvedAt: new Date(),
        rejectionReason: rejectionReason || null,
      }
    })

    return NextResponse.json({
      message: `Leave ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process leave application' },
      { status: 500 }
    )
  }
}