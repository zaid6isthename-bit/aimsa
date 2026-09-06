import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, requirePermission } from '@/lib/auth';

export async function GET() {
  try {
    await requireAuth();
    const achievements = await prisma.achievement.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(achievements);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('GET achievements error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requirePermission('achievement:write');
    const body = await request.json();

    const achievement = await prisma.achievement.create({
      data: {
        title: body.title || '',
        description: body.description || '',
        category: body.category || '',
        date: body.date || '',
        competition: body.competition || '',
        participants: body.participants || '',
        position: body.position || '',
        imageUrl: body.imageUrl || '',
        externalLink: body.externalLink || '',
      },
    });

    await prisma.activityLog.create({
      data: {
        adminId: user.id,
        adminName: user.name,
        action: 'create',
        contentType: 'achievement',
        contentId: achievement.id,
        contentName: achievement.title,
      },
    });

    return NextResponse.json(achievement, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    console.error('POST achievements error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
