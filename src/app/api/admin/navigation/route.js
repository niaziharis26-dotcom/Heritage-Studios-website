import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

function checkAuth() {
  const cookieStore = cookies();
  const token = cookieStore.get('admin_session')?.value;
  if (!token) return false;
  const sessions = db.get('sessions') || {};
  return sessions[token] && new Date(sessions[token].expires) > new Date();
}

export async function GET(req) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const navigation = db.get('navigation') || { links: [], ctaText: 'Book a Call', ctaUrl: '' };
  return NextResponse.json(navigation);
}

export async function POST(req) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    db.set('navigation', body);
    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true, navigation: body });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update navigation' }, { status: 500 });
  }
}
