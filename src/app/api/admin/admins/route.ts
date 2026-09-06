import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, requirePermission } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const user = await requirePermission('admin:read');
    if (user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const admins = await prisma.adminUser.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        lastLogin: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(admins);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    console.error('GET admins error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requirePermission('admin:write');
    if (user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();

    if (!body.username || !body.password || !body.name || !body.email) {
      return NextResponse.json({ error: 'Username, password, name, and email are required' }, { status: 400 });
    }

    const existingUsername = await prisma.adminUser.findUnique({ where: { username: body.username } });
    if (existingUsername) {
      return NextResponse.json({ error: 'Username already exists' }, { status: 409 });
    }

    const existingEmail = await prisma.adminUser.findUnique({ where: { email: body.email } });
    if (existingEmail) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(body.password, 12);

    const admin = await prisma.adminUser.create({
      data: {
        username: body.username,
        name: body.name,
        email: body.email,
        passwordHash,
        role: body.role || 'content_admin',
        status: body.status || 'active',
      },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        lastLogin: true,
      },
    });

    await prisma.activityLog.create({
      data: {
        adminId: user.id,
        adminName: user.name,
        action: 'create',
        contentType: 'admin_user',
        contentId: admin.id,
        contentName: admin.username,
      },
    });

    return NextResponse.json(admin, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    console.error('POST admins error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
