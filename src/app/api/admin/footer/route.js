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
  await db.load();
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const footer = db.get('footer') || {};
  return NextResponse.json(footer);
}

export async function POST(req) {
  await db.load();
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    await db.set('footer', body);
    db.invalidate();
      revalidatePath('/', 'layout');
    return NextResponse.json({ success: true, footer: body });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update footer' }, { status: 500 });
  }
}
