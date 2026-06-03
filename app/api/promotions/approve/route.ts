import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { promotionId, action, confirmedById, notes } = body

    await prisma.promotionRecord.update({
      where: { id: promotionId },
      data: {
        status: action === 'approve' ? 'APPROVED' : 'REJECTED',
        confirmedById,
        confirmedAt: new Date(),
        notes,
      }
    })

    return NextResponse.json({
      message: `Promotion ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process promotion' },
      { status: 500 }
    )
  }
}