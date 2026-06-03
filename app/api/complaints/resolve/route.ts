import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { complaintId, status, resolutionNotes, resolvedById } = body

    await prisma.complaint.update({
      where: { id: complaintId },
      data: {
        status,
        resolutionNotes,
        resolvedById,
        resolvedAt: status === 'RESOLVED' ? new Date() : null,
      }
    })

    return NextResponse.json({
      message: 'Complaint updated successfully',
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update complaint' },
      { status: 500 }
    )
  }
}