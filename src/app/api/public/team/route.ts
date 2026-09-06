import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const where: Record<string, unknown> = { isActive: true };

    if (category) {
      where.category = category;
    }

    const members = await prisma.teamMember.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
    });

    return NextResponse.json({ members });
  } catch (error) {
    console.error('Failed to fetch team members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team members' },
      { status: 500 }
    );
  }
}
