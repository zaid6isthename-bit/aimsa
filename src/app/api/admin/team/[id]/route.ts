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

    const member = await prisma.teamMember.findUnique({ where: { id } });
    if (!member) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
    }
    return NextResponse.json(member);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('GET team member error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requirePermission('team:write');
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.teamMember.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
    }

    const member = await prisma.teamMember.update({
      where: { id },
      data: {
        name: body.name ?? existing.name,
        role: body.role ?? existing.role,
        category: body.category ?? existing.category,
        year: body.year ?? existing.year,
        photoUrl: body.photoUrl ?? existing.photoUrl,
        bio: body.bio ?? existing.bio,
        quote: body.quote ?? existing.quote,
        contributions: body.contributions ?? existing.contributions,
        github: body.github ?? existing.github,
        linkedin: body.linkedin ?? existing.linkedin,
        email: body.email ?? existing.email,
        highlightTag: body.highlightTag ?? existing.highlightTag,
        displayOrder: body.displayOrder ?? existing.displayOrder,
        isActive: body.isActive ?? existing.isActive,
      },
    });

    await prisma.activityLog.create({
      data: {
        adminId: user.id,
        adminName: user.name,
        action: 'update',
        contentType: 'team',
        contentId: member.id,
        contentName: member.name,
      },
    });

    return NextResponse.json(member);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    console.error('PUT team member error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requirePermission('team:write');
    const { id } = await params;

    const existing = await prisma.teamMember.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
    }

    await prisma.teamMember.delete({ where: { id } });

    await prisma.activityLog.create({
      data: {
        adminId: user.id,
        adminName: user.name,
        action: 'delete',
        contentType: 'team',
        contentId: id,
        contentName: existing.name,
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
    console.error('DELETE team member error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
