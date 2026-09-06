import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const aboutSettings = [
  { key: 'about_heading', value: 'ABOUT AIMSA' },
  { key: 'about_subheading', value: 'OFFICIAL FIELD-JOURNAL ARCHIVE' },
  { key: 'about_description', value: 'AIMSA (AI & ML Students\' Association) is the living, breathing student body of the Department of Artificial Intelligence & Machine Learning. We bridge technical mastery with creative culture, sports grit, and lifelong campus friendships.' },
  { key: 'about_who_we_are_heading', value: 'WHO WE ARE & OUR ORIGIN' },
  { key: 'about_who_we_are_p1', value: 'Founded in 2024 by ambitious AI undergraduates, AIMSA was born out of a realization: engineering education is incomplete without a thriving, supportive community. We refuse to be just another academic portal or silent laboratory.' },
  { key: 'about_who_we_are_p2', value: 'Instead, AIMSA operates as a student-run digital archive and event platform. From 36-hour hackathons and PyTorch research workshops to acoustic rock nights, sports tournaments, and pizza lawn jams—AIMSA is where memories are forged.' },
  { key: 'about_quote', value: '"Not just code—culture, grit and community."' },
  { key: 'about_image_url', value: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000' },
  { key: 'about_vision', value: 'To build the most vibrant, technically fearless, and supportive AI & ML student community in the nation—where every member finds their voice, team, and passion.' },
  { key: 'about_mission', value: 'Empower students through high-impact hackathons, PyTorch bootcamps, inter-department sports leagues, cultural showcases, and direct peer mentorship.' },
  { key: 'about_values', value: 'Uncompromising student brotherhood, open-source knowledge sharing, athletic sportsmanship, creative freedom, and relentless pursuit of excellence.' },
  {
    key: 'about_timeline',
    value: JSON.stringify([
      { year: '2024 (INCEPTION)', title: 'Founding of AIMSA Council', desc: 'Formed by 4th-year AI & ML undergraduates with a vision to unite technical excellence and human student culture.' },
      { year: 'FALL 2024', title: 'First Neural Hackathon & AURA Fest', desc: 'Hosted 250+ hackathon participants and 600+ cultural fest attendees, establishing AIMSA as the largest dept council.' },
      { year: 'SPRING 2025', title: 'National Wall of Fame & Inter-Dept Trophy', desc: 'Won 1st place in 3 national AI hackathons and secured the University All-Sports Championship Trophy.' },
      { year: 'PRESENT (2025-26)', title: 'Expanding the Digital Archive', desc: 'Operating 15+ annual workshops, mentorship circles, research reading groups, and global alumni networks.' },
    ]),
  },
];

async function seedAbout() {
  console.log('Seeding about page content...');
  for (const s of aboutSettings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }
  console.log(`  ${aboutSettings.length} about settings seeded`);
}

seedAbout().catch(console.error).finally(() => prisma.$disconnect());
