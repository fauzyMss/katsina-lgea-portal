import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      authorId,
      title,
      body: announcementBody,
      target,
      targetSchoolId,
      targetDept,
      isPinned,
      isUrgent,
      expiresAt,
    } = body

    const announcement = await prisma.announcement.create({
      data: {
        authorId,
        title,
        body: announcementBody,
        target,
        targetSchoolId: targetSchoolId || null,
        targetDept: targetDept || null,
        isPinned: isPinned || false,
        isUrgent: isUrgent || false,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      }
    })

    return NextResponse.json({
      message: 'Announcement created successfully',
      announcementId: announcement.id,
    })

  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to create announcement' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const announcements = await prisma.announcement.findMany({
      include: {
        author: {
          include: { staffProfile: true }
        }
      },
      orderBy: [
        { isPinned: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json(announcements)

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch announcements' },
      { status: 500 }
    )
  }
}