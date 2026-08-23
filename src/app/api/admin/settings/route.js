import db from '@/lib/db';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

function checkApiAuth() {
  const cookieStore = cookies();
  const token = cookieStore.get('admin_session')?.value;
  if (!token) return false;
  const sessions = db.get('sessions') || {};
  return sessions[token] && new Date(sessions[token].expires) > new Date();
}

export async function GET() {
  if (!checkApiAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json({ settings: db.get('settings') || {} });
}

export async function POST(request) {
  if (!checkApiAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const updatedSettings = await request.json();
    const currentSettings = db.get('settings') || {};

    const newSettings = {
      ...currentSettings,
      ...updatedSettings
    };

    db.set('settings', newSettings);
    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true, settings: newSettings });
  } catch (err) {
    console.error('Settings API error:', err);
    return NextResponse.json({ error: 'Failed to update settings.' }, { status: 500 });
  }
}
