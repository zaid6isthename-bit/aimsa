import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, requirePermission } from '@/lib/auth';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');

    const where: Record<string, string> = {};
    if (status) where.status = status;
    if (category) where.category = category;

    const events = await prisma.event.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(events);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('GET events error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requirePermission('event:write');
    const body = await request.json();

    let slug = generateSlug(body.title);
    const existing = await prisma.event.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const event = await prisma.event.create({
      data: {
        title: body.title,
        slug,
        description: body.description || '',
        fullStory: body.fullStory || '',
        category: body.category || 'technical',
        date: body.date || '',
        time: body.time || '',
        venue: body.venue || '',
        shortDesc: body.shortDesc || '',
        coverUrl: body.coverUrl || '',
        registrationUrl: body.registrationUrl || '',
        attendeeCount: body.attendeeCount || 0,
        featured: body.featured || false,
        status: body.status || 'draft',
        scheduleStatus: body.scheduleStatus || 'upcoming',
        organizers: body.organizers || '',
        rules: body.rules || '',
        results: body.results || '',
        galleryImages: body.galleryImages || '[]',
      },
    });

    await prisma.activityLog.create({
      data: {
        adminId: user.id,
        adminName: user.name,
        action: 'create',
        contentType: 'event',
        contentId: event.id,
        contentName: event.title,
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    console.error('POST events error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
