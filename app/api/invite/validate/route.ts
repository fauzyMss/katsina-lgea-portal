import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { roleFor, createdById, expiresInDays, batchName } = body

    const code = crypto.randomBytes(6).toString('hex').toUpperCase()

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + (expiresInDays || 7))

    const inviteCode = await prisma.inviteCode.create({
      data: {
        code,
        batchName: batchName || roleFor,
        createdBy: createdById || 'admin',
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

export async function GET() {
  try {
    const codes = await prisma.inviteCode.findMany({
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