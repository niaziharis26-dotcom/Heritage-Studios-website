import { verifySessionToken } from '@/lib/auth';
import db from '@/lib/db';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function checkApiAuth() {
  const cookieStore = cookies();
  const token = cookieStore.get('admin_session')?.value;
  if (!token) return false;
  return Boolean(verifySessionToken(token));
}

export async function GET() {
  await db.load();
  if (!checkApiAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({
    sections: db.get('homepageSections') || [],
    components: db.get('components') || {},
    settings: db.get('settings') || {}
  });
}
