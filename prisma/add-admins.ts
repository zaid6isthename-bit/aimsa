import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcryptjs';

const prisma = new PrismaClient();

const admins = [
  { username: 'saniya.pawar', name: 'Saniya Pawar', email: 'saniya.pawar@aimsa.edu', role: 'content_admin', password: 'aimsa2026' },
  { username: 'ved.ringne', name: 'Ved Ringne', email: 'ved.ringne@aimsa.edu', role: 'content_admin', password: 'aimsa2026' },
  { username: 'shrushtee.ghule', name: 'Shrushtee Ghule', email: 'shrushtee.ghule@aimsa.edu', role: 'content_admin', password: 'aimsa2026' },
  { username: 'vivek.singh', name: 'Vivek Singh', email: 'vivek.singh@aimsa.edu', role: 'content_admin', password: 'aimsa2026' },
  { username: 'tanisha.pandey', name: 'Tanisha Pandey', email: 'tanisha.pandey@aimsa.edu', role: 'event_admin', password: 'aimsa2026' },
  { username: 'rajkrishna.yadav', name: 'Rajkrishna Yadav', email: 'rajkrishna.yadav@aimsa.edu', role: 'event_admin', password: 'aimsa2026' },
  { username: 'zaid.mohd', name: 'Zaid Mohd', email: 'zaid.mohd@aimsa.edu', role: 'super_admin', password: 'aimsa2026' },
];

async function main() {
  for (const a of admins) {
    const existing = await prisma.adminUser.findUnique({ where: { username: a.username } });
    if (!existing) {
      await prisma.adminUser.create({
        data: {
          username: a.username,
          name: a.name,
          email: a.email,
          passwordHash: hashSync(a.password, 12),
          role: a.role,
          status: 'active',
        },
      });
      console.log(`Created: ${a.username} (${a.role})`);
    } else {
      console.log(`Exists: ${a.username}`);
    }
  }
  await prisma.$disconnect();
}

main().catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
