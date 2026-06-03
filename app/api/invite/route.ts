import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

// Generate invite code
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { roleFor, createdById, expiresInDays, batchName } = body

    // Generate unique code
    const code = crypto.randomBytes(6).toString('hex').toUpperCase()

    // Set expiry date
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + (expiresInDays || 7))

    const inviteCode = await prisma.inviteCode.create({
      data: {
        code,
        roleFor,
        batchName,
        createdById,
        expiresAt,
        isActive: true,
      }
    })

    return NextResponse.json({
      message: 'Invite code generated successfully',
      code: inviteCode.code,
      expiresAt: inviteCode.expiresAt,
    })

  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to generate invite code' },
      { status: 500 }
    )
  }
}

// Get all invite codes
export async function GET() {
  try {
    const codes = await prisma.inviteCode.findMany({
      include: {
        createdBy: {
          include: { staffProfile: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(codes)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch invite codes' },
      { status: 500 }
    )
  }
}