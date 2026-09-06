import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const now = new Date().toISOString();

    const [totalEvents, upcomingEvents, teamMembers, achievements, galleryItems] =
      await Promise.all([
        prisma.event.count({ where: { status: 'published' } }),
        prisma.event.count({
          where: { status: 'published', date: { gte: now } },
        }),
        prisma.teamMember.count({ where: { isActive: true } }),
        prisma.achievement.count(),
        prisma.galleryImage.count(),
      ]);

    return NextResponse.json({
      stats: {
        totalEvents,
        upcomingEvents,
        teamMembers,
        achievements,
        galleryItems,
      },
    });
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
