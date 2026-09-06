import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const event = await prisma.event.findFirst({
      where: {
        slug,
        status: 'published',
      },
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    const parsed = {
      ...event,
      organizers: typeof event.organizers === 'string' ? event.organizers.split(',').map((s) => s.trim()).filter(Boolean) : event.organizers ?? [],
      galleryImages: typeof event.galleryImages === 'string' ? (() => { try { return JSON.parse(event.galleryImages); } catch { return []; } })() : event.galleryImages ?? [],
    };

    return NextResponse.json({ event: parsed });
  } catch (error) {
    console.error('Failed to fetch event:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}
