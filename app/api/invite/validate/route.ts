import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    const inviteCode = await prisma.inviteCode.findUnique({
      where: { code }
    })

    if (!inviteCode) {
      return NextResponse.json(
        { error: 'Invalid invite code' },
        { status: 400 }
      )
    }

    if (!inviteCode.isActive) {
      return NextResponse.json(
        { error: 'This invite code has already been used' },
        { status: 400 }
      )
    }

    if (inviteCode.expiresAt && new Date() > inviteCode.expiresAt) {
      return NextResponse.json(
        { error: 'This invite code has expired' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      valid: true,
      roleFor: inviteCode.roleFor,
      batchName: inviteCode.batchName,
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to validate invite code' },
      { status: 500 }
    )
  }
}