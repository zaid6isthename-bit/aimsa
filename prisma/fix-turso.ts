import 'dotenv/config';
import { createClient } from '@libsql/client';

async function fix() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });
  await client.execute("ALTER TABLE ContactInformation ADD COLUMN type TEXT NOT NULL DEFAULT 'text'");
  await client.execute("ALTER TABLE AdminUser ADD COLUMN status TEXT NOT NULL DEFAULT 'active'");
  console.log('Columns added');
  client.close();
}

fix().catch(console.error);
