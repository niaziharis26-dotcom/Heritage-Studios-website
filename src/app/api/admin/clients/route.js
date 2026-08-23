import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { cookies } from 'next/headers';

function checkAuth() {
  const cookieStore = cookies();
  const token = cookieStore.get('admin_session')?.value;
  if (!token) return false;
  const sessions = db.get('sessions') || {};
  return sessions[token] && new Date(sessions[token].expires) > new Date();
}

export async function GET(req) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json(db.get('clients') || []);
}

export async function POST(req) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const { action, client } = body;
    let clients = db.get('clients') || [];

    if (action === 'create') {
      const newClient = { 
        id: `c${Date.now()}`, 
        createdAt: new Date().toISOString(),
        status: 'Active',
        ...client 
      };
      clients.push(newClient);
      db.set('clients', clients);
      return NextResponse.json({ success: true, client: newClient });
    }

    if (action === 'update') {
      clients = clients.map(c => c.id === client.id ? { ...c, ...client } : c);
      db.set('clients', clients);
      return NextResponse.json({ success: true });
    }

    if (action === 'delete') {
      clients = clients.filter(c => c.id !== client.id);
      db.set('clients', clients);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
