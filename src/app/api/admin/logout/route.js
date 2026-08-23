import db from '@/lib/db';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('admin_session')?.value;

    if (token) {
      const sessions = db.get('sessions') || {};
      delete sessions[token];
      db.set('sessions', sessions);
    }

    // Clear cookie
    cookieStore.delete('admin_session');

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Logout error:', err);
    return NextResponse.json({ error: 'Failed to log out.' }, { status: 500 });
  }
}
