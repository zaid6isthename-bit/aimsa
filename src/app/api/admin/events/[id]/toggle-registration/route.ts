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

    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const updated = await prisma.event.update({
      where: { id },
      data: {
        ...(body.registrationOpen !== undefined && { registrationOpen: Boolean(body.registrationOpen) }),
        ...(body.maxCapacity !== undefined && { maxCapacity: Number(body.maxCapacity) }),
      },
    });

    return NextResponse.json({
      success: true,
      event: {
        id: updated.id,
        title: updated.title,
        slug: updated.slug,
        registrationOpen: updated.registrationOpen,
        maxCapacity: updated.maxCapacity,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Toggle registration error:', error);
    return NextResponse.json(
      { error: 'Failed to update event registration status' },
      { status: 500 }
    );
  }
}
