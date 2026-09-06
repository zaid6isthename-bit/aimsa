import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedAll() {
  console.log('Seeding events...');

  const events = [
    {
      title: 'Neural Hack 2025: 36-Hour National AI Hackathon',
      slug: 'neural-hack-2025',
      description: 'The flagship 36-hour continuous buildathon bringing together 400+ student developers to solve real-world AI, LLM, vision, and robotics challenges.',
      category: 'technical',
      date: 'October 24-25, 2025',
      time: '09:00 AM IST Onwards',
      venue: 'AIMSA Tech Hub & Main Auditorium',
      shortDesc: 'The flagship 36-hour continuous buildathon bringing together 400+ student developers to solve real-world AI, LLM, vision, and robotics challenges.',
      fullStory: `Neural Hack 2025 is the premier flagship hackathon of the AI & ML Students' Association. Over 36 non-stop hours, 100+ teams from across the nation competed in building production-ready AI agents, computer vision pipelines, autonomous robotics controllers, and privacy-first LLM applications. Sponsored by top tech partners offering cloud credits, hardware kits, and cash prizes worth ₹2,000,000. Mentors from top industry research labs provided midnight code reviews and architecture guidance.`,
      coverUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200',
      organizers: 'Aarav Sharma, Priya Sundaram, Kabir Mehta, Sneha Reddy',
      registrationUrl: 'https://aimsa.edu/register/neural-hack',
      attendeeCount: 450,
      featured: true,
      status: 'published',
      scheduleStatus: 'upcoming',
    },
    {
      title: 'AURA 2025: Annual AIMSA Cultural & Music Night',
      slug: 'aura-2025',
      description: 'A celebratory evening featuring live student acoustic rock bands, street theater drama, dance showcases, and digital neural artwork exhibitions.',
      category: 'cultural',
      date: 'November 12, 2025',
      time: '05:30 PM - 10:30 PM',
      venue: 'Open Air Amphitheatre',
      shortDesc: 'A celebratory evening featuring live student acoustic rock bands, street theater drama, dance showcases, and digital neural artwork exhibitions.',
      fullStory: `AURA is the beating heart of AIMSA's creative expression. When the sun sets over the campus, 800+ students gather at the Open Air Amphitheatre to celebrate the artistic talents of the AI & ML department. From acoustic band covers of classic rock and indie pop to electrifying hip-hop dance battles and thought-provoking street plays on technology's impact on society, AURA reminds us that engineers are artists at heart.`,
      coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1200',
      organizers: 'Siddharth Nair, Ananya Verma, Neha Kapoor, Aditya Kumar',
      registrationUrl: 'https://aimsa.edu/register/aura-2025',
      attendeeCount: 850,
      featured: true,
      status: 'published',
      scheduleStatus: 'upcoming',
    },
    {
      title: 'AIMSA Clash: Inter-Department Sports League',
      slug: 'aimsa-clash-2025',
      description: 'An intense 3-day inter-department tournament featuring football, 7v7 cricket, badminton singles, table tennis, and strategic chess matches.',
      category: 'sports',
      date: 'September 18-20, 2025',
      time: '07:00 AM IST Daily',
      venue: 'University Sports Complex',
      shortDesc: 'An intense 3-day inter-department tournament featuring football, 7v7 cricket, badminton singles, table tennis, and strategic chess matches.',
      fullStory: `AIMSA Clash proves that AI & ML students possess championship athletic grit. Over 3 competitive days at the main sports complex, our department teams battled rivals in football, cricket, badminton, table tennis, and rapid chess. Supported by loud department chants and student cheer squads, AIMSA secured the Overall University Inter-Department Championship Trophy for the second consecutive year.`,
      coverUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=1200',
      organizers: 'Vikram Singh, Rohan Deshmukh, Riya Sen',
      registrationUrl: 'https://aimsa.edu/register/aimsa-clash',
      attendeeCount: 500,
      featured: true,
      status: 'published',
      scheduleStatus: 'upcoming',
    },
    {
      title: 'PyTorch & Agentic AI Hands-On Bootcamp',
      slug: 'pytorch-workshop',
      description: 'A deep-dive technical masterclass on transformer architectures, fine-tuning Llama-3 models locally, and deploying autonomous AI tools.',
      category: 'technical',
      date: 'August 14, 2025',
      time: '02:00 PM - 06:00 PM',
      venue: 'Lab 3 (AI Research Lab)',
      shortDesc: 'A deep-dive technical masterclass on transformer architectures, fine-tuning Llama-3 models locally, and deploying autonomous AI tools.',
      fullStory: `Led by Technical Secretary Priya Sundaram and senior researchers, this hands-on workshop equipped 150+ students with practical skills in custom PyTorch dataset loaders, LoRA parameter-efficient fine-tuning, and building multi-agent workflow pipelines. Every attendee built and deployed a working local AI assistant by the end of the 4-hour session.`,
      coverUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1200',
      organizers: 'Priya Sundaram, Arjun Rathi, Ishaan Joshi',
      attendeeCount: 160,
      status: 'published',
      scheduleStatus: 'upcoming',
    },
    {
      title: 'AIMSA Freshman Orientation & Welcome Jam',
      slug: 'ai-orientation-freshers-2024',
      description: 'Welcoming the new batch of AI & ML undergraduates with interactive icebreakers, peer mentor assignments, goodie bags, and a lawn pizza party.',
      category: 'community',
      date: 'August 01, 2024',
      time: '10:00 AM - 04:00 PM',
      venue: 'Department Seminar Hall & Central Lawn',
      shortDesc: 'Welcoming the new batch of AI & ML undergraduates with interactive icebreakers, peer mentor assignments, goodie bags, and a lawn pizza party.',
      fullStory: `Freshman Orientation is where new students find their tribe in AI & ML. The day began with an inspirational keynote by the Department HOD and AIMSA President Aarav Sharma, followed by interactive team icebreakers, a guided tour of research labs, assignment of senior peer buddies, and concluded with an outdoor pizza party and acoustic acoustic music jam on the central lawn.`,
      coverUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200',
      organizers: 'Diya Banerjee, Tanvi Sharma, Riya Sen',
      attendeeCount: 220,
      status: 'published',
      scheduleStatus: 'upcoming',
    },
    {
      title: 'AI Short Film & Generative Art Exhibition',
      slug: 'ai-film-festival-2025',
      description: 'Exhibition of student-created short films, generative neural art pieces, and interactive AI installation experiences.',
      category: 'cultural',
      date: 'December 05, 2025',
      time: '04:00 PM - 08:00 PM',
      venue: 'Media Studio & Gallery Hall',
      shortDesc: 'Exhibition of student-created short films, generative neural art pieces, and interactive AI installation experiences.',
      fullStory: `Curated by Creative Director Neha Kapoor and Media Lead Aditya Kumar, this exhibition featured 25 student short films using AI storytelling, neural style transfer artwork prints, and interactive diffusion-based mirror installations. Over 300 visitors from across the university attended the premiere.`,
      coverUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=1200',
      organizers: 'Neha Kapoor, Aditya Kumar',
      attendeeCount: 320,
      status: 'published',
      scheduleStatus: 'upcoming',
    },
    {
      title: 'Kaggle Grandmaster Sprint & ML Competition',
      slug: 'kaggle-sprint-2024',
      description: 'A 10-hour intensive data science sprint solving tabular, NLP, and vision datasets hosted on Kaggle with live leaderboard tracking.',
      category: 'technical',
      date: 'July 10, 2024',
      time: '10:00 AM - 08:00 PM',
      venue: 'Lab 2 & Virtual Server',
      shortDesc: 'A 10-hour intensive data science sprint solving tabular, NLP, and vision datasets hosted on Kaggle with live leaderboard tracking.',
      fullStory: `Hosted by Competitive Programming Lead Arjun Rathi, 80 students competed in a 10-hour continuous machine learning sprint. Participants engineered complex features, ensembled Gradient Boosted Trees and Deep Learning models to optimize Log-Loss metrics. Winners received GPU cloud credits and mentorship opportunities.`,
      coverUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&q=80&w=1200',
      organizers: 'Arjun Rathi, Priya Sundaram',
      attendeeCount: 85,
      status: 'published',
      scheduleStatus: 'upcoming',
    },
    {
      title: 'Graduating Class Farewell & Memory Night',
      slug: 'dept-farewell-2025',
      description: 'Honoring our graduating seniors with nostalgic video montages, custom polaroid yearbooks, award citations, and formal dinner.',
      category: 'celebrations',
      date: 'May 15, 2025',
      time: '06:00 PM - 11:00 PM',
      venue: 'Grand Ball Room & Lawn',
      shortDesc: 'Honoring our graduating seniors with nostalgic video montages, custom polaroid yearbooks, award citations, and formal dinner.',
      fullStory: `The annual AIMSA Farewell is a solemn, joyful celebration of 4 years of shared late-night lab coding, hackathons, sports victories, and lifelong friendships. Seniors were presented with custom AIMSA leather-bound memory field-journals containing written notes from juniors and faculty.`,
      coverUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=1200',
      organizers: 'General Council 2025',
      attendeeCount: 350,
      status: 'published',
      scheduleStatus: 'upcoming',
    },
  ];

  for (const event of events) {
    await prisma.event.upsert({
      where: { slug: event.slug },
      update: {},
      create: event,
    });
  }
  console.log(`  ${events.length} events seeded`);

  // Seed achievements
  console.log('Seeding achievements...');

  const achievements = [
    {
      title: '1st Place Grand Champions — National AI Hackathon 2024',
      description: 'AIMSA team NeuralNodes secured the top trophy among 120+ national teams by building an autonomous multi-agent healthcare diagnostic pipeline.',
      category: 'Hackathon',
      date: 'OCTOBER 2024',
      competition: 'National AI Hackathon 2024',
      participants: 'Rohan G., Siddharth M., Pooja K.',
      position: '1st Place',
      imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800',
    },
    {
      title: 'NeurIPS Workshop Paper Acceptance on Vision Transformers',
      description: 'Co-authored by AIMSA AI Research Lead Ishaan Joshi on parameter-efficient fine-tuning of vision-language models for edge hardware.',
      category: 'Research',
      date: 'DECEMBER 2024',
      competition: 'NeurIPS Workshop',
      participants: 'Ishaan Joshi, Dr. V. Mehta (HOD)',
      position: 'Published',
      imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800',
    },
    {
      title: 'University All-Sports Championship Trophy 2025',
      description: 'AIMSA secured overall 1st position across Football, Cricket, Badminton, and Table Tennis in the Inter-Department Sports Olympiad.',
      category: 'Sports',
      date: 'FEBRUARY 2025',
      competition: 'Inter-Department Sports Olympiad',
      participants: 'AIMSA Athletics Squad, Vikram Singh (Capt.)',
      position: '1st Overall',
      imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800',
    },
    {
      title: 'Best Student Department Council Award 2024',
      description: 'Awarded by the University Chancellor for outstanding student leadership, community engagement, and hosting 15+ annual events.',
      category: 'Community',
      date: 'DECEMBER 2024',
      competition: 'University Awards',
      participants: 'AIMSA Executive Committee',
      position: 'Best Dept Council',
      imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800',
    },
  ];

  for (const achievement of achievements) {
    await prisma.achievement.create({ data: achievement });
  }
  console.log(`  ${achievements.length} achievements seeded`);

  // Seed gallery images
  console.log('Seeding gallery images...');

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

  for (const image of galleryImages) {
    await prisma.galleryImage.create({ data: image });
  }
  console.log(`  ${galleryImages.length} gallery images seeded`);

  // Seed announcements
  console.log('Seeding announcements...');

  const announcements = [
    { title: 'Neural Hack 2025 Registration Now Open', content: 'Registration for our flagship 36-hour AI hackathon is now live! Teams of 2-4 can register. Prizes worth ₹2,00,000. Early bird closes Sept 30.', category: 'Events', pinned: true, status: 'published' },
    { title: 'Weekly PyTorch Study Group — Every Friday', content: 'Join us every Friday at 5 PM in Lab 3 for collaborative PyTorch learning. All skill levels welcome. Bring your laptop!', category: 'Community', pinned: false, status: 'published' },
    { title: 'AIMSA Elections 2026 — Nominations Open', content: 'Nominations for the 2026-27 executive committee are now open. Submit your candidacy by November 15. Positions include President, VP, Tech Secretary, and more.', category: 'General', pinned: false, status: 'published' },
  ];

  for (const announcement of announcements) {
    await prisma.announcement.create({ data: announcement });
  }
  console.log(`  ${announcements.length} announcements seeded`);

  console.log('\nAll data seeded successfully!');
}

seedAll()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
