import db from '@/lib/db';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required.' }, { status: 400 });
    }

    const isValid = db.verifyAdmin(username, password);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid admin credentials.' }, { status: 401 });
    }

    // Create session token
    const token = 'sess_' + Math.random().toString(36).substr(2, 9) + Math.random().toString(36).substr(2, 9);
    const sessions = db.get('sessions') || {};
    
    // Set 24 hour expiry
    const expires = new Date();
    expires.setHours(expires.getHours() + 24);

    sessions[token] = {
      username,
      expires: expires.toISOString()
    };
    db.set('sessions', sessions);

    // Save token in cookie
    const cookieStore = cookies();
    cookieStore.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: expires,
      path: '/'
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Login API error:', err);
    return NextResponse.json({ error: 'Authentication processing failed.' }, { status: 500 });
  }
}
