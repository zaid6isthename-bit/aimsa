import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, requirePermission } from '@/lib/auth';

export async function GET() {
  try {
    await requireAuth();
    const settings = await prisma.siteSetting.findMany({
      orderBy: { key: 'asc' },
    });
    return NextResponse.json(settings);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('GET settings error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await requirePermission('settings:write');
    const body = await request.json();
    const { settings } = body as { settings: { key: string; value: string }[] };

    if (!Array.isArray(settings)) {
      return NextResponse.json({ error: 'Settings must be an array' }, { status: 400 });
    }

    const upserts = settings.map((s) =>
      prisma.siteSetting.upsert({
        where: { key: s.key },
        update: { value: s.value },
        create: { key: s.key, value: s.value },
      })
    );

    await prisma.$transaction(upserts);

    await prisma.activityLog.create({
      data: {
        adminId: user.id,
        adminName: user.name,
        action: 'update',
        contentType: 'settings',
        contentId: '',
        contentName: `Updated ${settings.length} settings`,
      },
    });

    const updated = await prisma.siteSetting.findMany({ orderBy: { key: 'asc' } });
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    console.error('PUT settings error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
