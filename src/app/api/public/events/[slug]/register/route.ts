import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();

    const {
      name,
      email,
      phone = '',
      rollNumber = '',
      year = '1st Year',
      branch = 'AI & ML',
      teamName = '',
      teamMembers = '',
      notes = '',
      customAnswers = {},
    } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Full name is required' },
        { status: 400 }
      );
    }

    if (!email || !email.trim() || !email.includes('@')) {
      return NextResponse.json(
        { error: 'A valid email address is required' },
        { status: 400 }
      );
    }

    // Find the event
    const event = await prisma.event.findFirst({
      where: { slug },
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Check if registration is open
    if (event.registrationOpen === false) {
      return NextResponse.json(
        { error: 'Registrations for this event are currently closed by the event admin.' },
        { status: 400 }
      );
    }

    // Check capacity if set
    if (event.maxCapacity && event.maxCapacity > 0) {
      const currentCount = await prisma.eventRegistration.count({
        where: {
          OR: [{ eventId: event.id }, { eventSlug: slug }],
          status: { not: 'cancelled' },
        },
      });

      if (currentCount >= event.maxCapacity) {
        return NextResponse.json(
          { error: 'Attendee capacity for this event has been reached. Please check back later or contact AIMSA.' },
          { status: 400 }
        );
      }
    }

    // Check duplicate registration
    const existing = await prisma.eventRegistration.findFirst({
      where: {
        email: email.trim().toLowerCase(),
        OR: [{ eventId: event.id }, { eventSlug: slug }],
        status: { not: 'cancelled' },
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          error: 'You are already registered for this event with this email address.',
          registration: existing,
        },
        { status: 409 }
      );
    }

    // Create registration record
    const registration = await prisma.eventRegistration.create({
      data: {
        eventId: event.id,
        eventTitle: event.title,
        eventSlug: event.slug,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        rollNumber: rollNumber.trim().toUpperCase(),
        year,
        branch: branch.trim(),
        teamName: teamName.trim(),
        teamMembers: teamMembers.trim(),
        customAnswers: typeof customAnswers === 'string' ? customAnswers : JSON.stringify(customAnswers),
        status: 'confirmed',
        notes: notes.trim(),
      },
    });

    // Increment attendee count on Event
    try {
      await prisma.event.update({
        where: { id: event.id },
        data: { attendeeCount: { increment: 1 } },
      });
    } catch {
      // Non-critical if count fails
    }

    return NextResponse.json({
      success: true,
      message: 'Registration successful!',
      registration: {
        id: registration.id,
        eventTitle: registration.eventTitle,
        eventSlug: registration.eventSlug,
        name: registration.name,
        email: registration.email,
        phone: registration.phone,
        rollNumber: registration.rollNumber,
        year: registration.year,
        branch: registration.branch,
        teamName: registration.teamName,
        status: registration.status,
        createdAt: registration.createdAt,
      },
    });
  } catch (error) {
    console.error('Registration API error:', error);
    return NextResponse.json(
      { error: 'Failed to process event registration. Please try again.' },
      { status: 500 }
    );
  }
}
