import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const HOME_KEYS = [
  'home_hero_heading', 'home_hero_tagline', 'home_hero_badge',
  'home_who_heading', 'home_who_text', 'home_who_image_url',
  'home_events_heading', 'home_events_number',
  'home_people_heading', 'home_people_number',
  'home_achievements_heading', 'home_achievements_number',
  'home_gallery_heading', 'home_gallery_number',
  'home_cta_heading', 'home_cta_text',
];

export async function GET() {
  try {
    const settings = await prisma.siteSetting.findMany({
      where: { key: { in: HOME_KEYS } },
    });
    const home: Record<string, string> = {};
    for (const s of settings) home[s.key] = s.value;
    return NextResponse.json({ home });
  } catch (error) {
    console.error('Failed to fetch home settings:', error);
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
    console.error('Failed to save home settings:', error);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
