import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const settingsList = await prisma.siteSetting.findMany();

    const settings: Record<string, string> = {};
    for (const setting of settingsList) {
      settings[setting.key] = setting.value;
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Failed to fetch site settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch site settings' },
      { status: 500 }
    );
  }
}
