import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.eventRegistration.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    const updated = await prisma.eventRegistration.update({
      where: { id },
      data: {
        ...(body.status && { status: body.status }),
        ...(body.notes !== undefined && { notes: body.notes }),
        ...(body.name && { name: body.name }),
        ...(body.email && { email: body.email }),
        ...(body.phone !== undefined && { phone: body.phone }),
        ...(body.rollNumber !== undefined && { rollNumber: body.rollNumber }),
        ...(body.year && { year: body.year }),
        ...(body.branch && { branch: body.branch }),
        ...(body.teamName !== undefined && { teamName: body.teamName }),
      },
    });

    return NextResponse.json({
      success: true,
      registration: updated,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('PATCH admin registration error:', error);
    return NextResponse.json(
      { error: 'Failed to update registration' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;

    const existing = await prisma.eventRegistration.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    await prisma.eventRegistration.delete({ where: { id } });

    // Decrement attendee count if tied to an event
    if (existing.eventId) {
      try {
        await prisma.event.update({
          where: { id: existing.eventId },
          data: { attendeeCount: { decrement: 1 } },
        });
      } catch {}
    }

    return NextResponse.json({ success: true, message: 'Registration deleted' });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('DELETE admin registration error:', error);
    return NextResponse.json(
      { error: 'Failed to delete registration' },
      { status: 500 }
    );
  }
}
