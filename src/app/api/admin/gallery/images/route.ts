import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, requirePermission } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    const { searchParams } = new URL(request.url);
    const albumId = searchParams.get('albumId');

    const where: Record<string, string> = {};
    if (albumId) where.albumId = albumId;

    const images = await prisma.galleryImage.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
    });
    return NextResponse.json(images);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('GET gallery images error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requirePermission('gallery:write');
    const body = await request.json();

    const image = await prisma.galleryImage.create({
      data: {
        albumId: body.albumId || null,
        title: body.title || '',
        caption: body.caption || '',
        url: body.url || '',
        category: body.category || '',
        featured: body.featured || false,
        displayOrder: body.displayOrder || 0,
      },
    });

    await prisma.activityLog.create({
      data: {
        adminId: user.id,
        adminName: user.name,
        action: 'create',
        contentType: 'gallery_image',
        contentId: image.id,
        contentName: image.title,
      },
    });

    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    console.error('POST gallery images error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
