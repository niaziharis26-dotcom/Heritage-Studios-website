import db from '@/lib/db';
import { createSessionToken } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const username = body.username ? String(body.username).trim() : '';
    const password = body.password ? String(body.password).trim() : '';

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required.' }, { status: 400 });
    }

    await db.load();
    const isValid = db.verifyAdmin(username, password);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid admin credentials.' }, { status: 401 });
    }

    // Create stateless signed HMAC session token
    const { token, expires } = createSessionToken(username);

    // Attach Set-Cookie header directly to NextResponse
    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_session', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      expires,
      path: '/'
    });

    return response;
  } catch (err) {
    console.error('Login API error:', err);
    return NextResponse.json({ error: 'Authentication processing failed.' }, { status: 500 });
  }
}
