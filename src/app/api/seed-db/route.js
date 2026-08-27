import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  
  if (!url || !token) {
    return NextResponse.json({ error: 'KV variables missing' });
  }

  try {
    const kv = new Redis({ url, token });
    
    // Read the actual database.json that was bundled with your deployment
    const filePath = path.join(process.cwd(), 'database.json');
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'database.json not found in deployment' });
    }
    
    const rawData = fs.readFileSync(filePath, 'utf8');
    const parsedData = JSON.parse(rawData);
    
    // Push the entire real database.json into KV
    await kv.set('heritage_studios_db', parsedData);
    
    return NextResponse.json({
      success: true,
      message: 'Successfully migrated all your existing data from database.json into Vercel KV!',
      migrated_keys: Object.keys(parsedData)
    });
  } catch (err) {
    return NextResponse.json({ error: err.message });
  }
}
