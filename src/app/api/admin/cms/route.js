import { verifySessionToken } from '@/lib/auth';
import db from '@/lib/db';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

// Middleware logic validation
function checkApiAuth() {
  const cookieStore = cookies();
  const token = cookieStore.get('admin_session')?.value;
  if (!token) return false;
  return Boolean(verifySessionToken(token));
}

export async function POST(request) {
  if (!checkApiAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { action, sectionId, field, value, sectionsList, componentData } = await request.json();

    if (action === 'reorder') {
      if (!sectionsList) {
        return NextResponse.json({ error: 'Invalid reorder array.' }, { status: 400 });
      }
      db.set('homepageSections', sectionsList);
      await db.syncToGithub();
      revalidatePath('/', 'layout');
      return NextResponse.json({ success: true });
    }

    if (action === 'toggleVisibility') {
      const components = db.get('components') || {};
      if (!components[sectionId]) {
        components[sectionId] = { visible: true };
      }
      components[sectionId].visible = !components[sectionId].visible;
      db.set('components', components);
      await db.syncToGithub();
      revalidatePath('/', 'layout');
      return NextResponse.json({ success: true, visible: components[sectionId].visible });
    }

    if (action === 'updateComponent') {
      const components = db.get('components') || {};
      components[sectionId] = {
        ...components[sectionId],
        ...componentData
      };
      db.set('components', components);
      await db.syncToGithub();
      revalidatePath('/', 'layout');
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Unsupported action.' }, { status: 400 });
  } catch (err) {
    console.error('CMS API error:', err);
    return NextResponse.json({ error: 'Failed to persist CMS modifications.' }, { status: 500 });
  }
}
