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

export const teamUpdates = [
  {
    slug: 'saniya-pawar',
    bio: 'President of the AIMSA council. Leads the student association of the AI & ML department with vision, steering major annual initiatives, fostering collaborative research, and keeping the student community united and driven throughout the session.',
    quote: 'Leadership is about empowering every mind in the department to build fearlessly.',
    contributions: [
      'Chairs the AIMSA Executive Council and sets annual milestones',
      'Represents AI & ML student body in university academic committees',
      'Directs major departmental fests and industry collaborations',
    ],
  },
  {
    slug: 'ved-ringne',
    bio: 'President of the AIMSA council alongside the elected leadership team. Brings strategic direction, technical innovation, and high-tempo energy to department hackathons, research symposiums, and student development programs.',
    quote: 'We bridge theory and execution — turning ideas into production-grade systems.',
    contributions: [
      'Co-leads the AIMSA Executive Council',
      'Spearheads department-wide hackathons and national competitions',
      'Fosters inter-departmental innovation programs and labs',
    ],
  },
  {
    slug: 'shrushtee-ghule',
    bio: 'Vice President of AIMSA. Works closely with the council to orchestrate cross-committee planning, delegate responsibilities across wings, and keep every departmental initiative aligned and execution-ready.',
    quote: 'Seamless coordination behind the scenes creates unforgettable campus experiences.',
    contributions: [
      'Coordinates cross-committee operations across all wings',
      'Deputizes the presidency in council matters and external affairs',
      'Strengthens department outreach and student mentorship circles',
    ],
  },
  {
    slug: 'vivek-singh',
    bio: 'Vice President of AIMSA. Supports the presidency in day-to-day council operations, bridging the gap between student requirements, faculty coordination, and seamless event delivery.',
    quote: 'Great teams thrive when every member has the resources and guidance to succeed.',
    contributions: [
      'Supports council decision-making and operational strategy',
      'Assists major event operations and logistical blueprints',
      'Mentors junior committee members and volunteer squads',
    ],
  },
  {
    slug: 'haresh-chavan',
    bio: 'Treasurer of AIMSA. Handles association finances, budgets every event and fest, manages sponsorships, and ensures complete financial transparency and resource efficiency for the council.',
    quote: 'Fiscal discipline and smart resource allocation power the biggest student visions.',
    contributions: [
      'Manages the AIMSA annual operational budget',
      'Oversees corporate sponsorships, prize pools, and resource funds',
      'Maintains audited financial records and expenditure reports',
    ],
  },
  {
    slug: 'janhavi-chopkar',
    bio: 'Treasurer of AIMSA. Tracks operational expenditures, coordinates vendor budgets, and manages association accounts with diligence to fund student projects, hackathon grants, and grand festivals.',
    quote: 'Precision and accountability ensure every student initiative receives full support.',
    contributions: [
      'Processes council allocations and vendor disbursements',
      'Coordinates partner agreements and fest budgeting',
      'Presents financial reports to the Executive Council',
    ],
  },
  {
    slug: 'tanisha-pandey',
    bio: 'Technical Secretary of AIMSA. Drives the technical wing — curating national hackathons, advanced AI/ML bootcamps, industry speaker panels, and specialized research groups across the department.',
    quote: 'Code is our craft, and continuous learning is the departmental heartbeat.',
    contributions: [
      'Curates technical roadmaps, workshops, and AI bootcamps',
      'Coordinates industry research speakers and tech mentors',
      'Expands competitive programming and open-source culture',
    ],
  },
  {
    slug: 'rajkrishna-yadav',
    bio: 'Co-Technical Secretary of AIMSA. Supports hands-on coding sessions, project buildathons, mentor circles, and open-source software initiatives for AI & ML undergraduates.',
    quote: 'Hands-on building with modern toolchains turns curiosity into competence.',
    contributions: [
      'Orchestrates hackathon problem statements and mentorship tracks',
      'Leads hands-on workshops in PyTorch, Agentic AI, and Cloud ML',
      'Mentors junior teams in project development and system design',
    ],
  },
  {
    slug: 'seema-karki',
    bio: 'Event Head of AIMSA. Curates and orchestrates the department flagship calendar — from grand multi-day fests to technical symposiums, guest lectures, and academic orientations.',
    quote: 'An event is not just a gathering; it is a shared memory that stays with you forever.',
    contributions: [
      'Designs the department event master calendar',
      'Leads core event production and protocol teams',
      'Coordinates venue logistics, permissions, and scheduling',
    ],
  },
  {
    slug: 'sahil-gouda',
    bio: 'Event Head of AIMSA. Manages end-to-end logistics, stage coordination, timeline management, and volunteer operations to deliver world-class on-ground event experiences.',
    quote: 'Perfection on stage is born from relentless preparation behind the curtain.',
    contributions: [
      'Directs on-ground event operations and crowd management',
      'Manages stage setups, audio-visual technicals, and safety',
      'Mobilizes and trains the student volunteer task forces',
    ],
  },
  {
    slug: 'prasad-shetty',
    bio: 'Cultural Head of AIMSA. Directs the department cultural productions, live music showcases, drama performances, and creative festivals that bring the vibrant engineering spirit to life.',
    quote: 'Engineers who create art build the most empathetic and inspiring technologies.',
    contributions: [
      'Directs the flagship AURA annual cultural night',
      'Organizes live acoustic band showcases and talent hunts',
      'Builds a thriving arts, theater, and music community in the department',
    ],
  },
  {
    slug: 'aneesh-chaurasia',
    bio: 'Cultural Head of AIMSA. Spearheads stage productions, student jam sessions, and artistic competitions, giving budding performers a premier platform to shine on campus.',
    quote: 'Art gives engineering its soul — celebrating music, theater, and camaraderie.',
    contributions: [
      'Co-produces stage showcases and battle of the bands',
      'Curates performing arts competitions and acoustic jams',
      'Coordinates student artist bookings and creative choreography',
    ],
  },
  {
    slug: 'swarangi-parab',
    bio: 'Creative Head of AIMSA. Shapes the distinct visual identity, branding, promotional artwork, stage design, and digital merchandise for all association events and social media.',
    quote: 'Design is the silent ambassador of our community values and aesthetic energy.',
    contributions: [
      'Directs AIMSA visual branding, posters, and fest merchandise',
      'Designs stage backdrops and physical campus installations',
      'Curates digital visual storytelling across official channels',
    ],
  },
  {
    slug: 'vinay-kanojia',
    bio: 'Photography & Magazine Head of AIMSA. Leads the visual media team, capturing campus memories and directing the annual department editorial magazine and press archives.',
    quote: 'Every frame captured preserves the historic milestones of our student years.',
    contributions: [
      'Heads the photography and documentary video crews',
      'Chief editor of the annual AIMSA department magazine',
      'Curates the official photo archive and press releases',
    ],
  },
  {
    slug: 'om-shukla',
    bio: 'Photography & Magazine Head of AIMSA. Directs event cinematography, photojournalism, and post-production storytelling to document the living history of AIMSA.',
    quote: 'Through our lenses, we immortalize the sweat, triumphs, and friendships of college.',
    contributions: [
      'Produces official event aftermovies and cinematic teasers',
      'Manages digital media asset libraries and editorial layouts',
      'Conducts photography walkabouts and student creative sessions',
    ],
  },
  {
    slug: 'aditya-pandey',
    bio: 'Publicity Head of AIMSA. Commands publicity campaigns, campus buzz, social media outreach, and student relations to ensure record-breaking attendance at every initiative.',
    quote: 'Amplifying student voices and connecting our work with the wider university.',
    contributions: [
      'Directs high-impact digital and physical publicity drives',
      'Manages official social channels, announcements, and engagement',
      'Builds outreach partnerships across universities and tech hubs',
    ],
  },
  {
    slug: 'aayush-pandey',
    bio: 'Sports Head of AIMSA. Captains the sports division, organizing university-level tournaments, inter-branch athletic leagues, and team training camps for department athletes.',
    quote: 'Championship grit on the field builds unbreakable bonds off the field.',
    contributions: [
      'Organizes the annual AIMSA Clash inter-department sports league',
      'Coordinates team selections for football, cricket, and athletics',
      'Champions physical fitness, esports, and sportsmanship',
    ],
  },
  {
    slug: 'soham-patil',
    bio: 'Sports Head of AIMSA. Directs competitive sports schedules, team selection, and tournament logistics across football, cricket, basketball, and indoor gaming.',
    quote: 'Discipline, team chemistry, and dedication define our department athletes.',
    contributions: [
      'Co-leads athletic training camps and practice fixtures',
      'Manages tournament brackets, referee panels, and venue bookings',
      'Promotes fitness initiatives and indoor chess/badminton leagues',
    ],
  },
  {
    slug: 'pranav-badgujar',
    bio: 'Sports Event Head of AIMSA. Leads on-ground tournament operations, referee management, fixtures scheduling, and equipment logistics for all sporting contests.',
    quote: 'Flawless tournament execution lets athletes focus on giving their absolute best.',
    contributions: [
      'Runs match-day refereeing, equipment, and pitch management',
      'Coordinates live tournament scorekeeping and digital updates',
      'Ensures first-aid protocols and participant safety at games',
    ],
  },
  {
    slug: 'anannya-bangera',
    bio: 'Sports Event Head of AIMSA. Coordinates game days, match fixtures, volunteer crews, and medical safety to ensure fair play and spirited athletic competitions.',
    quote: 'Sports teach resilience and teamwork that carry through every engineering challenge.',
    contributions: [
      'Coordinates match schedules, athlete registrations, and team logistics',
      'Manages volunteer task forces during university sports fests',
      'Fosters high participation across women in sports and athletics',
    ],
  },
  {
    slug: 'adi-shenoy',
    bio: 'Executive committee member of AIMSA. Actively contributes to tech symposium logistics, participant coordination, and community outreach drives across the department.',
    quote: 'Dedicated to making every department event an inspiring experience for all.',
    contributions: [
      'Supports hackathon operations and attendee logistics',
      'Assists council leadership during departmental assemblies',
    ],
  },
  {
    slug: 'shreya-yadav',
    bio: 'Executive committee member of AIMSA. Drives student engagement, assisting in event staging, guest hospitality, and peer-to-peer mentorship across semesters.',
    quote: 'Connecting students with mentors and fostering a welcoming family atmosphere.',
    contributions: [
      'Leads hospitality teams for visiting dignitaries and speakers',
      'Supports student onboarding drives and department meetups',
    ],
  },
  {
    slug: 'tanushree-lokare',
    bio: 'Executive committee member of AIMSA. Provides operational support for academic workshops, hackathon desk management, and creative event planning.',
    quote: 'Passionate about building spaces where innovation and creativity intersect.',
    contributions: [
      'Assists registration desks and information booths during fests',
      'Contributes to student welfare and academic collaboration sessions',
    ],
  },
  {
    slug: 'srushti-shinde',
    bio: 'Executive committee member of AIMSA. Champions inclusive student participation, managing department communications and volunteer coordination for major fests.',
    quote: 'Ensuring every student has a voice and a platform in our association.',
    contributions: [
      'Facilitates student communications and feedback channels',
      'Assists backstage coordination during cultural evenings',
    ],
  },
  {
    slug: 'shreya-tripathi',
    bio: 'Executive committee member of AIMSA. Supports event production, stage coordination, and backstage management during cultural nights and orientation events.',
    quote: 'Energy and teamwork bring every ambitious student production to life.',
    contributions: [
      'Coordinates green room and artist logistics during concerts',
      'Assists core council teams with campus promotion',
    ],
  },
  {
    slug: 'parnika-walunj',
    bio: 'Executive committee member of AIMSA. Dedicated volunteer lead handling registration desks, attendee verification, and community networking sessions.',
    quote: 'Every detail counts when welcoming students into our association family.',
    contributions: [
      'Oversees check-in systems and attendee passes at events',
      'Supports cultural rehearsals and exhibition galleries',
    ],
  },
  {
    slug: 'soham-mahajan',
    bio: 'Executive committee member of AIMSA. Delivers essential backstage operations, sound & AV support, and technical setup for campus presentations and workshops.',
    quote: 'Behind every flawless presentation is dedicated technical execution.',
    contributions: [
      'Manages audiovisual hardware and live streaming setups',
      'Provides hands-on logistics support across all fest days',
    ],
  },
  {
    slug: 'zaid-mohd',
    bio: 'Executive committee member of AIMSA. Coordinates council technology assets, web portal features, digital archival records, and community event workflows.',
    quote: 'Building digital platforms that archive our legacy and empower student creators.',
    contributions: [
      'Maintains the AIMSA web platform and digital archive systems',
      'Assists technical event workflows and digital registrations',
    ],
  },
];

async function main() {
  const prisma = createTursoPrisma();
  console.log('Connected to Turso. Updating team bios...');

  for (const update of teamUpdates) {
    try {
      await prisma.teamMember.update({
        where: { slug: update.slug },
        data: {
          bio: update.bio,
          quote: update.quote,
          contributions: JSON.stringify(update.contributions),
        },
      });
      console.log(`  Updated ${update.slug}`);
    } catch (e: any) {
      console.error(`  Failed for ${update.slug}:`, e.message);
    }
  }

  console.log(`\nDone! Processed ${teamUpdates.length} team members.`);
  await prisma.$disconnect();
}

if (process.argv[1].endsWith('update-team-bios.ts')) {
  main().catch(console.error);
}
