import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, requirePermission } from '@/lib/auth';

export async function GET() {
  try {
    await requireAuth();
    const albums = await prisma.galleryAlbum.findMany({
      orderBy: { createdAt: 'desc' },
      include: { images: true },
    });
    return NextResponse.json(albums);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('GET albums error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requirePermission('gallery:write');
    const body = await request.json();

    const album = await prisma.galleryAlbum.create({
      data: {
        title: body.title || '',
        description: body.description || '',
        category: body.category || '',
        coverUrl: body.coverUrl || '',
      },
    });

    await prisma.activityLog.create({
      data: {
        adminId: user.id,
        adminName: user.name,
        action: 'create',
        contentType: 'gallery_album',
        contentId: album.id,
        contentName: album.title,
      },
    });

    return NextResponse.json(album, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    console.error('POST albums error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
