import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      requestedById,
      fromSchoolId,
      toSchoolId,
      toDepartment,
      reason,
      recommendedBy,
    } = body

    const transfer = await prisma.transferRequest.create({
      data: {
        requestedById,
        fromSchoolId: fromSchoolId || null,
        toSchoolId: toSchoolId || null,
        toDepartment: toDepartment || null,
        reason,
        recommendedBy: recommendedBy || null,
        status: 'PENDING',
      }
    })

    return NextResponse.json({
      message: 'Transfer request submitted successfully',
      transferId: transfer.id,
    })

  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to submit transfer request' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const requestedById = searchParams.get('requestedById')
    const status = searchParams.get('status')

    const where: any = {}
    if (requestedById) where.requestedById = requestedById
    if (status) where.status = status

    const transfers = await prisma.transferRequest.findMany({
      where,
      include: {
        requestedBy: {
          include: { staffProfile: true }
        },
        fromSchool: true,
        toSchool: true,
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(transfers)

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch transfers' },
      { status: 500 }
    )
  }
}