import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, requirePermission } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;

    const album = await prisma.galleryAlbum.findUnique({
      where: { id },
      include: { images: true },
    });
    if (!album) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 });
    }
    return NextResponse.json(album);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('GET album error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requirePermission('gallery:write');
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.galleryAlbum.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 });
    }

    const album = await prisma.galleryAlbum.update({
      where: { id },
      data: {
        title: body.title ?? existing.title,
        description: body.description ?? existing.description,
        category: body.category ?? existing.category,
        coverUrl: body.coverUrl ?? existing.coverUrl,
      },
    });

    await prisma.activityLog.create({
      data: {
        adminId: user.id,
        adminName: user.name,
        action: 'update',
        contentType: 'gallery_album',
        contentId: album.id,
        contentName: album.title,
      },
    });

    return NextResponse.json(album);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    console.error('PUT album error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requirePermission('gallery:write');
    const { id } = await params;

    const existing = await prisma.galleryAlbum.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 });
    }

    await prisma.galleryAlbum.delete({ where: { id } });

    await prisma.activityLog.create({
      data: {
        adminId: user.id,
        adminName: user.name,
        action: 'delete',
        contentType: 'gallery_album',
        contentId: id,
        contentName: existing.title,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    console.error('DELETE album error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
