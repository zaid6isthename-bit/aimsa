import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const ABOUT_KEYS = [
  'about_heading', 'about_subheading', 'about_description',
  'about_who_we_are_heading', 'about_who_we_are_p1', 'about_who_we_are_p2', 'about_quote',
  'about_vision', 'about_mission', 'about_values',
  'about_image_url', 'about_timeline',
];

export async function GET() {
  try {
    const settings = await prisma.siteSetting.findMany({
      where: { key: { in: ABOUT_KEYS } },
    });
    const about: Record<string, string> = {};
    for (const s of settings) about[s.key] = s.value;
    return NextResponse.json({ about });
  } catch (error) {
    console.error('Failed to fetch about:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();
    for (const [key, value] of Object.entries(body)) {
      await prisma.siteSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      });
    }
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed';
    if (message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    console.error('Failed to save about:', error);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
