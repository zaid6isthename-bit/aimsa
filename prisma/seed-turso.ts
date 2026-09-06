import { PrismaClient } from '@prisma/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';
import 'dotenv/config';

function createTursoPrisma() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url || !authToken) throw new Error('TURSO_DATABASE_URL and TURSO_AUTH_TOKEN required');
  const client = createClient({ url, authToken });
  const adapter = new PrismaLibSQL(client);
  return new PrismaClient({ adapter });
}

// Re-use all seed data from existing files
async function seedAll() {
  const prisma = createTursoPrisma();
  console.log('Connected to Turso. Seeding...');

  // Events
  const events = [
    { title: 'Neural Hack 2025: 36-Hour National AI Hackathon', slug: 'neural-hack-2025', description: 'The flagship 36-hour continuous buildathon bringing together 400+ student developers.', category: 'technical', date: 'October 24-25, 2025', time: '09:00 AM IST Onwards', venue: 'AIMSA Tech Hub & Main Auditorium', shortDesc: 'The flagship 36-hour continuous buildathon bringing together 400+ student developers.', fullStory: 'Neural Hack 2025 is the premier flagship hackathon of the AI & ML Students Association.', coverUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200', organizers: 'Aarav Sharma, Priya Sundaram, Kabir Mehta, Sneha Reddy', registrationUrl: 'https://aimsa.edu/register/neural-hack', attendeeCount: 450, featured: true, status: 'published', scheduleStatus: 'upcoming' },
    { title: 'AURA 2025: Annual AIMSA Cultural & Music Night', slug: 'aura-2025', description: 'A celebratory evening featuring live student acoustic rock bands.', category: 'cultural', date: 'November 12, 2025', time: '05:30 PM - 10:30 PM', venue: 'Open Air Amphitheatre', shortDesc: 'A celebratory evening featuring live student acoustic rock bands.', fullStory: 'AURA is the beating heart of AIMSA creative expression.', coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1200', organizers: 'Siddharth Nair, Ananya Verma, Neha Kapoor, Aditya Kumar', registrationUrl: 'https://aimsa.edu/register/aura-2025', attendeeCount: 850, featured: true, status: 'published', scheduleStatus: 'upcoming' },
    { title: 'AIMSA Clash: Inter-Department Sports League', slug: 'aimsa-clash-2025', description: 'An intense 3-day inter-department tournament.', category: 'sports', date: 'September 18-20, 2025', time: '07:00 AM IST Daily', venue: 'University Sports Complex', shortDesc: 'An intense 3-day inter-department tournament.', fullStory: 'AIMSA Clash proves that AI & ML students possess championship athletic grit.', coverUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=1200', organizers: 'Vikram Singh, Rohan Deshmukh, Riya Sen', attendeeCount: 500, featured: true, status: 'published', scheduleStatus: 'upcoming' },
    { title: 'PyTorch & Agentic AI Hands-On Bootcamp', slug: 'pytorch-workshop', description: 'A deep-dive technical masterclass.', category: 'technical', date: 'August 14, 2025', time: '02:00 PM - 06:00 PM', venue: 'Lab 3 (AI Research Lab)', shortDesc: 'A deep-dive technical masterclass.', fullStory: 'Led by Technical Secretary Priya Sundaram.', coverUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1200', organizers: 'Priya Sundaram, Arjun Rathi, Ishaan Joshi', attendeeCount: 160, status: 'published', scheduleStatus: 'upcoming' },
    { title: 'AIMSA Freshman Orientation & Welcome Jam', slug: 'ai-orientation-freshers-2024', description: 'Welcoming the new batch of AI & ML undergraduates.', category: 'community', date: 'August 01, 2024', time: '10:00 AM - 04:00 PM', venue: 'Department Seminar Hall & Central Lawn', shortDesc: 'Welcoming the new batch of AI & ML undergraduates.', fullStory: 'Freshman Orientation is where new students find their tribe.', coverUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200', organizers: 'Diya Banerjee, Tanvi Sharma, Riya Sen', attendeeCount: 220, status: 'published', scheduleStatus: 'upcoming' },
    { title: 'AI Short Film & Generative Art Exhibition', slug: 'ai-film-festival-2025', description: 'Exhibition of student-created short films.', category: 'cultural', date: 'December 05, 2025', time: '04:00 PM - 08:00 PM', venue: 'Media Studio & Gallery Hall', shortDesc: 'Exhibition of student-created short films.', fullStory: 'Curated by Creative Director Neha Kapoor.', coverUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=1200', organizers: 'Neha Kapoor, Aditya Kumar', attendeeCount: 320, status: 'published', scheduleStatus: 'upcoming' },
    { title: 'Kaggle Grandmaster Sprint & ML Competition', slug: 'kaggle-sprint-2024', description: 'A 10-hour intensive data science sprint.', category: 'technical', date: 'July 10, 2024', time: '10:00 AM - 08:00 PM', venue: 'Lab 2 & Virtual Server', shortDesc: 'A 10-hour intensive data science sprint.', fullStory: 'Hosted by Competitive Programming Lead Arjun Rathi.', coverUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&q=80&w=1200', organizers: 'Arjun Rathi, Priya Sundaram', attendeeCount: 85, status: 'published', scheduleStatus: 'upcoming' },
    { title: 'Graduating Class Farewell & Memory Night', slug: 'dept-farewell-2025', description: 'Honoring our graduating seniors.', category: 'celebrations', date: 'May 15, 2025', time: '06:00 PM - 11:00 PM', venue: 'Grand Ball Room & Lawn', shortDesc: 'Honoring our graduating seniors.', fullStory: 'The annual AIMSA Farewell is a solemn, joyful celebration.', coverUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=1200', organizers: 'General Council 2025', attendeeCount: 350, status: 'published', scheduleStatus: 'upcoming' },
  ];
  for (const e of events) { await prisma.event.upsert({ where: { slug: e.slug }, update: {}, create: e }); }
  console.log(`  ${events.length} events`);

  // Team members
  const teamMembers = [
    { name: 'Saniya Pawar', slug: 'saniya-pawar', role: 'President', category: 'Leadership', year: 'Session 2026-27', photoUrl: '/team/saniya-pawar.jpg', bio: 'President of the AIMSA council.', highlightTag: 'PRESIDENT', displayOrder: 1 },
    { name: 'Ved Ringne', slug: 'ved-ringne', role: 'President', category: 'Leadership', year: 'Session 2026-27', photoUrl: '/team/ved-ringne.jpg', bio: 'President of the AIMSA council.', highlightTag: 'PRESIDENT', displayOrder: 2 },
    { name: 'Shrushtee Ghule', slug: 'shrushtee-ghule', role: 'Vice President', category: 'Leadership', year: 'Session 2026-27', photoUrl: '/team/shrushtee-ghule.jpg', bio: 'Vice President of AIMSA.', highlightTag: 'VICE PRESIDENT', displayOrder: 3 },
    { name: 'Vivek Singh', slug: 'vivek-singh', role: 'Vice President', category: 'Leadership', year: 'Session 2026-27', photoUrl: '/team/vivek-singh.jpg', bio: 'Vice President of AIMSA.', highlightTag: 'VICE PRESIDENT', displayOrder: 4 },
    { name: 'Haresh Chavan', slug: 'haresh-chavan', role: 'Treasurer', category: 'Leadership', year: 'Session 2026-27', photoUrl: '/team/haresh-chavan.jpg', bio: 'Treasurer of AIMSA.', highlightTag: 'TREASURER', displayOrder: 5 },
    { name: 'Janhavi Chopkar', slug: 'janhavi-chopkar', role: 'Treasurer', category: 'Leadership', year: 'Session 2026-27', photoUrl: '/team/janhavi-chopkar.jpg', bio: 'Treasurer of AIMSA.', highlightTag: 'TREASURER', displayOrder: 6 },
    { name: 'Tanisha Pandey', slug: 'tanisha-pandey', role: 'Technical Secretary', category: 'Core Team', year: 'Session 2026-27', photoUrl: '/team/tanisha-pandey.jpg', bio: 'Technical Secretary of AIMSA.', highlightTag: 'TECHNICAL SECRETARY', displayOrder: 7 },
    { name: 'Rajkrishna Yadav', slug: 'rajkrishna-yadav', role: 'Co-Technical Secretary', category: 'Core Team', year: 'Session 2026-27', photoUrl: '/team/rajkrishna-yadav.jpg', bio: 'Co-Technical Secretary of AIMSA.', highlightTag: 'CO-TECHNICAL SECRETARY', displayOrder: 8 },
    { name: 'Seema Karki', slug: 'seema-karki', role: 'Event Head', category: 'Core Team', year: 'Session 2026-27', photoUrl: '/team/seema-karki.jpg', bio: 'Event Head of AIMSA.', highlightTag: 'EVENT HEAD', displayOrder: 9 },
    { name: 'Sahil Gouda', slug: 'sahil-gouda', role: 'Event Head', category: 'Core Team', year: 'Session 2026-27', photoUrl: '/team/sahil-gouda-event.jpg', bio: 'Event Head of AIMSA.', highlightTag: 'EVENT HEAD', displayOrder: 10 },
    { name: 'Prasad Shetty', slug: 'prasad-shetty', role: 'Cultural Head', category: 'Core Team', year: 'Session 2026-27', photoUrl: '/team/prasad-shetty.jpg', bio: 'Cultural Head of AIMSA.', highlightTag: 'CULTURAL HEAD', displayOrder: 11 },
    { name: 'Aneesh Chaurasia', slug: 'aneesh-chaurasia', role: 'Cultural Head', category: 'Core Team', year: 'Session 2026-27', photoUrl: '/team/aneesh-chaurasia.jpg', bio: 'Cultural Head of AIMSA.', highlightTag: 'CULTURAL HEAD', displayOrder: 12 },
    { name: 'Swarangi Parab', slug: 'swarangi-parab', role: 'Creative Head', category: 'Department Leads', year: 'Session 2026-27', photoUrl: '/team/swarangi-parab.jpg', bio: 'Creative Head of AIMSA.', highlightTag: 'CREATIVE HEAD', displayOrder: 13 },
    { name: 'Vinay Kanojia', slug: 'vinay-kanojia', role: 'Photography & Magazine Head', category: 'Department Leads', year: 'Session 2026-27', photoUrl: '/team/vinay-kanojia.jpg', bio: 'Photography & Magazine Head of AIMSA.', highlightTag: 'PHOTOGRAPHY & MAGAZINE HEAD', displayOrder: 14 },
    { name: 'Om Shukla', slug: 'om-shukla', role: 'Photography & Magazine Head', category: 'Department Leads', year: 'Session 2026-27', photoUrl: '/team/om-shukla.jpg', bio: 'Photography & Magazine Head of AIMSA.', highlightTag: 'PHOTOGRAPHY & MAGAZINE HEAD', displayOrder: 15 },
    { name: 'Aditya Pandey', slug: 'aditya-pandey', role: 'Publicity Head', category: 'Department Leads', year: 'Session 2026-27', photoUrl: '/team/aditya-pandey.jpg', bio: 'Publicity Head of AIMSA.', highlightTag: 'PUBLICITY HEAD', displayOrder: 16 },
    { name: 'Aayush Pandey', slug: 'aayush-pandey', role: 'Sports Head', category: 'Department Leads', year: 'Session 2026-27', photoUrl: '/team/aayush-pandey.jpg', bio: 'Sports Head of AIMSA.', highlightTag: 'SPORTS HEAD', displayOrder: 17 },
    { name: 'Soham Patil', slug: 'soham-patil', role: 'Sports Head', category: 'Department Leads', year: 'Session 2026-27', photoUrl: '/team/soham-patil.jpg', bio: 'Sports Head of AIMSA.', highlightTag: 'SPORTS HEAD', displayOrder: 18 },
    { name: 'Pranav Badgujar', slug: 'pranav-badgujar', role: 'Sports Event Head', category: 'Department Leads', year: 'Session 2026-27', photoUrl: '/team/pranav-badgujar.jpg', bio: 'Sports Event Head of AIMSA.', highlightTag: 'SPORTS EVENT HEAD', displayOrder: 19 },
    { name: 'Anannya Bangera', slug: 'anannya-bangera', role: 'Sports Event Head', category: 'Department Leads', year: 'Session 2026-27', photoUrl: '/team/anannya-bangera.jpg', bio: 'Sports Event Head of AIMSA.', highlightTag: 'SPORTS EVENT HEAD', displayOrder: 20 },
    { name: 'Adi Shenoy', slug: 'adi-shenoy', role: 'Team Member', category: 'Executive Committee', year: 'Session 2026-27', photoUrl: '/team/adi-shenoy.jpg', bio: 'Executive committee member of AIMSA.', highlightTag: 'TEAM MEMBER', displayOrder: 21 },
    { name: 'Shreya Yadav', slug: 'shreya-yadav', role: 'Team Member', category: 'Executive Committee', year: 'Session 2026-27', photoUrl: '/team/shreya-yadav.jpg', bio: 'Executive committee member of AIMSA.', highlightTag: 'TEAM MEMBER', displayOrder: 22 },
    { name: 'Tanushree Lokare', slug: 'tanushree-lokare', role: 'Team Member', category: 'Executive Committee', year: 'Session 2026-27', photoUrl: '/team/tanushree-lokare.jpg', bio: 'Executive committee member of AIMSA.', highlightTag: 'TEAM MEMBER', displayOrder: 23 },
    { name: 'Srushti Shinde', slug: 'srushti-shinde', role: 'Team Member', category: 'Executive Committee', year: 'Session 2026-27', photoUrl: '/team/srushti-shinde.jpg', bio: 'Executive committee member of AIMSA.', highlightTag: 'TEAM MEMBER', displayOrder: 24 },
    { name: 'Shreya Tripathi', slug: 'shreya-tripathi', role: 'Team Member', category: 'Executive Committee', year: 'Session 2026-27', photoUrl: '/team/shreya-tripathi.jpg', bio: 'Executive committee member of AIMSA.', highlightTag: 'TEAM MEMBER', displayOrder: 25 },
    { name: 'Parnika Walunj', slug: 'parnika-walunj', role: 'Team Member', category: 'Executive Committee', year: 'Session 2026-27', photoUrl: '/team/parnika-walunj.jpg', bio: 'Executive committee member of AIMSA.', highlightTag: 'TEAM MEMBER', displayOrder: 26 },
    { name: 'Soham Mahajan', slug: 'soham-mahajan', role: 'Team Member', category: 'Executive Committee', year: 'Session 2026-27', photoUrl: '/team/soham-mahajan.jpg', bio: 'Executive committee member of AIMSA.', highlightTag: 'TEAM MEMBER', displayOrder: 27 },
    { name: 'Zaid Mohd', slug: 'zaid-mohd', role: 'Team Member', category: 'Executive Committee', year: 'Session 2026-27', photoUrl: '/team/zaid-mohd.jpg', bio: 'Executive committee member of AIMSA.', highlightTag: 'TEAM MEMBER', displayOrder: 28 },
  ];
  for (const m of teamMembers) { await prisma.teamMember.upsert({ where: { slug: m.slug }, update: {}, create: m }); }
  console.log(`  ${teamMembers.length} team members`);

  // Achievements
  const achievements = [
    { title: '1st Place Grand Champions — National AI Hackathon 2024', description: 'AIMSA team NeuralNodes secured the top trophy.', category: 'Hackathon', date: 'OCTOBER 2024', competition: 'National AI Hackathon 2024', participants: 'Rohan G., Siddharth M., Pooja K.', position: '1st Place', imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800' },
    { title: 'NeurIPS Workshop Paper Acceptance', description: 'Co-authored by AIMSA AI Research Lead Ishaan Joshi.', category: 'Research', date: 'DECEMBER 2024', competition: 'NeurIPS Workshop', participants: 'Ishaan Joshi, Dr. V. Mehta (HOD)', position: 'Published', imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800' },
    { title: 'University All-Sports Championship Trophy 2025', description: 'AIMSA secured overall 1st position.', category: 'Sports', date: 'FEBRUARY 2025', competition: 'Inter-Department Sports Olympiad', participants: 'AIMSA Athletics Squad, Vikram Singh (Capt.)', position: '1st Overall', imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800' },
    { title: 'Best Student Department Council Award 2024', description: 'Awarded by the University Chancellor.', category: 'Community', date: 'DECEMBER 2024', competition: 'University Awards', participants: 'AIMSA Executive Committee', position: 'Best Dept Council', imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800' },
  ];
  for (const a of achievements) { await prisma.achievement.create({ data: a }); }
  console.log(`  ${achievements.length} achievements`);

  // Gallery
  const galleryImages = [
    { title: 'Football Championship Finals', category: 'Sports', url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=800', caption: 'Football Finals Victory', displayOrder: 1 },
    { title: 'Track & Field Banner Squad', category: 'Sports', url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=800', caption: 'Track Championship Squad', displayOrder: 2 },
    { title: 'AIMSA Central Lawn Celebration', category: 'Community', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800', caption: 'AIMSA Lawn Celebration', displayOrder: 3 },
    { title: 'Neural Hack 2024 Winners Stage', category: 'Technical', url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800', caption: 'Neural Hack 2024 Winners', displayOrder: 4 },
    { title: 'AURA 2024 Cultural Night Stage', category: 'Cultural', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800', caption: 'AURA Cultural Night', displayOrder: 5 },
    { title: 'PyTorch & AI Masterclass Lab', category: 'Technical', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800', caption: 'PyTorch Workshop Lab', displayOrder: 6 },
    { title: 'Team Lanyards & Executive Crew', category: 'Celebrations', url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800', caption: 'Team Lanyards & Crew', displayOrder: 7 },
    { title: 'Executive Committee Huddle', category: 'Celebrations', url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=800', caption: 'Executive Huddle', displayOrder: 8 },
  ];
  for (const img of galleryImages) { await prisma.galleryImage.create({ data: img }); }
  console.log(`  ${galleryImages.length} gallery images`);

  // Announcements
  const announcements = [
    { title: 'Neural Hack 2025 Registration Now Open', content: 'Registration for our flagship 36-hour AI hackathon is now live!', category: 'Events', pinned: true, status: 'published' },
    { title: 'Weekly PyTorch Study Group — Every Friday', content: 'Join us every Friday at 5 PM in Lab 3 for collaborative PyTorch learning.', category: 'Community', pinned: false, status: 'published' },
    { title: 'AIMSA Elections 2026 — Nominations Open', content: 'Nominations for the 2026-27 executive committee are now open.', category: 'General', pinned: false, status: 'published' },
  ];
  for (const a of announcements) { await prisma.announcement.create({ data: a }); }
  console.log(`  ${announcements.length} announcements`);

  // Site settings (about + home)
  const settings = [
    { key: 'about_heading', value: 'ABOUT AIMSA' },
    { key: 'about_subheading', value: 'OFFICIAL FIELD-JOURNAL ARCHIVE' },
    { key: 'about_description', value: 'AIMSA is the living, breathing student body of the Department of AI & ML.' },
    { key: 'about_who_we_are_heading', value: 'WHO WE ARE & OUR ORIGIN' },
    { key: 'about_who_we_are_p1', value: 'Founded in 2024 by ambitious AI undergraduates.' },
    { key: 'about_who_we_are_p2', value: 'AIMSA operates as a student-run digital archive and event platform.' },
    { key: 'about_quote', value: '"Not just code—culture, grit and community."' },
    { key: 'about_image_url', value: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000' },
    { key: 'about_vision', value: 'To build the most vibrant, technically fearless, and supportive AI & ML student community.' },
    { key: 'about_mission', value: 'Empower students through high-impact hackathons, bootcamps, and peer mentorship.' },
    { key: 'about_values', value: 'Uncompromising student brotherhood, open-source knowledge sharing, and relentless pursuit of excellence.' },
    { key: 'about_timeline', value: JSON.stringify([{ year: '2024', title: 'Founding', desc: 'Formed by 4th-year AI & ML undergraduates.' }, { year: 'FALL 2024', title: 'First Hackathon', desc: 'Hosted 250+ participants.' }, { year: 'SPRING 2025', title: 'Championship', desc: 'Won University All-Sports Trophy.' }, { year: 'PRESENT', title: 'Expanding', desc: 'Operating 15+ annual events.' }]) },
    { key: 'home_hero_heading', value: 'AI & ML STUDENTS ASSOCIATION' },
    { key: 'home_hero_tagline', value: 'Where code meets culture, grit, and community.' },
    { key: 'home_hero_badge', value: 'SESSION 2026-27' },
    { key: 'home_who_heading', value: 'AI & ML IS OUR FIELD. AIMSA IS OUR FAMILY' },
    { key: 'home_who_text', value: 'AIMSA is the official student association of the AI & ML department.' },
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
  for (const s of settings) { await prisma.siteSetting.upsert({ where: { key: s.key }, update: { value: s.value }, create: s }); }
  console.log(`  ${settings.length} site settings`);

  // Contacts
  const contacts = [
    { label: 'email', value: 'aimsa@college.edu', type: 'email' },
    { label: 'instagram', value: 'https://instagram.com/aimsa', type: 'url' },
    { label: 'location', value: 'AI & ML Department, University Campus', type: 'text' },
  ];
  for (const c of contacts) { await prisma.contactInformation.upsert({ where: { label: c.label }, update: { value: c.value }, create: c }); }
  console.log(`  ${contacts.length} contacts`);

  // Admin users
  const bcrypt = await import('bcryptjs');
  const admins = [
    { username: 'admin', name: 'Admin', email: 'admin@aimsa.com', role: 'super_admin' },
    { username: 'saniya.pawar', name: 'Saniya Pawar', email: 'saniya@aimsa.com', role: 'content_admin' },
    { username: 'ved.ringne', name: 'Ved Ringne', email: 'ved@aimsa.com', role: 'content_admin' },
    { username: 'shrushtee.ghule', name: 'Shrushtee Ghule', email: 'shrushtee@aimsa.com', role: 'content_admin' },
    { username: 'vivek.singh', name: 'Vivek Singh', email: 'vivek@aimsa.com', role: 'content_admin' },
    { username: 'tanisha.pandey', name: 'Tanisha Pandey', email: 'tanisha@aimsa.com', role: 'event_admin' },
    { username: 'rajkrishna.yadav', name: 'Rajkrishna Yadav', email: 'rajkrishna@aimsa.com', role: 'event_admin' },
    { username: 'zaid.mohd', name: 'Zaid Mohd', email: 'zaid@aimsa.com', role: 'super_admin' },
  ];
  for (const a of admins) {
    const hash = await bcrypt.hash('admin123', 10);
    await prisma.adminUser.upsert({ where: { username: a.username }, update: {}, create: { ...a, passwordHash: hash, status: 'active' } });
  }
  console.log(`  ${admins.length} admin users`);

  console.log('\nTurso database seeded!');
  await prisma.$disconnect();
}

seedAll().catch(console.error);
