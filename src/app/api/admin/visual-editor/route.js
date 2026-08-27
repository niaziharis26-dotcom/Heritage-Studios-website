import { verifySessionToken } from '@/lib/auth';
import db from '@/lib/db';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function checkApiAuth() {
  const cookieStore = cookies();
  const token = cookieStore.get('admin_session')?.value;
  if (!token) return false;
  return Boolean(verifySessionToken(token));
}

// GET /api/admin/visual-editor — full CMS state
export async function GET(request) {
  if (!checkApiAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const revisions = db.get('revisions') || [];

  return NextResponse.json({
    components: db.get('components') || {},
    drafts: db.get('drafts') || {},
    navigation: db.get('navigation') || {},
    footer: db.get('footer') || {},
    settings: db.get('settings') || {},
    globalStyles: db.get('globalStyles') || {},
    pages: db.get('pages') || [],
    homepageSections: db.get('homepageSections') || [],
    revisions: revisions.slice(-20).reverse(), // last 20, newest first
    media: (db.get('media') || []).slice(0, 50),
  });
}

// POST /api/admin/visual-editor — CMS mutations
export async function POST(request) {
  if (!checkApiAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action } = body;

    // Ensure in-memory cache is populated from MongoDB before any reads/writes
    await db.load();

    switch (action) {

      // ── Save a draft (does NOT publish to live) ──────────────────────
      case 'saveDraft': {
        const { componentKey, data } = body;
        if (!componentKey || !data) return NextResponse.json({ error: 'Missing componentKey or data' }, { status: 400 });
        const drafts = db.get('drafts') || {};
        drafts[componentKey] = { ...data, _draftedAt: new Date().toISOString() };
        db.set('drafts', drafts);
        logAction('admin', 'draft_saved', `Draft saved: ${componentKey}`);
        return NextResponse.json({ success: true, draftedAt: drafts[componentKey]._draftedAt });
      }

      // ── Publish a single component's draft ───────────────────────────
      case 'publish': {
        const { componentKey } = body;
        const drafts = db.get('drafts') || {};
        const draft = drafts[componentKey];
        if (!draft) return NextResponse.json({ error: 'No draft for this component' }, { status: 404 });

        const components = db.get('components') || {};
        const { _draftedAt, ...cleanDraft } = draft;
        components[componentKey] = { ...components[componentKey], ...cleanDraft };
        db.set('components', components);

        delete drafts[componentKey];
        db.set('drafts', drafts);
        logAction('admin', 'published', `Published: ${componentKey}`);
        const { revalidatePath } = require('next/cache');
        db.invalidate();
        revalidatePath('/', 'layout');
        return NextResponse.json({ success: true });
      }

      case 'publishAll': {
        const { editBuffer } = body;
        const drafts = db.get('drafts') || {};
        const components = db.get('components') || {};
        const navigation = db.get('navigation') || {};
        const footer = db.get('footer') || {};
        const settings = db.get('settings') || {};
        const services = db.get('services') || [];

        // Combine drafts and any active editBuffer items
        const allChanges = { ...drafts, ...(editBuffer || {}) };

        // Apply all changes to their respective database objects
        for (const [key, change] of Object.entries(allChanges)) {
          const { _draftedAt, ...cleanData } = change;
          
          if (key === 'settings') {
            Object.assign(settings, cleanData);
          } else if (key === 'navigation') {
            Object.assign(navigation, cleanData);
          } else if (key === 'footer') {
            Object.assign(footer, cleanData);
          } else {
            // Check if key is a service ID
            const svcIdx = services.findIndex(s => s.id === key);
            if (svcIdx !== -1) {
              services[svcIdx] = { ...services[svcIdx], ...cleanData };
            } else {
              components[key] = { ...components[key], ...cleanData };
            }
          }
        }
        
        await db.set('components', components);
        await db.set('settings', settings);
        await db.set('navigation', navigation);
        await db.set('footer', footer);
        await db.set('services', services);
        await db.set('drafts', {});

        // Create revision snapshot
        createRevision('admin', 'Manual publish', { components, navigation, footer, settings, services });
        logAction('admin', 'published_all', 'Published all drafts and edits to live site');
        
        await db.syncToGithub();

        const { revalidatePath } = require('next/cache');
        db.invalidate();
        revalidatePath('/', 'layout');
        
        return NextResponse.json({ success: true, publishedAt: new Date().toISOString() });
      }


      // ── Reorder sections ─────────────────────────────────────
      case 'reorderSections': {
        const { sections, pageId } = body;
        if (!Array.isArray(sections)) return NextResponse.json({ error: 'sections must be an array' }, { status: 400 });
        
        if (pageId === 'home' || !pageId) {
          db.set('homepageSections', sections);
        }
        
        const pages = db.get('pages') || [];
        const pageIdx = pages.findIndex(p => p.id === (pageId || 'home'));
        if (pageIdx !== -1) {
          pages[pageIdx].sections = sections;
          db.set('pages', pages);
        }
        
        logAction('admin', 'sections_reordered', `Sections reordered on page: ${pageId || 'home'}`);
        return NextResponse.json({ success: true });
      }

      // ── Add dynamic page ─────────────────────────────────────
      case 'createPage': {
        const { id, title, slug } = body;
        if (!id || !title || !slug) return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
        
        const pages = db.get('pages') || [];
        if (pages.some(p => p.id === id || p.slug === slug)) {
          return NextResponse.json({ error: 'Page ID or slug already exists' }, { status: 400 });
        }
        
        const newPage = {
          id,
          title,
          slug,
          status: 'published',
          template: 'default',
          sections: ['hero', 'cta'], // Default sections
          seo: { title: '', description: '', robots: 'index,follow', ogImage: '' },
          lastModified: new Date().toISOString()
        };
        
        pages.push(newPage);
        db.set('pages', pages);
        logAction('admin', 'page_created', `Dynamic page created: ${title} (${slug})`);
        return NextResponse.json({ success: true, page: newPage });
      }

      // ── Create Service ─────────────────────────────────────
      case 'createService': {
        const { name, slug, category } = body;
        if (!name || !slug) return NextResponse.json({ error: 'Missing name or slug' }, { status: 400 });
        
        const services = db.get('services') || [];
        if (services.some(s => s.slug === slug || s.id === slug)) {
          return NextResponse.json({ error: 'Service slug already exists' }, { status: 400 });
        }
        
        const newSvc = {
          id: slug,
          name,
          slug,
          category: category || 'Web & E-commerce',
          shortDescription: 'Custom service description.',
          heroTitle: name,
          heroDescription: 'Custom service detailed description.',
          benefits: ['Benefit 1', 'Benefit 2'],
          features: ['Feature 1', 'Feature 2'],
          process: ['Process Step 1', 'Process Step 2'],
          deliverables: ['Deliverable 1'],
          technologies: ['React', 'Next.js'],
          pricing: [
            { name: 'Starter Package', price: 'Custom Quote', currency: 'USD', description: 'Basic setup package', features: ['Feature A'], popular: false, ctaText: 'Get Quote' }
          ],
          faqs: [],
          relatedServices: [],
          published: true,
          sortOrder: services.length + 1
        };
        
        services.push(newSvc);
        db.set('services', services);
        
        // Also register page for it so it shows in page list
        const pages = db.get('pages') || [];
        pages.push({
          id: `service_${slug}`,
          title: name,
          slug: `/services/${slug}`,
          status: 'published',
          template: 'services/[slug]',
          sections: [], // renders service detail template
          seo: { title: '', description: '', robots: 'index,follow', ogImage: '' }
        });
        db.set('pages', pages);
        
        logAction('admin', 'service_created', `Service created: ${name} (${slug})`);
        return NextResponse.json({ success: true, service: newSvc });
      }

      // ── Add section to a page ─────────────────────────────────────
      case 'addSection': {
        const { pageId, componentType } = body;
        if (!pageId || !componentType) return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
        
        const pages = db.get('pages') || [];
        const pageIdx = pages.findIndex(p => p.id === pageId);
        if (pageIdx === -1) return NextResponse.json({ error: 'Page not found' }, { status: 404 });
        
        const newSectionId = `${componentType}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        
        // Add to page sections
        if (!pages[pageIdx].sections) pages[pageIdx].sections = [];
        pages[pageIdx].sections.push(newSectionId);
        db.set('pages', pages);
        
        // Initialize default empty component settings
        const components = db.get('components') || {};
        components[newSectionId] = { visible: true };
        db.set('components', components);
        
        logAction('admin', 'section_added', `Section ${newSectionId} of type ${componentType} added to ${pageId}`);
        return NextResponse.json({ success: true, sectionId: newSectionId });
      }

      // ── Delete section from a page ─────────────────────────────────────
      case 'deleteSection': {
        const { pageId, sectionId } = body;
        if (!pageId || !sectionId) return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
        
        const pages = db.get('pages') || [];
        const pageIdx = pages.findIndex(p => p.id === pageId);
        if (pageIdx === -1) return NextResponse.json({ error: 'Page not found' }, { status: 404 });
        
        if (pages[pageIdx].sections) {
          pages[pageIdx].sections = pages[pageIdx].sections.filter(id => id !== sectionId);
          db.set('pages', pages);
        }
        
        // Also cleanup components/drafts if wanted, but keeping is safer for undo/history.
        logAction('admin', 'section_deleted', `Section ${sectionId} deleted from ${pageId}`);
        return NextResponse.json({ success: true });
      }

      // ── Duplicate section on a page ─────────────────────────────────────
      case 'duplicateSection': {
        const { pageId, sectionId } = body;
        if (!pageId || !sectionId) return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
        
        const pages = db.get('pages') || [];
        const pageIdx = pages.findIndex(p => p.id === pageId);
        if (pageIdx === -1) return NextResponse.json({ error: 'Page not found' }, { status: 404 });
        
        const sections = pages[pageIdx].sections || [];
        const secIdx = sections.indexOf(sectionId);
        if (secIdx === -1) return NextResponse.json({ error: 'Section not found on page' }, { status: 400 });
        
        const componentType = sectionId.split('_')[0];
        const newSectionId = `${componentType}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        
        // Clone components/drafts data
        const components = db.get('components') || {};
        const sourceData = components[sectionId] || {};
        components[newSectionId] = JSON.parse(JSON.stringify(sourceData));
        db.set('components', components);
        
        // Insert into sections list after the source
        sections.splice(secIdx + 1, 0, newSectionId);
        pages[pageIdx].sections = sections;
        db.set('pages', pages);
        
        logAction('admin', 'section_duplicated', `Section ${sectionId} duplicated to ${newSectionId}`);
        return NextResponse.json({ success: true, sectionId: newSectionId });
      }

      // ── Toggle section visibility ─────────────────────────────────────
      case 'toggleVisibility': {
        const { componentKey } = body;
        const components = db.get('components') || {};
        if (!components[componentKey]) components[componentKey] = {};
        const newVisible = !(components[componentKey].visible !== false);
        components[componentKey].visible = newVisible;
        db.set('components', components);
        logAction('admin', 'visibility_toggled', `${componentKey}: ${newVisible ? 'visible' : 'hidden'}`);
        return NextResponse.json({ success: true, visible: newVisible });
      }

      // ── Update global design tokens ───────────────────────────────────
      case 'updateGlobalStyles': {
        const { styles } = body;
        db.set('globalStyles', styles);
        logAction('admin', 'global_styles_updated', 'Global design system updated');
        return NextResponse.json({ success: true });
      }

      // ── Update navigation ─────────────────────────────────────────────
      case 'updateNavigation': {
        const { navigation } = body;
        db.set('navigation', navigation);
        logAction('admin', 'navigation_updated', 'Navigation updated');
        return NextResponse.json({ success: true });
      }

      // ── Update footer ─────────────────────────────────────────────────
      case 'updateFooter': {
        const { footer } = body;
        db.set('footer', footer);
        logAction('admin', 'footer_updated', 'Footer updated');
        return NextResponse.json({ success: true });
      }

      // ── Update global settings ────────────────────────────────────────
      case 'updateSettings': {
        const { settings } = body;
        const existing = db.get('settings') || {};
        db.set('settings', { ...existing, ...settings });
        logAction('admin', 'settings_updated', 'Site settings updated');
        return NextResponse.json({ success: true });
      }

      // ── Update page SEO metadata ──────────────────────────────────────
      case 'updatePageSeo': {
        const { pageId, seo } = body;
        const pages = db.get('pages') || [];
        const idx = pages.findIndex(p => p.id === pageId);
        if (idx === -1) return NextResponse.json({ error: 'Page not found' }, { status: 404 });
        pages[idx].seo = { ...pages[idx].seo, ...seo };
        pages[idx].lastModified = new Date().toISOString();
        db.set('pages', pages);
        logAction('admin', 'seo_updated', `SEO updated for: ${pageId}`);
        return NextResponse.json({ success: true });
      }

      // ── Restore a revision ────────────────────────────────────────────
      case 'restoreRevision': {
        const { revisionId } = body;
        const revisions = db.get('revisions') || [];
        const rev = revisions.find(r => r.id === revisionId);
        if (!rev) return NextResponse.json({ error: 'Revision not found' }, { status: 404 });

        if (rev.snapshot.components) db.set('components', rev.snapshot.components);
        if (rev.snapshot.navigation) db.set('navigation', rev.snapshot.navigation);
        if (rev.snapshot.footer) db.set('footer', rev.snapshot.footer);
        db.set('drafts', {});

        logAction('admin', 'revision_restored', `Restored revision: ${rev.label || revisionId}`);
        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (err) {
    console.error('[visual-editor API]', err);
    return NextResponse.json({ error: 'Internal server error: ' + err.message }, { status: 500 });
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function logAction(user, action, details) {
  try {
    const log = db.get('activityLog') || [];
    log.unshift({
      id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      user,
      action,
      details,
    });
    // Keep max 500 entries
    db.set('activityLog', log.slice(0, 500));
  } catch (e) {
    console.error('Failed to log activity:', e);
  }
}

function createRevision(user, label, snapshot) {
  try {
    const revisions = db.get('revisions') || [];
    revisions.push({
      id: `rev_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      timestamp: new Date().toISOString(),
      user,
      label,
      snapshot,
    });
    // Keep max 50 revisions
    db.set('revisions', revisions.slice(-50));
  } catch (e) {
    console.error('Failed to create revision:', e);
  }
}
