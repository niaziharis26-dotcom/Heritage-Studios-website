import { verifySessionToken } from '@/lib/auth';
import db from '@/lib/db';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

function checkApiAuth() {
  const cookieStore = cookies();
  const token = cookieStore.get('admin_session')?.value;
  if (!token) return false;
  return Boolean(verifySessionToken(token));
}

// GET /api/admin/activity
export async function GET(request) {
  if (!checkApiAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '50', 10);

  let log = db.get('activityLog') || [];

  if (type && type !== 'all') {
    log = log.filter(entry => entry.action.includes(type));
  }

  const total = log.length;
  const offset = (page - 1) * limit;
  const entries = log.slice(offset, offset + limit);

  return NextResponse.json({ entries, total, page, limit });
}
