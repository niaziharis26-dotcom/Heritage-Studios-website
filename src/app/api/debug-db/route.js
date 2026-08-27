import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

export const dynamic = 'force-dynamic';

export async function GET() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  
  const hasUri = !!(url && token);
  let connected = false;
  let error = null;
  let docExists = false;
  let docKeys = [];

  if (hasUri) {
    try {
      const kv = new Redis({ url, token });
      const doc = await kv.get('heritage_studios_db');
      connected = true;
      docExists = !!doc;
      if (doc) {
        docKeys = Object.keys(doc);
      }
    } catch (err) {
      error = err.message;
    }
  }

  return NextResponse.json({
    KV_CONFIGURED: hasUri,
    connected,
    document_exists: docExists,
    document_top_level_keys: docKeys,
    error,
    timestamp: new Date().toISOString(),
  });
}
