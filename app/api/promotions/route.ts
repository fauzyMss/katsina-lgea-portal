import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      staffId,
      fromGradeLevel,
      fromStep,
      toGradeLevel,
      toStep,
      effectiveDate,
      notes,
    } = body

    const promotion = await prisma.promotionRecord.create({
      data: {
        staffId,
        fromGradeLevel: parseInt(fromGradeLevel),
        fromStep: parseInt(fromStep),
        toGradeLevel: parseInt(toGradeLevel),
        toStep: parseInt(toStep),
        effectiveDate: new Date(effectiveDate),
        notes,
        status: 'PENDING',
      }
    })

    return NextResponse.json({
      message: 'Promotion record created successfully',
      promotionId: promotion.id,
    })

  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to create promotion record' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const staffId = searchParams.get('staffId')
    const status = searchParams.get('status')

    const where: any = {}
    if (staffId) where.staffId = staffId
    if (status) where.status = status

    const promotions = await prisma.promotionRecord.findMany({
      where,
      include: {
        staff: {
          include: { staffProfile: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(promotions)

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch promotions' },
      { status: 500 }
    )
  }
}