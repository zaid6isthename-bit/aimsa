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

    return NextResponse.json({ events });
  } catch (error) {
    console.error('Failed to fetch public events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
