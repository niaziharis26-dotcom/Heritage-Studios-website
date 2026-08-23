import db from '@/lib/db';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

function checkApiAuth() {
  const cookieStore = cookies();
  const token = cookieStore.get('admin_session')?.value;
  if (!token) return false;
  const sessions = db.get('sessions') || {};
  return sessions[token] && new Date(sessions[token].expires) > new Date();
}

const STATIC_PAGES = [
  { id: 'home', title: 'Home', slug: '/', status: 'published', template: 'default', seo: { title: '', description: '', robots: 'index,follow', ogImage: '' }, lastModified: null },
  { id: 'about', title: 'About', slug: '/about', status: 'published', template: 'default', seo: { title: '', description: '', robots: 'index,follow', ogImage: '' }, lastModified: null },
  { id: 'services', title: 'Services', slug: '/services', status: 'published', template: 'default', seo: { title: '', description: '', robots: 'index,follow', ogImage: '' }, lastModified: null },
  { id: 'projects', title: 'Projects', slug: '/projects', status: 'published', template: 'default', seo: { title: '', description: '', robots: 'index,follow', ogImage: '' }, lastModified: null },
  { id: 'reviews', title: 'Reviews', slug: '/reviews', status: 'published', template: 'default', seo: { title: '', description: '', robots: 'index,follow', ogImage: '' }, lastModified: null },
  { id: 'contact', title: 'Contact', slug: '/contact', status: 'published', template: 'default', seo: { title: '', description: '', robots: 'index,follow', ogImage: '' }, lastModified: null },
  { id: 'social-media', title: 'Social Media', slug: '/social-media', status: 'published', template: 'default', seo: { title: '', description: '', robots: 'index,follow', ogImage: '' }, lastModified: null },
];

function ensurePages() {
  let pages = db.get('pages');
  if (!pages || !Array.isArray(pages) || pages.length === 0) {
    db.set('pages', STATIC_PAGES);
    return STATIC_PAGES;
  }
  return pages;
}

// GET /api/admin/pages
export async function GET(request) {
  if (!checkApiAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const pages = ensurePages();
  return NextResponse.json({ pages });
}

// POST /api/admin/pages
export async function POST(request) {
  if (!checkApiAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action } = body;
    let pages = ensurePages();

    if (action === 'updateSeo') {
      const { pageId, seo } = body;
      const idx = pages.findIndex(p => p.id === pageId);
      if (idx === -1) return NextResponse.json({ error: 'Page not found' }, { status: 404 });
      pages[idx].seo = { ...(pages[idx].seo || {}), ...seo };
      pages[idx].lastModified = new Date().toISOString();
      db.set('pages', pages);

      // Log activity
      const log = db.get('activityLog') || [];
      log.unshift({ id: `log_${Date.now()}`, timestamp: new Date().toISOString(), user: 'admin', action: 'seo_updated', details: `SEO updated: ${pageId}` });
      db.set('activityLog', log.slice(0, 500));

      return NextResponse.json({ success: true, page: pages[idx] });
    }

    if (action === 'updateStatus') {
      const { pageId, status } = body;
      const idx = pages.findIndex(p => p.id === pageId);
      if (idx === -1) return NextResponse.json({ error: 'Page not found' }, { status: 404 });
      pages[idx].status = status;
      pages[idx].lastModified = new Date().toISOString();
      db.set('pages', pages);
      return NextResponse.json({ success: true });
    }

    if (action === 'duplicate') {
      const { pageId } = body;
      const original = pages.find(p => p.id === pageId);
      if (!original) return NextResponse.json({ error: 'Page not found' }, { status: 404 });

      const newPage = {
        ...JSON.parse(JSON.stringify(original)),
        id: `${original.id}_copy_${Date.now()}`,
        title: `${original.title} (Copy)`,
        slug: `${original.slug}-copy`,
        status: 'draft',
        lastModified: new Date().toISOString(),
      };
      pages.push(newPage);
      db.set('pages', pages);
      return NextResponse.json({ success: true, page: newPage });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err) {
    console.error('[pages API]', err);
    return NextResponse.json({ error: 'Failed: ' + err.message }, { status: 500 });
  }
}
