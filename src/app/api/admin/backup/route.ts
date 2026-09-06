import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { copyFile, readdir, stat } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const DB_PATH = join(process.cwd(), 'prisma', 'dev.db');
const BACKUP_DIR = join(process.cwd(), 'backups');

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    if (user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Super admin required' }, { status: 403 });
    }

    if (!existsSync(BACKUP_DIR)) {
      const { mkdir } = await import('fs/promises');
      await mkdir(BACKUP_DIR, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupName = `aimsa-backup-${timestamp}.db`;
    const backupPath = join(BACKUP_DIR, backupName);

    await copyFile(DB_PATH, backupPath);

    await (await import('@/lib/prisma')).prisma.activityLog.create({
      data: {
        adminId: user.id,
        adminName: user.name,
        action: 'created backup',
        contentType: 'system',
        contentId: '',
        contentName: backupName,
      },
    });

    return NextResponse.json({ success: true, filename: backupName });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Backup failed';
    if (message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Backup error:', error);
    return NextResponse.json({ error: 'Backup failed' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    if (user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Super admin required' }, { status: 403 });
    }

    const action = request.nextUrl.searchParams.get('action');

    if (action === 'download') {
      const filename = request.nextUrl.searchParams.get('file');
      if (!filename) {
        return NextResponse.json({ error: 'No filename' }, { status: 400 });
      }
      const filepath = join(BACKUP_DIR, filename);
      if (!existsSync(filepath)) {
        return NextResponse.json({ error: 'Backup not found' }, { status: 404 });
      }
      const { readFile } = await import('fs/promises');
      const data = await readFile(filepath);
      return new NextResponse(data, {
        headers: {
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      });
    }

    if (!existsSync(BACKUP_DIR)) {
      return NextResponse.json({ backups: [] });
    }

    const files = await readdir(BACKUP_DIR);
    const dbFiles = files.filter((f) => f.endsWith('.db'));
    const backups = await Promise.all(
      dbFiles.map(async (f) => {
        const s = await stat(join(BACKUP_DIR, f));
        return { filename: f, size: s.size, created: s.birthtime.toISOString() };
      })
    );
    backups.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());

    return NextResponse.json({ backups });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed';
    if (message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
