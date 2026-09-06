import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const albums = await prisma.galleryAlbum.findMany({
      include: { images: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ albums });
  } catch (error) {
    console.error('Failed to fetch gallery albums:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery albums' },
      { status: 500 }
    );
  }
}
