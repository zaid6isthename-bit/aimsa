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

    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    return NextResponse.json(event);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('GET event error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requirePermission('event:write');
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const event = await prisma.event.update({
      where: { id },
      data: {
        title: body.title ?? existing.title,
        slug: body.title
          ? body.title
              .toLowerCase()
              .replace(/[^a-z0-9\s-]/g, '')
              .replace(/\s+/g, '-')
              .replace(/-+/g, '-')
              .replace(/^-|-$/g, '')
          : existing.slug,
        description: body.description ?? existing.description,
        fullStory: body.fullStory ?? existing.fullStory,
        category: body.category ?? existing.category,
        date: body.date ?? existing.date,
        time: body.time ?? existing.time,
        venue: body.venue ?? existing.venue,
        shortDesc: body.shortDesc ?? existing.shortDesc,
        coverUrl: body.coverUrl ?? existing.coverUrl,
        registrationUrl: body.registrationUrl ?? existing.registrationUrl,
        attendeeCount: body.attendeeCount ?? existing.attendeeCount,
        featured: body.featured ?? existing.featured,
        status: body.status ?? existing.status,
        scheduleStatus: body.scheduleStatus ?? existing.scheduleStatus,
        organizers: body.organizers ?? existing.organizers,
        rules: body.rules ?? existing.rules,
        results: body.results ?? existing.results,
        galleryImages: body.galleryImages ?? existing.galleryImages,
      },
    });

    await prisma.activityLog.create({
      data: {
        adminId: user.id,
        adminName: user.name,
        action: 'update',
        contentType: 'event',
        contentId: event.id,
        contentName: event.title,
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    console.error('PUT event error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requirePermission('event:write');
    const { id } = await params;

    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    await prisma.event.delete({ where: { id } });

    await prisma.activityLog.create({
      data: {
        adminId: user.id,
        adminName: user.name,
        action: 'delete',
        contentType: 'event',
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
    console.error('DELETE event error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
