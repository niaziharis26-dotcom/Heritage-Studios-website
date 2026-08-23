import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import db from '@/lib/db';

export function checkAuth() {
  const cookieStore = cookies();
  const token = cookieStore.get('admin_session')?.value;

  if (!token) {
    redirect('/admin/login');
  }

  const sessions = db.get('sessions') || {};
  const session = sessions[token];

  if (!session || new Date(session.expires) < new Date()) {
    redirect('/admin/login');
  }

  return session;
}
