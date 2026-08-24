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

// GET /api/admin/revisions — list all revisions
export async function GET(request) {
  if (!checkApiAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page');

  let revisions = db.get('revisions') || [];
  revisions = revisions.slice().reverse(); // newest first

  if (page) {
    revisions = revisions.filter(r => r.page === page || !r.page);
  }

  return NextResponse.json({ revisions: revisions.slice(0, 50) });
}

// POST /api/admin/revisions — restore a revision
export async function POST(request) {
  if (!checkApiAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { action, revisionId } = await request.json();

    if (action === 'restore') {
      const revisions = db.get('revisions') || [];
      const rev = revisions.find(r => r.id === revisionId);
      if (!rev) {
        return NextResponse.json({ error: 'Revision not found' }, { status: 404 });
      }

      // Restore snapshot
      if (rev.snapshot.components) db.set('components', rev.snapshot.components);
      if (rev.snapshot.navigation) db.set('navigation', rev.snapshot.navigation);
      if (rev.snapshot.footer) db.set('footer', rev.snapshot.footer);

      // Clear all drafts after restoring
      db.set('drafts', {});

      // Log the restore action
      const activityLog = db.get('activityLog') || [];
      activityLog.unshift({
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString(),
        user: 'admin',
        action: 'revision_restored',
        details: `Restored revision from ${new Date(rev.timestamp).toLocaleString()} — "${rev.label || 'Unnamed'}"`,
      });
      db.set('activityLog', activityLog.slice(0, 500));

      return NextResponse.json({ success: true, restoredAt: new Date().toISOString() });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err) {
    console.error('[revisions API]', err);
    return NextResponse.json({ error: 'Failed: ' + err.message }, { status: 500 });
  }
}
