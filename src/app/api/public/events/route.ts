import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');

    const where: Record<string, unknown> = { status: 'published' };

    if (category) {
      where.category = category;
    }

    if (featured === 'true') {
      where.featured = true;
    }

    const events = await prisma.event.findMany({
      where,
      orderBy: { date: 'desc' },
    });

    const parsed = events.map((e) => ({
      ...e,
      organizers: typeof e.organizers === 'string' ? e.organizers.split(',').map((s) => s.trim()).filter(Boolean) : e.organizers ?? [],
      galleryImages: typeof e.galleryImages === 'string' ? (() => { try { return JSON.parse(e.galleryImages); } catch { return []; } })() : e.galleryImages ?? [],
    }));

    return NextResponse.json({ events: parsed });
  } catch (error) {
    console.error('Failed to fetch public events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
