import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { transferId, action, processedById, notes } = body

    const transfer = await prisma.transferRequest.update({
      where: { id: transferId },
      data: {
        status: action === 'approve' ? 'APPROVED' : 'REJECTED',
        processedById,
        processedAt: new Date(),
        notes: notes || null,
      }
    })

    // If approved and it is a headteacher transfer
    // automatically update school access
    if (action === 'approve') {
      const user = await prisma.user.findUnique({
        where: { id: transfer.requestedById }
      })

      if (user?.role === 'HEADTEACHER' && transfer.toSchoolId) {
        // Update headteacher history
        await prisma.headteacherHistory.updateMany({
          where: {
            userId: transfer.requestedById,
            isActive: true,
          },
          data: {
            isActive: false,
            endDate: new Date(),
          }
        })

        // Create new history record
        await prisma.headteacherHistory.create({
          data: {
            userId: transfer.requestedById,
            schoolId: transfer.toSchoolId,
            startDate: new Date(),
            isActive: true,
          }
        })

        // Notify HOD Personnel automatically
        await prisma.notification.create({
          data: {
            userId: transfer.requestedById,
            type: 'TRANSFER_UPDATE',
            title: 'Transfer Approved',
            message: 'Your transfer request has been approved. Your school access has been updated.',
          }
        })
      }
    }

    return NextResponse.json({
      message: `Transfer ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
    })

  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to process transfer' },
      { status: 500 }
    )
  }
}