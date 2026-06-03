import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [
      totalStaff,
      totalSchools,
      pendingLeaves,
      openComplaints,
      pendingPromotions,
      pendingTransfers,
      activeInviteCodes,
    ] = await Promise.all([
      prisma.user.count({ where: { isActive: true } }),
      prisma.school.count({ where: { isActive: true } }),
      prisma.leaveApplication.count({ where: { status: 'PENDING' } }),
      prisma.complaint.count({ where: { status: 'SUBMITTED' } }),
      prisma.promotionRecord.count({ where: { status: 'PENDING' } }),
      prisma.transferRequest.count({ where: { status: 'PENDING' } }),
      prisma.inviteCode.count({ where: { isActive: true, usedAt: null } }),
    ])

    return NextResponse.json({
      totalStaff,
      totalSchools,
      pendingLeaves,
      openComplaints,
      pendingPromotions,
      pendingTransfers,
      activeInviteCodes,
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}