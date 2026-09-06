import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    await requireAuth();

    const now = new Date();

    const [
      totalEvents,
      upcomingEvents,
      pastEvents,
      totalAnnouncements,
      totalProjects,
      totalTeamMembers,
      totalAchievements,
      totalGalleryAlbums,
      totalGalleryImages,
    ] = await Promise.all([
      prisma.event.count(),
      prisma.event.count({ where: { date: { gte: now.toISOString().split('T')[0] } } }),
      prisma.event.count({ where: { date: { lt: now.toISOString().split('T')[0] } } }),
      prisma.announcement.count(),
      prisma.project.count(),
      prisma.teamMember.count(),
      prisma.achievement.count(),
      prisma.galleryAlbum.count(),
      prisma.galleryImage.count(),
    ]);

    return NextResponse.json({
      totalEvents,
      upcomingEvents,
      pastEvents,
      totalAnnouncements,
      totalProjects,
      totalTeamMembers,
      totalAchievements,
      totalGalleryItems: totalGalleryAlbums + totalGalleryImages,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('GET stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
