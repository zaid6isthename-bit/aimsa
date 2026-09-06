import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, requirePermission } from '@/lib/auth';

export async function GET() {
  try {
    await requireAuth();
    const announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(announcements);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('GET announcements error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requirePermission('announcement:write');
    const body = await request.json();

    const announcement = await prisma.announcement.create({
      data: {
        title: body.title || '',
        content: body.content || '',
        category: body.category || 'general',
        imageUrl: body.imageUrl || '',
        link: body.link || '',
        pinned: body.pinned || false,
        status: body.status || 'draft',
        publishedAt: body.publishedAt ? new Date(body.publishedAt) : null,
      },
    });

    await prisma.activityLog.create({
      data: {
        adminId: user.id,
        adminName: user.name,
        action: 'create',
        contentType: 'announcement',
        contentId: announcement.id,
        contentName: announcement.title,
      },
    });

    return NextResponse.json(announcement, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    console.error('POST announcements error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
