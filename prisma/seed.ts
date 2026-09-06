import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create default admin user
  const existingAdmin = await prisma.adminUser.findUnique({ where: { username: 'admin' } });
  if (!existingAdmin) {
    await prisma.adminUser.create({
      data: {
        username: 'admin',
        name: 'AIMSA Admin',
        email: 'admin@aimsa.edu',
        passwordHash: hashSync(process.env.ADMIN_DEFAULT_PASSWORD || 'admin123', 12),
        role: 'super_admin',
        status: 'active',
      },
    });
    console.log('Created default admin user: admin / admin123');
  }

  // Create default site settings
  const settings = [
    { key: 'hero_heading', value: 'AIMSA — Artificial Intelligence & Machine Learning Student Association' },
    { key: 'hero_tagline', value: 'Redefining the Future' },
    { key: 'hero_description', value: 'AIMSA is the official student association of the AI & ML department. We bring together developers, researchers, athletes, musicians, and artists under one unified student council.' },
    { key: 'about_heading', value: 'About AIMSA' },
    { key: 'about_description', value: 'AIMSA is the heart of the AI & ML department community. We organize events, hackathons, workshops, cultural nights, and sports tournaments that bring the department together.' },
    { key: 'mission', value: 'To empower students with technical skills, leadership qualities, and a collaborative spirit that prepares them for the challenges of the AI industry.' },
    { key: 'vision', value: 'To be the most impactful student-driven AI community, producing industry-ready professionals and innovative problem solvers.' },
    { key: 'footer_text', value: '© 2026 AIMSA. All rights reserved.' },
  ];

  for (const s of settings) {
    const existing = await prisma.siteSetting.findUnique({ where: { key: s.key } });
    if (!existing) {
      await prisma.siteSetting.create({ data: s });
    }
  }
  console.log('Created default site settings');

  // Create default contact information
  const contacts = [
    { label: 'email', value: 'aimsa@aimsa.edu', type: 'email', displayOrder: 1 },
    { label: 'phone', value: '+91 9876543210', type: 'phone', displayOrder: 2 },
    { label: 'address', value: 'AI & ML Department', type: 'text', displayOrder: 3 },
    { label: 'instagram', value: 'https://instagram.com/aimsa', type: 'social', displayOrder: 4 },
    { label: 'github', value: 'https://github.com/aimsa', type: 'social', displayOrder: 5 },
    { label: 'linkedin', value: 'https://linkedin.com/company/aimsa', type: 'social', displayOrder: 6 },
  ];

  for (const c of contacts) {
    const existing = await prisma.contactInformation.findUnique({ where: { label: c.label } });
    if (!existing) {
      await prisma.contactInformation.create({ data: c });
    }
  }
  console.log('Created default contact information');

  await prisma.$disconnect();
  console.log('Database seeded successfully!');
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
