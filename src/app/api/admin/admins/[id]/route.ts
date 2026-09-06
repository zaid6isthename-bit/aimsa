import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, requirePermission } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requirePermission('admin:read');
    if (user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const admin = await prisma.adminUser.findUnique({
      where: { id },
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
    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }
    return NextResponse.json(admin);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    console.error('GET admin error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requirePermission('admin:write');
    if (user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.adminUser.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {
      name: body.name ?? existing.name,
      email: body.email ?? existing.email,
      role: body.role ?? existing.role,
      status: body.status ?? existing.status,
    };

    if (body.username && body.username !== existing.username) {
      const usernameTaken = await prisma.adminUser.findUnique({ where: { username: body.username } });
      if (usernameTaken) {
        return NextResponse.json({ error: 'Username already exists' }, { status: 409 });
      }
      updateData.username = body.username;
    }

    if (body.email && body.email !== existing.email) {
      const emailTaken = await prisma.adminUser.findUnique({ where: { email: body.email } });
      if (emailTaken) {
        return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
      }
    }

    if (body.password) {
      updateData.passwordHash = await bcrypt.hash(body.password, 12);
    }

    const admin = await prisma.adminUser.update({
      where: { id },
      data: updateData,
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
        action: 'update',
        contentType: 'admin_user',
        contentId: admin.id,
        contentName: admin.username,
      },
    });

    return NextResponse.json(admin);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    console.error('PUT admin error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requirePermission('admin:delete');
    if (user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;

    if (id === user.id) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
    }

    const existing = await prisma.adminUser.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    await prisma.adminUser.delete({ where: { id } });

    await prisma.activityLog.create({
      data: {
        adminId: user.id,
        adminName: user.name,
        action: 'delete',
        contentType: 'admin_user',
        contentId: id,
        contentName: existing.username,
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
    console.error('DELETE admin error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
