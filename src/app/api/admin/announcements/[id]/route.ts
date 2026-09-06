import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, requirePermission } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;

    const announcement = await prisma.announcement.findUnique({ where: { id } });
    if (!announcement) {
      return NextResponse.json({ error: 'Announcement not found' }, { status: 404 });
    }
    return NextResponse.json(announcement);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('GET announcement error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requirePermission('announcement:write');
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.announcement.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Announcement not found' }, { status: 404 });
    }

    const announcement = await prisma.announcement.update({
      where: { id },
      data: {
        title: body.title ?? existing.title,
        content: body.content ?? existing.content,
        category: body.category ?? existing.category,
        imageUrl: body.imageUrl ?? existing.imageUrl,
        link: body.link ?? existing.link,
        pinned: body.pinned ?? existing.pinned,
        status: body.status ?? existing.status,
        publishedAt: body.publishedAt !== undefined
          ? body.publishedAt ? new Date(body.publishedAt) : null
          : existing.publishedAt,
      },
    });

    await prisma.activityLog.create({
      data: {
        adminId: user.id,
        adminName: user.name,
        action: 'update',
        contentType: 'announcement',
        contentId: announcement.id,
        contentName: announcement.title,
      },
    });

    return NextResponse.json(announcement);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    console.error('PUT announcement error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requirePermission('announcement:write');
    const { id } = await params;

    const existing = await prisma.announcement.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Announcement not found' }, { status: 404 });
    }

    await prisma.announcement.delete({ where: { id } });

    await prisma.activityLog.create({
      data: {
        adminId: user.id,
        adminName: user.name,
        action: 'delete',
        contentType: 'announcement',
        contentId: id,
        contentName: existing.title,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    console.error('DELETE announcement error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
