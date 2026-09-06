import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const albumId = searchParams.get('albumId');
    const category = searchParams.get('category');

    const where: Record<string, unknown> = {};

    if (albumId) {
      where.albumId = albumId;
    }

    if (category) {
      where.category = category;
    }

    const images = await prisma.galleryImage.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
    });

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Failed to fetch gallery images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery images' },
      { status: 500 }
    );
  }
}
