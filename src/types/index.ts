export interface TeamMember {
  id: string;
  slug: string;
  name: string;
  role: string;
  category: 'Leadership' | 'Core Team' | 'Department Leads' | 'Executive Committee' | 'Team Members';
  year: string;
  photoUrl: string;
  bio: string;
  quote?: string;
  contributions?: string[];
  github?: string;
  linkedin?: string;
  email?: string;
  highlightTag?: string;
  displayOrder: number;
}

export interface EventItem {
  id: string;
  slug: string;
  title: string;
  category: 'technical' | 'cultural' | 'sports' | 'community' | 'celebrations';
  date: string;
  time: string;
  venue: string;
  shortDesc: string;
  fullStory: string;
  coverUrl: string;
  organizers: string[];
  winners?: { position: string; teamName: string; members: string[] }[];
  galleryImages?: string[];
  registrationUrl?: string;
  attendeeCount?: number;
  featured?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  category: 'Hackathon' | 'Research' | 'Sports' | 'Community';
  date: string;
  description: string;
  recipients: string[];
  imageUrl: string;
  badgeText: string;
  highlightStat?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Technical' | 'Cultural' | 'Sports' | 'Community' | 'Celebrations';
  date: string;
  url: string;
  caption: string;
  location?: string;
  eventSlug?: string;
  aspectRatio?: 'portrait' | 'landscape' | 'square';
}

export interface CommunityActivity {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  quote?: string;
  authorName?: string;
  authorRole?: string;
}
