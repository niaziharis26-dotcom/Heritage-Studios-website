import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Diagnostic endpoint — tells us exactly whether MongoDB is connected.
 * Visit: /api/debug-db on your live Vercel URL to diagnose.
 * DELETE THIS FILE after confirming the fix is working.
 */
export async function GET() {
  const hasUri = !!process.env.MONGODB_URI;
  let connected = false;
  let error = null;
  let docExists = false;
  let docKeys = [];

  if (hasUri) {
    try {
      const { MongoClient } = require('mongodb');
      const client = new MongoClient(process.env.MONGODB_URI, { connectTimeoutMS: 5000, serverSelectionTimeoutMS: 5000 });
      await client.connect();
      const mdb = client.db('heritage_studios');
      const doc = await mdb.collection('database').findOne({ _id: 'main' });
      connected = true;
      docExists = !!doc;
      if (doc) {
        const { _id, ...rest } = doc;
        docKeys = Object.keys(rest);
      }
      await client.close();
    } catch (err) {
      error = err.message;
    }
  }

  return NextResponse.json({
    MONGODB_URI_SET: hasUri,
    MONGODB_URI_PREFIX: hasUri ? process.env.MONGODB_URI.substring(0, 30) + '...' : null,
    connected,
    document_exists: docExists,
    document_top_level_keys: docKeys,
    error,
    timestamp: new Date().toISOString(),
  });
}
