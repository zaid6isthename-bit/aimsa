import { createClient } from '@libsql/client';
import 'dotenv/config';

async function migrate() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url || !authToken) throw new Error('TURSO_DATABASE_URL and TURSO_AUTH_TOKEN required');

  const client = createClient({ url, authToken });

  const tables = [
    `CREATE TABLE IF NOT EXISTS AdminUser (
      id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
      username TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      passwordHash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'content_admin',
      status TEXT NOT NULL DEFAULT 'active',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      lastLogin DATETIME
    )`,
    `CREATE TABLE IF NOT EXISTS Event (
      id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL DEFAULT '',
      fullStory TEXT DEFAULT '',
      category TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL DEFAULT '',
      venue TEXT NOT NULL DEFAULT '',
      shortDesc TEXT NOT NULL DEFAULT '',
      coverUrl TEXT DEFAULT '',
      registrationUrl TEXT DEFAULT '',
      attendeeCount INTEGER DEFAULT 0,
      featured INTEGER DEFAULT 0,
      status TEXT DEFAULT 'draft',
      scheduleStatus TEXT DEFAULT 'upcoming',
      organizers TEXT DEFAULT '',
      rules TEXT DEFAULT '',
      results TEXT DEFAULT '',
      galleryImages TEXT DEFAULT '[]',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS Announcement (
      id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'general',
      imageUrl TEXT DEFAULT '',
      link TEXT DEFAULT '',
      pinned INTEGER DEFAULT 0,
      status TEXT DEFAULT 'draft',
      publishedAt DATETIME,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS TeamMember (
      id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      role TEXT NOT NULL,
      category TEXT NOT NULL,
      year TEXT NOT NULL,
      photoUrl TEXT NOT NULL DEFAULT '',
      bio TEXT NOT NULL DEFAULT '',
      quote TEXT DEFAULT '',
      contributions TEXT DEFAULT '[]',
      github TEXT DEFAULT '',
      linkedin TEXT DEFAULT '',
      email TEXT DEFAULT '',
      highlightTag TEXT DEFAULT '',
      displayOrder INTEGER DEFAULT 0,
      isActive INTEGER DEFAULT 1,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS Project (
      id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
      name TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT '',
      imageUrl TEXT DEFAULT '',
      githubUrl TEXT DEFAULT '',
      liveUrl TEXT DEFAULT '',
      featured INTEGER DEFAULT 0,
      status TEXT DEFAULT 'active',
      displayOrder INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS Achievement (
      id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT '',
      date TEXT NOT NULL DEFAULT '',
      competition TEXT DEFAULT '',
      participants TEXT DEFAULT '',
      position TEXT DEFAULT '',
      imageUrl TEXT DEFAULT '',
      externalLink TEXT DEFAULT '',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS GalleryAlbum (
      id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      category TEXT DEFAULT '',
      coverUrl TEXT DEFAULT '',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS GalleryImage (
      id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
      albumId TEXT,
      title TEXT NOT NULL,
      caption TEXT DEFAULT '',
      url TEXT NOT NULL,
      category TEXT DEFAULT '',
      featured INTEGER DEFAULT 0,
      displayOrder INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (albumId) REFERENCES GalleryAlbum(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS ContactInformation (
      id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
      label TEXT NOT NULL UNIQUE,
      value TEXT NOT NULL DEFAULT '',
      type TEXT NOT NULL DEFAULT 'text',
      displayOrder INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS SiteSetting (
      id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
      key TEXT NOT NULL UNIQUE,
      value TEXT NOT NULL DEFAULT '',
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS ActivityLog (
      id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
      adminId TEXT NOT NULL DEFAULT '',
      adminName TEXT NOT NULL DEFAULT '',
      action TEXT NOT NULL,
      contentType TEXT NOT NULL DEFAULT '',
      contentId TEXT DEFAULT '',
      contentName TEXT DEFAULT '',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS EventRegistration (
      id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
      eventId TEXT,
      eventTitle TEXT NOT NULL DEFAULT '',
      eventSlug TEXT NOT NULL DEFAULT '',
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL DEFAULT '',
      rollNumber TEXT NOT NULL DEFAULT '',
      year TEXT NOT NULL DEFAULT '1st Year',
      branch TEXT NOT NULL DEFAULT 'AI & ML',
      teamName TEXT NOT NULL DEFAULT '',
      teamMembers TEXT NOT NULL DEFAULT '',
      customAnswers TEXT NOT NULL DEFAULT '{}',
      status TEXT NOT NULL DEFAULT 'confirmed',
      notes TEXT NOT NULL DEFAULT '',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (eventId) REFERENCES Event(id) ON DELETE SET NULL
    )`,
  ];

  for (const sql of tables) {
    await client.execute(sql);
  }

  // Safe column additions for Event table if it already existed
  try {
    await client.execute('ALTER TABLE Event ADD COLUMN registrationOpen INTEGER DEFAULT 1');
  } catch (e) {
    // Column may already exist
  }
  try {
    await client.execute('ALTER TABLE Event ADD COLUMN maxCapacity INTEGER DEFAULT 0');
  } catch (e) {
    // Column may already exist
  }

  console.log('All tables created/updated on Turso!');
  client.close();
}

migrate().catch(console.error);
