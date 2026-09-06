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

const teamUpdates = [
  { slug: 'saniya-pawar', bio: 'President of the AIMSA council. Leads the student association of the AI & ML department with vision and keeps the community united and driven throughout the session.', contributions: JSON.stringify(['Chairs the AIMSA executive council', 'Represents the AI & ML department community', 'Guides the annual event roadmap']) },
  { slug: 'ved-ringne', bio: 'President of the AIMSA council alongside the elected leadership team. Brings energy and direction to department initiatives, events, and student programs.', contributions: JSON.stringify(['Co-leads the AIMSA executive council', 'Drives department-wide events and fests', 'Supports student-led initiatives']) },
  { slug: 'shrushtee-ghule', bio: 'Vice President of AIMSA. Works closely with the council to coordinate planning, delegate responsibilities across the committee, and keep every wing aligned.', contributions: JSON.stringify(['Coordinates cross-committee planning', 'Deputizes the presidency on council matters', 'Strengthens student outreach']) },
  { slug: 'vivek-singh', bio: 'Vice President of AIMSA. Supports the presidents in council operations and helps bridge the gap between departments, students, and event execution teams.', contributions: JSON.stringify(['Supports council decision-making', 'Assists major event operations', 'Mentors junior committee members']) },
  { slug: 'haresh-chavan', bio: 'Treasurer of AIMSA. Handles the association finances, budgets every event and fest, and keeps the money flows transparent and accountable to the council.', contributions: JSON.stringify(['Manages the AIMSA event budgets', 'Oversees sponsorships and resource funds', 'Maintains transparent financial records']) },
  { slug: 'janhavi-chopkar', bio: 'Treasurer of AIMSA. Tracks expenses, coordinates with sponsors and vendors, and ensures every rupee allocated to events is used efficiently.', contributions: JSON.stringify(['Processes council and event expenses', 'Coordinates with vendors and partners', 'Reports finances to the council']) },
  { slug: 'tanisha-pandey', bio: 'Technical Secretary of AIMSA. Drives the technical wing — workshops, hackathons, guest talks, and everything code-related in the AI & ML department.', contributions: JSON.stringify(['Plans technical workshops and hackathons', 'Coordinates tech panels and speakers', 'Grows the coding and research community']) },
  { slug: 'rajkrishna-yadav', bio: 'Co-Technical Secretary of AIMSA. Supports the technical wing in organizing hackathons, mentor sessions, and hands-on build events for the department.', contributions: JSON.stringify(['Assists hackathon and workshop logistics', 'Supports technical mentor sessions', 'Helps run the open-source community']) },
  { slug: 'seema-karki', bio: 'Event Head of AIMSA. Plans and runs the department events calendar — from technical fests to informal community gatherings across the AI & ML department.', contributions: JSON.stringify(['Manages the department event calendar', 'Leads event execution teams', 'Coordinates venues and scheduling']) },
  { slug: 'sahil-gouda', bio: 'Event Head of AIMSA. Owns the end-to-end delivery of department events, from idea and logistics to on-ground execution with the volunteer crew.', contributions: JSON.stringify(['Delivers major department events', 'Coordinates volunteer teams', 'Handles on-ground event operations']) },
  { slug: 'prasad-shetty', bio: 'Cultural Head of AIMSA. Curates the cultural calendar — music nights, drama, and creative showcases that give the department its celebratory spirit.', contributions: JSON.stringify(['Curates cultural nights and showcases', 'Organizes music and performing arts events', 'Builds the cultural crew']) },
  { slug: 'aneesh-chaurasia', bio: 'Cultural Head of AIMSA. Co-leads the cultural wing, producing stage events and creative showcases for the AI & ML department community.', contributions: JSON.stringify(['Co-produces cultural stage events', 'Organizes creative showcases', 'Directs cultural crew volunteers']) },
  { slug: 'swarangi-parab', bio: 'Creative Head of AIMSA. Shapes the visual identity of the association — posters, branding, and social media creatives for every department event.', contributions: JSON.stringify(['Designs event posters and branding', 'Owns the AIMSA visual identity', 'Directs social media creatives']) },
  { slug: 'vinay-kanojia', bio: 'Photography & Magazine Head of AIMSA. Captures the department in action and curates the association magazine, documenting student life and events.', contributions: JSON.stringify(['Covers department events on camera', 'Curates the AIMSA magazine', 'Builds the media archive']) },
  { slug: 'om-shukla', bio: 'Photography & Magazine Head of AIMSA. Co-leads the media wing, shooting event highlights and compiling the stories that make up the association journal.', contributions: JSON.stringify(['Photographs key department moments', 'Supports the magazine production', 'Maintains the photo and video archive']) },
  { slug: 'aditya-pandey', bio: 'Publicity Head of AIMSA. Spreads the word — managing announcements, social reach, and student engagement for every department activity.', contributions: JSON.stringify(['Runs event publicity campaigns', 'Manages social media presence', 'Grows student event engagement']) },
  { slug: 'aayush-pandey', bio: 'Sports Head of AIMSA. Organizes the inter-department tournaments and league fixtures that bring the athletic spirit of the AIMSA community alive.', contributions: JSON.stringify(['Organizes sports tournaments and leagues', 'Coordinates department teams and fixtures', 'Manages sports event logistics']) },
  { slug: 'soham-patil', bio: 'Sports Head of AIMSA. Co-leads the sports wing, organizing matches, training schedules, and the competitive calendar for the department.', contributions: JSON.stringify(['Co-leads the sports wing', 'Organizes inter-department fixtures', 'Supports athlete teams and practice']) },
  { slug: 'pranav-badgujar', bio: 'Sports Event Head of AIMSA. Leads ground execution of sports events — bookings, referees, scoring, and crowd coordination during tournaments.', contributions: JSON.stringify(['Runs on-ground sports event execution', 'Coordinates venues and equipment', 'Manages scoring and fixtures']) },
  { slug: 'anannya-bangera', bio: 'Sports Event Head of AIMSA. Delivers the sports day operations — from event scheduling to making sure every match runs smoothly on the field.', contributions: JSON.stringify(['Coordinates sports day operations', 'Arranges teams and match schedules', 'Manages event-day volunteer crews']) },
  { slug: 'adi-shenoy', bio: 'Executive committee member of AIMSA. Contributes to event execution and keeps the department community involved throughout the session.', contributions: JSON.stringify(['Supports event execution teams', 'Helps on department fest days']) },
  { slug: 'shreya-yadav', bio: 'Executive committee member of AIMSA. Brings enthusiasm to community events and supports the committee across the department calendar.', contributions: JSON.stringify(['Supports community events', 'Assists council teams and volunteers']) },
  { slug: 'tanushree-lokare', bio: 'Executive committee member of AIMSA. Lends a hand across technical and cultural events and helps grow the AI & ML department community.', contributions: JSON.stringify(['Assists technical and cultural events', 'Supports student engagement drives']) },
  { slug: 'srushti-shinde', bio: 'Executive committee member of AIMSA. Helps run departmental activities and makes sure no student feels left out of the AIMSA community.', contributions: JSON.stringify(['Supports departmental activities', 'Helps with student outreach']) },
  { slug: 'shreya-tripathi', bio: 'Executive committee member of AIMSA. Contributes to event planning and supports the committee crew during department fests and gatherings.', contributions: JSON.stringify(['Contributes to event planning', 'Supports fest-day execution']) },
  { slug: 'parnika-walunj', bio: 'Executive committee member of AIMSA. Brings dedication to the volunteer teams and helps keep department events and initiatives running smoothly.', contributions: JSON.stringify(['Joins volunteer execution teams', 'Supports committee initiatives']) },
  { slug: 'soham-mahajan', bio: 'Executive committee member of AIMSA. Helps with the behind-the-scenes work that makes department events and gatherings feel effortless.', contributions: JSON.stringify(['Supports behind-the-scenes operations', 'Assists at department events']) },
  { slug: 'zaid-mohd', bio: 'Executive committee member of AIMSA. Contributes to the council teams and helps keep the AI & ML department community active and welcoming.', contributions: JSON.stringify(['Supports council event teams', 'Helps maintain community engagement']) },
];

async function main() {
  const prisma = createTursoPrisma();
  console.log('Connected to Turso. Updating team bios...');

  for (const update of teamUpdates) {
    await prisma.teamMember.update({
      where: { slug: update.slug },
      data: { bio: update.bio, contributions: update.contributions },
    });
    console.log(`  Updated ${update.slug}`);
  }

  console.log(`\nDone! Updated ${teamUpdates.length} team members.`);
  await prisma.$disconnect();
}

main().catch(console.error);
