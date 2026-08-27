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

export async function GET() {
  await db.load();
  if (!checkApiAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json({ inquiries: db.get('inquiries') || [] });
}

export async function PATCH(request) {
  await db.load();
  if (!checkApiAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, status } = await request.json();
    if (!id || !status) {
      return NextResponse.json({ error: 'Missing parameters.' }, { status: 400 });
    }

    const inquiries = db.get('inquiries') || [];
    const index = inquiries.findIndex(i => i.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Inquiry not found.' }, { status: 404 });
    }

    inquiries[index].status = status;
    await db.set('inquiries', inquiries);

    return NextResponse.json({ success: true, inquiry: inquiries[index] });
  } catch (err) {
    console.error('Leads API error:', err);
    return NextResponse.json({ error: 'Failed to update lead status.' }, { status: 500 });
  }
}
