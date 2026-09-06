import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, requirePermission } from '@/lib/auth';

export async function GET() {
  try {
    await requireAuth();
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(projects);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('GET projects error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requirePermission('project:write');
    const body = await request.json();

    const project = await prisma.project.create({
      data: {
        name: body.name || '',
        description: body.description || '',
        technologyStack: body.technologyStack || '',
        category: body.category || '',
        imageUrl: body.imageUrl || '',
        githubLink: body.githubLink || '',
        demoLink: body.demoLink || '',
        teamMembers: body.teamMembers || '',
        status: body.status || 'active',
        featured: body.featured || false,
      },
    });

    await prisma.activityLog.create({
      data: {
        adminId: user.id,
        adminName: user.name,
        action: 'create',
        contentType: 'project',
        contentId: project.id,
        contentName: project.name,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    console.error('POST projects error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
