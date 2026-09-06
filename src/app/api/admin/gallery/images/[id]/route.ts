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

    const image = await prisma.galleryImage.findUnique({ where: { id } });
    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }
    return NextResponse.json(image);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('GET gallery image error:', error);
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

    const existing = await prisma.galleryImage.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    const image = await prisma.galleryImage.update({
      where: { id },
      data: {
        albumId: body.albumId !== undefined ? body.albumId : existing.albumId,
        title: body.title ?? existing.title,
        caption: body.caption ?? existing.caption,
        url: body.url ?? existing.url,
        category: body.category ?? existing.category,
        featured: body.featured ?? existing.featured,
        displayOrder: body.displayOrder ?? existing.displayOrder,
      },
    });

    await prisma.activityLog.create({
      data: {
        adminId: user.id,
        adminName: user.name,
        action: 'update',
        contentType: 'gallery_image',
        contentId: image.id,
        contentName: image.title,
      },
    });

    return NextResponse.json(image);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    console.error('PUT gallery image error:', error);
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

    const existing = await prisma.galleryImage.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    await prisma.galleryImage.delete({ where: { id } });

    await prisma.activityLog.create({
      data: {
        adminId: user.id,
        adminName: user.name,
        action: 'delete',
        contentType: 'gallery_image',
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
    console.error('DELETE gallery image error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
