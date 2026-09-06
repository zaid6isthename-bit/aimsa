import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, requirePermission } from '@/lib/auth';

export async function GET() {
  try {
    await requireAuth();
    const members = await prisma.teamMember.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    return NextResponse.json(members);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('GET team error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requirePermission('team:write');
    const body = await request.json();

    const member = await prisma.teamMember.create({
      data: {
        name: body.name || '',
        slug: body.slug || body.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || '',
        role: body.role || '',
        category: body.category || '',
        year: body.year || '',
        photoUrl: body.photoUrl || '',
        bio: body.bio || '',
        quote: body.quote || '',
        contributions: body.contributions || '[]',
        github: body.github || '',
        linkedin: body.linkedin || '',
        email: body.email || '',
        highlightTag: body.highlightTag || '',
        displayOrder: body.displayOrder || 0,
        isActive: body.isActive ?? true,
      },
    });

    await prisma.activityLog.create({
      data: {
        adminId: user.id,
        adminName: user.name,
        action: 'create',
        contentType: 'team',
        contentId: member.id,
        contentName: member.name,
      },
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    console.error('POST team error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
