import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, requirePermission } from '@/lib/auth';

export async function GET() {
  try {
    await requireAuth();
    const contacts = await prisma.contactInformation.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    return NextResponse.json(contacts);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('GET contacts error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await requirePermission('settings:write');
    const body = await request.json();
    const { contacts } = body as { contacts: { label: string; value: string; type: string; displayOrder: number }[] };

    if (!Array.isArray(contacts)) {
      return NextResponse.json({ error: 'Contacts must be an array' }, { status: 400 });
    }

    const upserts = contacts.map((c) =>
      prisma.contactInformation.upsert({
        where: { label: c.label },
        update: { value: c.value, type: c.type, displayOrder: c.displayOrder },
        create: { label: c.label, value: c.value, type: c.type, displayOrder: c.displayOrder },
      })
    );

    await prisma.$transaction(upserts);

    await prisma.activityLog.create({
      data: {
        adminId: user.id,
        adminName: user.name,
        action: 'update',
        contentType: 'contacts',
        contentId: '',
        contentName: `Updated ${contacts.length} contacts`,
      },
    });

    const updated = await prisma.contactInformation.findMany({ orderBy: { displayOrder: 'asc' } });
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    console.error('PUT contacts error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
