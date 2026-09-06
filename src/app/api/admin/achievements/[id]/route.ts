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

    const achievement = await prisma.achievement.findUnique({ where: { id } });
    if (!achievement) {
      return NextResponse.json({ error: 'Achievement not found' }, { status: 404 });
    }
    return NextResponse.json(achievement);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('GET achievement error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requirePermission('achievement:write');
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.achievement.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Achievement not found' }, { status: 404 });
    }

    const achievement = await prisma.achievement.update({
      where: { id },
      data: {
        title: body.title ?? existing.title,
        description: body.description ?? existing.description,
        category: body.category ?? existing.category,
        date: body.date ?? existing.date,
        competition: body.competition ?? existing.competition,
        participants: body.participants ?? existing.participants,
        position: body.position ?? existing.position,
        imageUrl: body.imageUrl ?? existing.imageUrl,
        externalLink: body.externalLink ?? existing.externalLink,
      },
    });

    await prisma.activityLog.create({
      data: {
        adminId: user.id,
        adminName: user.name,
        action: 'update',
        contentType: 'achievement',
        contentId: achievement.id,
        contentName: achievement.title,
      },
    });

    return NextResponse.json(achievement);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    console.error('PUT achievement error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requirePermission('achievement:write');
    const { id } = await params;

    const existing = await prisma.achievement.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Achievement not found' }, { status: 404 });
    }

    await prisma.achievement.delete({ where: { id } });

    await prisma.activityLog.create({
      data: {
        adminId: user.id,
        adminName: user.name,
        action: 'delete',
        contentType: 'achievement',
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
    console.error('DELETE achievement error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
