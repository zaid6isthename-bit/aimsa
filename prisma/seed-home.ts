import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const homeSettings = [
  { key: 'home_hero_heading', value: 'AI & ML STUDENTS ASSOCIATION' },
  { key: 'home_hero_tagline', value: 'Where code meets culture, grit, and community.' },
  { key: 'home_hero_badge', value: 'SESSION 2026-27' },
  { key: 'home_who_heading', value: 'AI & ML IS OUR FIELD. AIMSA IS OUR FAMILY' },
  { key: 'home_who_text', value: 'AIMSA is the official student association of the Artificial Intelligence & Machine Learning department. We bring together developers, researchers, athletes, musicians, and artists under one unified student council.' },
  { key: 'home_who_image_url', value: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000' },
  { key: 'home_events_heading', value: 'EVENT ECOSYSTEM' },
  { key: 'home_events_number', value: '02.' },
  { key: 'home_people_heading', value: 'PERSONNEL ARCHIVE' },
  { key: 'home_people_number', value: '03.' },
  { key: 'home_achievements_heading', value: 'WALL OF FAME' },
  { key: 'home_achievements_number', value: '04.' },
  { key: 'home_gallery_heading', value: 'VISUAL FIELD JOURNAL' },
  { key: 'home_gallery_number', value: '05.' },
  { key: 'home_cta_heading', value: 'BE PART OF AIMSA' },
  { key: 'home_cta_text', value: 'Join the most vibrant AI & ML student community.' },
];

async function seedHome() {
  console.log('Seeding home page settings...');
  for (const s of homeSettings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }
  console.log(`  ${homeSettings.length} home settings seeded`);
}

seedHome().catch(console.error).finally(() => prisma.$disconnect());
