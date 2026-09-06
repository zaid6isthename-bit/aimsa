import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const contacts = await prisma.contactInformation.findMany({
      orderBy: { displayOrder: 'asc' },
    });

    return NextResponse.json({ contacts });
  } catch (error) {
    console.error('Failed to fetch contacts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}
