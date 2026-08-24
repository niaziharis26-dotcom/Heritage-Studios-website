import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import crypto from 'crypto';

const AUTH_SECRET = process.env.ADMIN_SECRET || 'heritage_studios_secure_admin_secret_2026';

export function createSessionToken(username) {
  const expiresMs = Date.now() + 24 * 60 * 60 * 1000; // 24 Hours
  const payload = JSON.stringify({ username, expires: expiresMs });
  const b64Payload = Buffer.from(payload).toString('base64url');
  const hmac = crypto.createHmac('sha256', AUTH_SECRET).update(b64Payload).digest('hex');
  const token = `${b64Payload}.${hmac}`;
  return { token, expires: new Date(expiresMs) };
}

export function verifySessionToken(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return null;
  try {
    const [b64Payload, hmac] = token.split('.');
    const expectedHmac = crypto.createHmac('sha256', AUTH_SECRET).update(b64Payload).digest('hex');
    
    const hmacBuf = Buffer.from(hmac);
    const expectedBuf = Buffer.from(expectedHmac);
    if (hmacBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(hmacBuf, expectedBuf)) {
      return null;
    }

    const payloadStr = Buffer.from(b64Payload, 'base64url').toString('utf8');
    const data = JSON.parse(payloadStr);

    if (data.expires && Number(data.expires) > Date.now()) {
      return data;
    }
  } catch (e) {
    return null;
  }
  return null;
}

export function checkAuth() {
  const cookieStore = cookies();
  const token = cookieStore.get('admin_session')?.value;

  if (!token) {
    redirect('/admin/login');
  }

  const session = verifySessionToken(token);
  if (!session) {
    redirect('/admin/login');
  }

  return session;
}
