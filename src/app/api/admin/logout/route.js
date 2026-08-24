import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json({ success: true });
    response.cookies.delete('admin_session');
    return response;
  } catch (err) {
    console.error('Logout error:', err);
    return NextResponse.json({ error: 'Failed to log out.' }, { status: 500 });
  }
}
