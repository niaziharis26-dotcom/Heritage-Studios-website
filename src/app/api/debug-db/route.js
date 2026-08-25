import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const uri = process.env.MONGODB_URI;
  const maskedUri = uri ? uri.replace(/:([^@]+)@/, ':****@') : null;
  
  let mongoConnected = false;
  let mongoError = null;
  let documentFound = false;

  if (uri) {
    try {
      const { MongoClient } = require('mongodb');
      const client = new MongoClient(uri, { connectTimeoutMS: 4000 });
      await client.connect();
      mongoConnected = true;
      const doc = await client.db('heritage_studios').collection('database').findOne({ _id: 'main' });
      if (doc) {
        documentFound = true;
      }
      await client.close();
    } catch (e) {
      mongoError = e.message;
    }
  }

  return NextResponse.json({
    hasMongoUri: Boolean(uri),
    maskedUri,
    mongoConnected,
    mongoError,
    documentFound,
    envKeys: Object.keys(process.env).filter(k => k.includes('MONGO') || k.includes('DB') || k.includes('VERCEL'))
  });
}
