import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const where: any = {};

    if (eventId && eventId !== 'all') {
      where.OR = [{ eventId }, { eventSlug: eventId }];
    }

    if (status && status !== 'all') {
      where.status = status;
    }

    if (search && search.trim()) {
      const q = search.trim();
      where.AND = [
        ...(where.AND || []),
        {
          OR: [
            { name: { contains: q } },
            { email: { contains: q } },
            { rollNumber: { contains: q } },
            { eventTitle: { contains: q } },
            { teamName: { contains: q } },
          ],
        },
      ];
    }

    const [registrations, events] = await Promise.all([
      prisma.eventRegistration.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.event.findMany({
        select: {
          id: true,
          title: true,
          slug: true,
          category: true,
          date: true,
          venue: true,
          attendeeCount: true,
          registrationOpen: true,
          maxCapacity: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    // Count registrations per event
    const eventStats = events.map((evt) => {
      const count = registrations.filter(
        (r) => r.eventId === evt.id || r.eventSlug === evt.slug
      ).length;
      return {
        ...evt,
        liveRegistrationCount: count,
      };
    });

    return NextResponse.json({
      registrations,
      events: eventStats,
      totalCount: registrations.length,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('GET admin registrations error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();

    const {
      eventId,
      eventTitle = '',
      eventSlug = '',
      name,
      email,
      phone = '',
      rollNumber = '',
      year = '1st Year',
      branch = 'AI & ML',
      teamName = '',
      teamMembers = '',
      status = 'confirmed',
      notes = '',
    } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    let finalTitle = eventTitle;
    let finalSlug = eventSlug;

    if (eventId) {
      const evt = await prisma.event.findUnique({ where: { id: eventId } });
      if (evt) {
        finalTitle = evt.title;
        finalSlug = evt.slug;
      }
    }

    const registration = await prisma.eventRegistration.create({
      data: {
        eventId: eventId || null,
        eventTitle: finalTitle || 'General Event',
        eventSlug: finalSlug || 'general-event',
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        rollNumber: rollNumber.trim().toUpperCase(),
        year,
        branch,
        teamName: teamName.trim(),
        teamMembers: teamMembers.trim(),
        status,
        notes: notes.trim(),
      },
    });

    if (eventId) {
      try {
        await prisma.event.update({
          where: { id: eventId },
          data: { attendeeCount: { increment: 1 } },
        });
      } catch {}
    }

    return NextResponse.json({
      success: true,
      registration,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('POST admin registration error:', error);
    return NextResponse.json(
      { error: 'Failed to create registration' },
      { status: 500 }
    );
  }
}
