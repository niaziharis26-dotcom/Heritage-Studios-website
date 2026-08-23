'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { COMPONENT_REGISTRY } from '@/lib/componentRegistry';

// ── Styles ─────────────────────────────────────────────────────────────────────
const S = {
  wrap: { display: 'flex', flexDirection: 'column', height: '100vh', background: '#0a0f1a', fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#e5e7eb', overflow: 'hidden' },
  topbar: { height: 52, background: '#0e1420', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.25rem', flexShrink: 0, gap: '1rem' },
  body: { display: 'flex', flex: 1, overflow: 'hidden' },
  sidebar: { width: 300, background: '#0e1420', borderRight: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', flexShrink: 0, overflow: 'hidden' },
  canvas: { flex: 1, background: '#060b14', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' },
  inspector: { width: 340, background: '#0e1420', borderLeft: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', flexShrink: 0, overflow: 'hidden' },
  tabBar: { display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 },
  tabBtn: (active) => ({
    flex: 1, padding: '0.6rem 0.5rem', background: 'none', border: 'none', cursor: 'pointer',
    color: active ? '#34d399' : '#6b7280', fontSize: '0.72rem', fontWeight: 700, fontFamily: 'Outfit, sans-serif',
    textTransform: 'uppercase', letterSpacing: '0.06em',
    borderBottom: active ? '2px solid #059669' : '2px solid transparent',
    transition: 'all 0.15s',
  }),
  scroll: { flex: 1, overflowY: 'auto', padding: '1rem' },
  sectionRow: (selected) => ({
    display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.65rem 0.85rem',
    borderRadius: 10, border: `1px solid ${selected ? 'rgba(5,150,105,0.5)' : 'rgba(255,255,255,0.05)'}`,
    background: selected ? 'rgba(5,150,105,0.08)' : '#0a0f1a',
    marginBottom: '0.4rem', cursor: 'pointer', transition: 'all 0.15s',
  }),
  label: { display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.35rem' },
  input: { width: '100%', background: '#0a0f1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '0.55rem 0.75rem', color: '#fff', fontSize: '0.88rem', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' },
  textarea: { width: '100%', background: '#0a0f1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '0.55rem 0.75rem', color: '#fff', fontSize: '0.88rem', fontFamily: 'inherit', outline: 'none', resize: 'vertical', boxSizing: 'border-box' },
  btnPrimary: { background: 'linear-gradient(135deg,#059669,#047857)', border: 'none', borderRadius: 8, color: '#fff', padding: '0.6rem 1.25rem', fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', transition: 'opacity 0.2s' },
  btnGhost: { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#9ca3af', padding: '0.55rem 1rem', fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.15s' },
  iconBtn: { background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', padding: '0.25rem 0.4rem', borderRadius: 6, fontSize: '0.8rem', transition: 'all 0.15s' },
  card: { background: '#141a26', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '1rem', marginBottom: '0.75rem' },
  badge: (type) => ({
    display: 'inline-flex', alignItems: 'center', padding: '0.2rem 0.6rem', borderRadius: 20,
    fontSize: '0.7rem', fontWeight: 700, fontFamily: 'Outfit, sans-serif',
    ...(type === 'live' ? { background: 'rgba(5,150,105,0.2)', color: '#34d399', border: '1px solid rgba(5,150,105,0.3)' } : {}),
    ...(type === 'draft' ? { background: 'rgba(245,158,11,0.2)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.3)' } : {}),
    ...(type === 'saving' ? { background: 'rgba(99,102,241,0.2)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.3)' } : {}),
  }),
};

// ── Toast ──────────────────────────────────────────────────────────────────────
function showToast(msg, type = 'success') {
  if (typeof document === 'undefined') return;
  const t = document.createElement('div');
  t.textContent = msg;
  Object.assign(t.style, {
    position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 99999,
    padding: '0.85rem 1.5rem', borderRadius: '12px',
    fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.9rem',
    color: '#fff', background: type === 'success' ? '#059669' : type === 'error' ? '#dc2626' : '#6366f1',
    boxShadow: '0 8px 30px rgba(0,0,0,0.35)', transition: 'opacity 0.3s',
  });
  document.body.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, 3000);
}

// ── Field Editor ───────────────────────────────────────────────────────────────
function FieldEditor({ field, value, onChange }) {
  if (field.type === 'textarea') {
    return (
      <div style={{ marginBottom: '1rem' }}>
        <label style={S.label}>{field.label}</label>
        <textarea style={S.textarea} rows={3} value={value || ''} onChange={e => onChange(e.target.value)} placeholder={field.placeholder || ''} />
      </div>
    );
  }
  if (field.type === 'color') {
    return (
      <div style={{ marginBottom: '1rem' }}>
        <label style={S.label}>{field.label}</label>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input type="color" value={value || '#000000'} onChange={e => onChange(e.target.value)} style={{ width: 36, height: 36, border: 'none', borderRadius: 6, cursor: 'pointer', background: 'none' }} />
          <input style={{ ...S.input, flex: 1 }} value={value || ''} onChange={e => onChange(e.target.value)} placeholder="#000000" />
        </div>
      </div>
    );
  }
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={S.label}>{field.label}</label>
      <input style={S.input} type="text" value={value || ''} onChange={e => onChange(e.target.value)} placeholder={field.placeholder || ''} />
    </div>
  );
}

// ── Array Field Editor ─────────────────────────────────────────────────────────
function ArrayFieldEditor({ arrayField, value, onChange }) {
  const items = value || [];
  const updateItem = (idx, fieldId, val) => {
    const next = [...items];
    next[idx] = { ...next[idx], [fieldId]: val };
    onChange(next);
  };
  const addItem = () => {
    const blank = {};
    arrayField.fields.forEach(f => { blank[f.id] = ''; });
    onChange([...items, blank]);
  };
  const removeItem = idx => onChange(items.filter((_, i) => i !== idx));

  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
        <label style={S.label}>{arrayField.label}</label>
        <button onClick={addItem} style={{ ...S.iconBtn, fontSize: '0.75rem', color: '#34d399' }}>+ {arrayField.addLabel}</button>
      </div>
      {items.map((item, idx) => (
        <div key={idx} style={{ ...S.card, position: 'relative', paddingTop: '1.5rem' }}>
          <button onClick={() => removeItem(idx)} style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', ...S.iconBtn, color: '#ef4444' }}>✕</button>
          <p style={{ ...S.label, marginBottom: '0.75rem' }}>#{idx + 1}</p>
          {arrayField.fields.map(f => (
            <FieldEditor key={f.id} field={f} value={item[f.id]} onChange={val => updateItem(idx, f.id, val)} />
          ))}
        </div>
      ))}
    </div>
  );
}

// ── Main Visual Editor Page ─────────────────────────────────────────────────────────
export default function VisualEditorPage() {
  const [cmsData, setCmsData] = useState(null);
  const [activePage, setActivePage] = useState('home');
  const [selectedSection, setSelectedSection] = useState(null);
  const [editBuffer, setEditBuffer] = useState({});
  const [device, setDevice] = useState('desktop');
  const [leftTab, setLeftTab] = useState('layers');
  const [rightTab, setRightTab] = useState('content');
  const [iframeKey, setIframeKey] = useState(0);
  const [saving, setSaving] = useState(false);
  const [autosaving, setAutosaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [publishStatus, setPublishStatus] = useState('live');
  const [iframeLoading, setIframeLoading] = useState(true);
  
  const [navData, setNavData] = useState(null);
  const [footerData, setFooterData] = useState(null);
  const [revisions, setRevisions] = useState([]);
  const [globalStyles, setGlobalStyles] = useState({});
  const [mediaList, setMediaList] = useState([]);
  const [pageSeoData, setPageSeoData] = useState({});
  const [pagesList, setPagesList] = useState([]);
  const [servicesList, setServicesList] = useState([]);

  // Create Page/Service form states
  const [showAddPageModal, setShowAddPageModal] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageSlug, setNewPageSlug] = useState('');
  const [newPageType, setNewPageType] = useState('standard'); // standard | service

  const [showAddSectionMenu, setShowAddSectionMenu] = useState(false);

  const autosaveTimer = useRef(null);

  // Load all CMS data
  const loadCmsData = () => {
    fetch('/api/admin/visual-editor')
      .then(r => r.json())
      .then(data => {
        setCmsData(data.components || {});
        setNavData(data.navigation || {});
        setFooterData(data.footer || {});
        setGlobalStyles(data.globalStyles || {});
        setRevisions(data.revisions || []);
        setPagesList(data.pages || []);
        
        // Build page SEO map from pages array
        const seoMap = {};
        (data.pages || []).forEach(p => { seoMap[p.id] = p.seo || {}; });
        setPageSeoData(seoMap);
      })
      .catch(() => showToast('Failed to load CMS data', 'error'));
      
    fetch('/api/admin/services')
      .then(r => r.json())
      .then(data => setServicesList(data.services || []))
      .catch(() => {});

    fetch('/api/admin/media')
      .then(r => r.json())
      .then(d => setMediaList(d.media || []))
      .catch(() => {});
  };

  useEffect(() => {
    loadCmsData();
  }, []);

  const [selectedElementInfo, setSelectedElementInfo] = useState(null);

  // Listen for iframe messages (bridge)
  useEffect(() => {
    const handleMessage = (e) => {
      if (!e.data) return;

      if (e.data.type === 'element-selected') {
        const { sectionId, fieldId, tagName, text, src, alt, hierarchy } = e.data;
        if (sectionId) setSelectedSection(sectionId);
        
        setSelectedElementInfo({
          sectionId,
          fieldId,
          tagName,
          text,
          src,
          alt,
          hierarchy
        });
        
        setRightTab('content');
      } else if (e.data.type === 'inline-edit') {
        const { sectionId, fieldId, text } = e.data;
        if (sectionId && fieldId) {
          setEditBuffer(prev => ({
            ...prev,
            [sectionId]: { ...(prev[sectionId] || {}), [fieldId]: text }
          }));
        }
      } else if (e.data.type === 'navigate-page') {
        let { path } = e.data;
        if (path.includes('?')) path = path.split('?')[0];
        
        // Find existing page or dynamic service page matching path
        let targetPage = pagesList.find(p => p.slug === path || p.id === path);
        if (!targetPage) {
          if (path.startsWith('/services/')) {
            const slug = path.replace('/services/', '');
            const svc = servicesList.find(s => s.slug === slug || s.id === slug);
            if (svc) {
              targetPage = { id: svc.id, title: svc.name, slug: path, template: 'service' };
            } else {
              targetPage = { id: slug, title: slug, slug: path, template: 'service' };
            }
          } else {
            const cleanId = path.replace('/', '') || 'home';
            targetPage = { id: cleanId, title: cleanId.toUpperCase(), slug: path, template: 'default' };
          }
          setPagesList(prev => prev.some(p => p.id === targetPage.id) ? prev : [...prev, targetPage]);
        }
        
        if (targetPage) {
          setActivePage(targetPage.id);
          setSelectedSection(targetPage.id);
          setIframeKey(k => k + 1);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Autosave: debounced on editBuffer changes
  useEffect(() => {
    if (Object.keys(editBuffer).length === 0) return;
    clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(async () => {
      setAutosaving(true);
      for (const [key, data] of Object.entries(editBuffer)) {
        await fetch('/api/admin/visual-editor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'saveDraft', componentKey: key, data }),
        });
      }
      setAutosaving(false);
      setLastSaved(new Date());
      setPublishStatus('draft');
    }, 4000);
    return () => clearTimeout(autosaveTimer.current);
  }, [editBuffer]);

  // Save a single section or service as live data
  const saveDraft = async (sectionId) => {
    const targetKey = sectionId || selectedElementInfo?.sectionId;
    if (!targetKey) return;
    const data = editBuffer[targetKey] ?? cmsData?.[targetKey];
    setSaving(true);
    try {
      // First save draft
      await fetch('/api/admin/visual-editor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'saveDraft', componentKey: targetKey, data }),
      });
      // Then publish to live
      const r = await fetch('/api/admin/visual-editor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'publishAll', editBuffer }),
      });
      if (r.ok) {
        setLastSaved(new Date());
        setPublishStatus('live');
        setIframeKey(k => k + 1);
        showToast('✅ Saved & Published to Live!');
        await loadCmsData();
      } else showToast('Save failed', 'error');
    } catch { showToast('Save failed', 'error'); }
    setSaving(false);
  };

  // Publish all changes
  const publishAll = async () => {
    setSaving(true);
    try {
      // First ensure all active editBuffer items are synced into drafts
      for (const [key, data] of Object.entries(editBuffer)) {
        await fetch('/api/admin/visual-editor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'saveDraft', componentKey: key, data }),
        });
      }
      
      const r = await fetch('/api/admin/visual-editor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'publishAll', editBuffer }),
      });
      if (r.ok) {
        setPublishStatus('live');
        setEditBuffer({});
        setIframeKey(k => k + 1);
        showToast('🚀 Published! Changes are permanently live.');
        await loadCmsData();
      } else showToast('Publish failed', 'error');
    } catch (e) { console.error(e); showToast('Publish failed', 'error'); }
    setSaving(false);
  };

  // Dynamic Section Management
  const addSection = async (type) => {
    setSaving(true);
    try {
      const r = await fetch('/api/admin/visual-editor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'addSection', pageId: activePage, componentType: type })
      });
      if (r.ok) {
        showToast('Section added!');
        setIframeKey(k => k + 1);
        loadCmsData();
      }
    } catch {}
    setSaving(false);
    setShowAddSectionMenu(false);
  };

  const deleteSection = async (sectionId) => {
    if (!confirm('Are you sure you want to delete this section?')) return;
    setSaving(true);
    try {
      const r = await fetch('/api/admin/visual-editor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'deleteSection', pageId: activePage, sectionId })
      });
      if (r.ok) {
        showToast('Section deleted');
        setSelectedSection(null);
        setIframeKey(k => k + 1);
        loadCmsData();
      }
    } catch {}
    setSaving(false);
  };

  const duplicateSection = async (sectionId) => {
    setSaving(true);
    try {
      const r = await fetch('/api/admin/visual-editor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'duplicateSection', pageId: activePage, sectionId })
      });
      if (r.ok) {
        showToast('Section duplicated');
        setIframeKey(k => k + 1);
        loadCmsData();
      }
    } catch {}
    setSaving(false);
  };

  const toggleVisibility = async (sectionId) => {
    const r = await fetch('/api/admin/visual-editor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'toggleVisibility', componentKey: sectionId }),
    });
    if (r.ok) {
      showToast('Visibility toggled');
      setIframeKey(k => k + 1);
      loadCmsData();
    }
  };

  const moveSection = async (idx, dir) => {
    const page = pagesList.find(p => p.id === activePage);
    if (!page) return;
    const sections = [...(page.sections || [])];
    const targetIdx = idx + dir;
    if (targetIdx < 0 || targetIdx >= sections.length) return;
    
    [sections[idx], sections[targetIdx]] = [sections[targetIdx], sections[idx]];
    
    setSaving(true);
    const r = await fetch('/api/admin/visual-editor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reorderSections', pageId: activePage, sections })
    });
    if (r.ok) {
      showToast('Order saved');
      setIframeKey(k => k + 1);
      loadCmsData();
    }
    setSaving(false);
  };

  // Dynamic Page/Service Creation
  const handleCreatePage = async (e) => {
    e.preventDefault();
    if (!newPageTitle || !newPageSlug) return;
    
    setSaving(true);
    try {
      const endpoint = newPageType === 'service' ? 'createService' : 'createPage';
      const payload = newPageType === 'service' 
        ? { name: newPageTitle, slug: newPageSlug, category: 'Web & E-commerce' }
        : { id: newPageTitle.toLowerCase().replace(/[^a-z0-9]/g, '_'), title: newPageTitle, slug: newPageSlug.startsWith('/') ? newPageSlug : '/' + newPageSlug };
      
      const r = await fetch('/api/admin/visual-editor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: endpoint, ...payload })
      });
      
      if (r.ok) {
        showToast('Page created successfully!');
        setShowAddPageModal(false);
        setNewPageTitle('');
        setNewPageSlug('');
        loadCmsData();
      } else {
        const err = await r.json();
        showToast(err.error || 'Failed to create page', 'error');
      }
    } catch {
      showToast('Error creating page', 'error');
    }
    setSaving(false);
  };

  const saveGlobal = async (type, data) => {
    setSaving(true);
    const actionMap = { navigation: 'updateNavigation', footer: 'updateFooter', globalStyles: 'updateGlobalStyles' };
    const payloadMap = { navigation: { navigation: data }, footer: { footer: data }, globalStyles: { styles: data } };
    try {
      const r = await fetch('/api/admin/visual-editor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: actionMap[type], ...payloadMap[type] }),
      });
      if (r.ok) { showToast('Saved successfully!'); setIframeKey(k => k + 1); }
      else showToast('Save failed', 'error');
    } catch { showToast('Save failed', 'error'); }
    setSaving(false);
  };

  const savePageSeo = async (pageId) => {
    const seo = pageSeoData[pageId] || {};
    setSaving(true);
    try {
      const r = await fetch('/api/admin/visual-editor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'updatePageSeo', pageId, seo }),
      });
      if (r.ok) showToast('✅ SEO saved!');
      else showToast('SEO save failed', 'error');
    } catch { showToast('Failed', 'error'); }
    setSaving(false);
  };

  const restoreRevision = async (revisionId) => {
    if (!confirm('Restore this revision?')) return;
    setSaving(true);
    try {
      const r = await fetch('/api/admin/visual-editor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'restoreRevision', revisionId }),
      });
      if (r.ok) {
        showToast('Revision restored!');
        setIframeKey(k => k + 1);
        setEditBuffer({});
        loadCmsData();
      }
    } catch {}
    setSaving(false);
  };

  // Helper values
  const page = pagesList.find(p => p.id === activePage) || servicesList.find(s => s.id === activePage) || pagesList[0];
  const activePagePath = page?.slug ? (page.slug.startsWith('/services/') ? page.slug : (page.slug.startsWith('/') ? page.slug : '/services/' + page.slug)) : '/';
  const previewUrl = () => `${activePagePath}?_t=${iframeKey}&cms_preview=1`;

  const getFieldValue = (sectionId, fieldId) => {
    // Check if editing a service
    const isService = servicesList.some(s => s.id === sectionId);
    if (isService) {
      const buf = editBuffer[sectionId];
      if (buf && fieldId in buf) return buf[fieldId];
      const svc = servicesList.find(s => s.id === sectionId);
      return svc?.[fieldId];
    }
    const buf = editBuffer[sectionId];
    if (buf && fieldId in buf) return buf[fieldId];
    return cmsData?.[sectionId]?.[fieldId];
  };

  const setFieldValue = async (sectionId, fieldId, val) => {
    const isService = servicesList.some(s => s.id === sectionId);
    let updatedData = {};
    if (isService) {
      const svc = servicesList.find(s => s.id === sectionId);
      updatedData = { ...(editBuffer[sectionId] ?? svc ?? {}), [fieldId]: val };
    } else {
      updatedData = { ...(editBuffer[sectionId] ?? cmsData?.[sectionId] ?? {}), [fieldId]: val };
    }
    
    setEditBuffer(prev => ({ ...prev, [sectionId]: updatedData }));

    // Instant direct save & publish to database.json
    try {
      await fetch('/api/admin/visual-editor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'publishAll', editBuffer: { [sectionId]: updatedData } }),
      });
      setPublishStatus('live');
      setIframeKey(k => k + 1);
    } catch (e) {
      console.error('Auto submission error:', e);
    }
  };

  const getArrayValue = (sectionId, arrayKey) => {
    const isService = servicesList.some(s => s.id === sectionId);
    if (isService) {
      const buf = editBuffer[sectionId];
      if (buf && arrayKey in buf) return buf[arrayKey];
      const svc = servicesList.find(s => s.id === sectionId);
      return svc?.[arrayKey] || [];
    }
    const buf = editBuffer[sectionId];
    if (buf && arrayKey in buf) return buf[arrayKey];
    return cmsData?.[sectionId]?.[arrayKey] || [];
  };

  const setArrayValue = async (sectionId, arrayKey, val) => {
    const isService = servicesList.some(s => s.id === sectionId);
    let updatedData = {};
    if (isService) {
      const svc = servicesList.find(s => s.id === sectionId);
      updatedData = { ...(editBuffer[sectionId] ?? svc ?? {}), [arrayKey]: val };
    } else {
      updatedData = { ...(editBuffer[sectionId] ?? cmsData?.[sectionId] ?? {}), [arrayKey]: val };
    }

    setEditBuffer(prev => ({ ...prev, [sectionId]: updatedData }));

    // Instant direct save & publish to database.json
    try {
      await fetch('/api/admin/visual-editor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'publishAll', editBuffer: { [sectionId]: updatedData } }),
      });
      setPublishStatus('live');
      setIframeKey(k => k + 1);
    } catch (e) {
      console.error('Auto array submission error:', e);
    }
  };

  // Fields registry config mapping
  let reg = null;
  if (selectedSection) {
    // Check if selected section is a service family
    const isService = servicesList.some(s => s.id === selectedSection);
    if (isService) {
      const svc = servicesList.find(s => s.id === selectedSection);
      reg = {
        name: svc ? `Service: ${svc.name}` : 'Service Details',
        icon: svc?.icon || '🛠️',
        fields: [
          { id: 'name', label: 'Service Name', type: 'text' },
          { id: 'shortDescription', label: 'Short Description', type: 'textarea' },
          { id: 'heroTitle', label: 'Detailed Page Hero Title', type: 'text' },
          { id: 'heroDescription', label: 'Detailed Hero Description', type: 'textarea' },
          { id: 'startingPrice', label: 'Starting Price Text', type: 'text' },
          { id: 'benefits', label: 'Benefits (Newline separated)', type: 'textarea' },
          { id: 'deliverables', label: 'Deliverables (Newline separated)', type: 'textarea' },
          { id: 'technologies', label: 'Technologies (Comma separated)', type: 'text' },
          { id: 'category', label: 'Category Area', type: 'text' },
        ],
        arrayField: {
          key: 'pricing',
          label: 'Service Packages & Pricing',
          addLabel: 'Add Package',
          fields: [
            { id: 'name', label: 'Package Title', type: 'text' },
            { id: 'price', label: 'Pricing Amount (Starting From / Range)', type: 'text' },
            { id: 'currency', label: 'Currency', type: 'text' },
            { id: 'description', label: 'Short Description', type: 'textarea' },
            { id: 'features', label: 'Features (Comma separated)', type: 'textarea' },
            { id: 'ctaText', label: 'Button CTA Text', type: 'text' }
          ]
        }
      };
    } else {
      const cleanType = selectedSection.split('_')[0];
      reg = COMPONENT_REGISTRY[cleanType] || COMPONENT_REGISTRY[selectedSection];
    }
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        input:focus, textarea:focus, select:focus { border-color: rgba(5,150,105,0.5) !important; outline: none !important; }
      `}</style>
      
      <div style={S.wrap}>
        {/* ── TOP BAR ── */}
        <div style={S.topbar}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link href="/admin" style={{ color: '#6b7280', fontSize: '0.82rem', textDecoration: 'none' }}>← Dashboard</Link>
            <span style={{ color: 'rgba(255,255,255,0.15)' }}>|</span>
            <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, color: '#fff' }}>♦ Visual Website Editor</span>
          </div>

          {/* Device toggle */}
          <div style={{ display: 'flex', gap: '0.25rem', background: '#0a0f1a', borderRadius: 8, padding: '0.25rem' }}>
            {['desktop', 'tablet', 'mobile'].map(d => (
              <button key={d} onClick={() => setDevice(d)} style={{
                background: device === d ? 'rgba(5,150,105,0.25)' : 'none',
                border: 'none', borderRadius: 6, color: device === d ? '#34d399' : '#6b7280',
                padding: '0.3rem 0.75rem', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600
              }}>
                {d === 'desktop' ? '🖥' : d === 'tablet' ? '⬜' : '📱'} {d.toUpperCase()}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {autosaving && <span style={S.badge('saving')}>Saving Draft…</span>}
            <span style={S.badge(publishStatus === 'live' ? 'live' : 'draft')}>
              {publishStatus === 'live' ? '● Live' : '◎ Draft'}
            </span>
            <button onClick={publishAll} disabled={saving} style={S.btnPrimary}>
              {saving ? 'Publishing…' : '🚀 Publish Changes'}
            </button>
          </div>
        </div>

        {/* ── MAIN BODY ── */}
        <div style={S.body}>
          {/* ── LEFT SIDEBAR (Page & Layers Manager) ── */}
          <div style={S.sidebar}>
            <div style={S.tabBar}>
              <button style={S.tabBtn(leftTab === 'layers')} onClick={() => setLeftTab('layers')}>Layers / Sections</button>
              <button style={S.tabBtn(leftTab === 'pages')} onClick={() => setLeftTab('pages')}>Pages</button>
              <button style={S.tabBtn(leftTab === 'nav')} onClick={() => setLeftTab('nav')}>Header</button>
              <button style={S.tabBtn(leftTab === 'footer')} onClick={() => setLeftTab('footer')}>Footer</button>
            </div>

            {leftTab === 'layers' && (
              <div style={S.scroll}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={S.label}>Sections List</span>
                  <button onClick={() => setShowAddSectionMenu(!showAddSectionMenu)} style={{ ...S.iconBtn, color: '#34d399', fontWeight: 700 }}>+ Add Section</button>
                </div>

                {showAddSectionMenu && (
                  <div style={{ background: '#141a26', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: '0.5rem', marginBottom: '1rem' }}>
                    <p style={{ ...S.label, margin: '0 0 0.5rem 0' }}>Select Block Type</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem' }}>
                      {Object.entries(COMPONENT_REGISTRY).filter(([k, v]) => v.category === 'general').map(([key, block]) => (
                        <button key={key} onClick={() => addSection(key)} style={{ background: '#0a0f1a', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 6, color: '#fff', padding: '0.4rem', fontSize: '0.72rem', cursor: 'pointer', textAlign: 'left' }}>
                          {block.icon} {block.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Render Sections list with Up/Down/Duplicate/Delete controls */}
                {(page?.sections || []).length === 0 && (
                  <p style={{ color: '#4b5563', fontSize: '0.8rem', textAlign: 'center', margin: '2rem 0' }}>This page is rendered with a static template or has no blocks. Select blocks from editing tab.</p>
                )}

                {(page?.sections || []).map((secId, i) => {
                  const isSel = selectedSection === secId;
                  const type = secId.split('_')[0];
                  const blockInfo = COMPONENT_REGISTRY[type] || { name: secId, icon: '📦' };
                  return (
                    <div key={secId} style={{ ...S.sectionRow(isSel), flexDirection: 'column', alignItems: 'stretch', padding: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div onClick={() => setSelectedSection(secId)} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', cursor: 'pointer', flex: 1 }}>
                          <span>{blockInfo.icon}</span>
                          <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{blockInfo.name}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.2rem' }}>
                          <button onClick={() => moveSection(i, -1)} disabled={i === 0} style={S.iconBtn}>▲</button>
                          <button onClick={() => moveSection(i, 1)} disabled={i === (page.sections.length - 1)} style={S.iconBtn}>▼</button>
                          <button onClick={() => duplicateSection(secId)} style={{ ...S.iconBtn, color: '#34d399' }}>❐</button>
                          <button onClick={() => deleteSection(secId)} style={{ ...S.iconBtn, color: '#ef4444' }}>✕</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {leftTab === 'pages' && (
              <div style={S.scroll}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={S.label}>Website Pages</span>
                  <button onClick={() => setShowAddPageModal(true)} style={{ ...S.iconBtn, color: '#34d399', fontWeight: 700 }}>+ Create Page</button>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <p style={{ ...S.label, color: '#9ca3af', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.25rem', fontSize: '0.68rem' }}>Core Pages</p>
                  {pagesList.filter(p => !p.slug.startsWith('/services/')).map(p => (
                    <div key={p.id} style={S.sectionRow(activePage === p.id)} onClick={() => { setActivePage(p.id); setSelectedSection(null); }}>
                      <div>
                        <p style={{ margin: 0, fontSize: '0.84rem', fontWeight: 600, color: '#fff' }}>{p.title}</p>
                        <p style={{ margin: 0, fontSize: '0.68rem', color: '#6b7280' }}>{p.slug}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <p style={{ ...S.label, color: '#9ca3af', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.25rem', fontSize: '0.68rem' }}>Primary Services</p>
                  {servicesList.filter(s => !s.parentService).map(s => (
                    <div key={s.id} style={S.sectionRow(activePage === s.id)} onClick={() => { setActivePage(s.id); setSelectedSection(s.id); }}>
                      <div>
                        <p style={{ margin: 0, fontSize: '0.84rem', fontWeight: 600, color: '#fff' }}>{s.icon || '✦'} {s.name}</p>
                        <p style={{ margin: 0, fontSize: '0.68rem', color: '#6b7280' }}>/services/{s.slug}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <p style={{ ...S.label, color: '#9ca3af', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.25rem', fontSize: '0.68rem' }}>Sub-Services & Tiers</p>
                  {servicesList.filter(s => s.parentService).map(s => {
                    const parent = servicesList.find(p => p.id === s.parentService);
                    return (
                      <div key={s.id} style={S.sectionRow(activePage === s.id)} onClick={() => { setActivePage(s.id); setSelectedSection(s.id); }}>
                        <div>
                          <p style={{ margin: 0, fontSize: '0.84rem', fontWeight: 600, color: '#fff' }}>{s.icon || '⚡'} {s.name}</p>
                          <p style={{ margin: 0, fontSize: '0.68rem', color: '#6b7280' }}>↳ parent: {parent ? parent.name : s.parentService}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {leftTab === 'nav' && <div style={S.scroll}>
              <p style={S.label}>Header Links</p>
              {(navData?.links || []).map((link, idx) => (
                <div key={link.id} style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.5rem' }}>
                  <input style={S.input} value={link.name} onChange={e => {
                    const next = [...navData.links];
                    next[idx].name = e.target.value;
                    setNavData({ ...navData, links: next });
                  }} />
                  <input style={S.input} value={link.path} onChange={e => {
                    const next = [...navData.links];
                    next[idx].path = e.target.value;
                    setNavData({ ...navData, links: next });
                  }} />
                </div>
              ))}
              <button onClick={() => saveGlobal('navigation', navData)} style={{ ...S.btnPrimary, width: '100%', marginTop: '1rem' }}>💾 Save Header</button>
            </div>}

            {leftTab === 'footer' && <div style={S.scroll}>
              <p style={S.label}>Footer Info</p>
              <div style={{ marginBottom: '1rem' }}>
                <label style={S.label}>Tagline</label>
                <input style={S.input} value={footerData?.tagline || ''} onChange={e => setFooterData({ ...footerData, tagline: e.target.value })} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={S.label}>WhatsApp Button Text</label>
                <input style={S.input} value={footerData?.ctaPrimaryText || ''} onChange={e => setFooterData({ ...footerData, ctaPrimaryText: e.target.value })} />
              </div>
              <button onClick={() => saveGlobal('footer', footerData)} style={{ ...S.btnPrimary, width: '100%', marginTop: '1rem' }}>💾 Save Footer</button>
            </div>}
          </div>

          {/* ── CENTER FRAME ── */}
          <div style={S.canvas}>
            <div style={{
              width: device === 'mobile' ? '390px' : device === 'tablet' ? '768px' : '100%',
              height: '100%', display: 'flex', flexDirection: 'column', background: '#fff',
              boxShadow: '0 12px 40px rgba(0,0,0,0.5)', transition: 'width 0.3s'
            }}>
              {iframeLoading && (
                <div style={{ padding: '2rem', textAlign: 'center', background: '#0a0f1a', color: '#fff', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  Loading preview viewport…
                </div>
              )}
              <iframe
                key={iframeKey}
                src={previewUrl()}
                style={{ border: 'none', width: '100%', flex: 1, display: iframeLoading ? 'none' : 'block' }}
                onLoad={() => setIframeLoading(false)}
              />
            </div>
          </div>

          {/* ── RIGHT INSPECTOR (Editing Parameters) ── */}
          <div style={S.inspector}>
            {!selectedSection && !selectedElementInfo ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                <p>Click any text, image, card, or section in the preview window to edit details instantly.</p>
              </div>
            ) : (
              <>
                <div style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontFamily: 'Outfit, sans-serif' }}>{reg?.name || selectedSection || selectedElementInfo?.tagName?.toUpperCase() || 'Element Inspector'}</h3>
                  <button onClick={() => { setSelectedSection(null); setSelectedElementInfo(null); }} style={S.iconBtn}>✕</button>
                </div>
                
                <div style={S.tabBar}>
                  <button style={S.tabBtn(rightTab === 'content')} onClick={() => setRightTab('content')}>Content</button>
                  <button style={S.tabBtn(rightTab === 'seo')} onClick={() => setRightTab('seo')}>SEO</button>
                  <button style={S.tabBtn(rightTab === 'revisions')} onClick={() => setRightTab('revisions')}>History</button>
                </div>

                <div style={S.scroll}>
                  {rightTab === 'content' && (
                    <div>
                      {/* Element direct text/src quick edit fallback */}
                      {selectedElementInfo && (!selectedSection || !reg) && (
                        <div style={{ background: '#1e293b', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                          <p style={{ ...S.label, color: '#34d399', margin: '0 0 0.5rem 0' }}>Selected Element: &lt;{selectedElementInfo.tagName}&gt;</p>
                          {selectedElementInfo.tagName === 'img' ? (
                            <div>
                              <label style={S.label}>Image Source URL</label>
                              <input style={S.input} value={selectedElementInfo.src || ''} onChange={e => {
                                const newSrc = e.target.value;
                                setSelectedElementInfo(prev => ({ ...prev, src: newSrc }));
                                if (selectedElementInfo.sectionId && selectedElementInfo.fieldId) {
                                  setFieldValue(selectedElementInfo.sectionId, selectedElementInfo.fieldId, newSrc);
                                }
                              }} />
                            </div>
                          ) : (
                            <div>
                              <label style={S.label}>Element Text Content</label>
                              <textarea style={S.textarea} rows={4} value={selectedElementInfo.text || ''} onChange={e => {
                                const newText = e.target.value;
                                setSelectedElementInfo(prev => ({ ...prev, text: newText }));
                                if (selectedElementInfo.sectionId && selectedElementInfo.fieldId) {
                                  setFieldValue(selectedElementInfo.sectionId, selectedElementInfo.fieldId, newText);
                                }
                              }} />
                            </div>
                          )}
                        </div>
                      )}

                      {reg?.fields?.map(f => (
                        <FieldEditor
                          key={f.id}
                          field={f}
                          value={getFieldValue(selectedSection, f.id)}
                          onChange={val => setFieldValue(selectedSection, f.id, val)}
                        />
                      ))}
                      {reg?.arrayField && (
                        <ArrayFieldEditor
                          arrayField={reg.arrayField}
                          value={getArrayValue(selectedSection, reg.arrayField.key)}
                          onChange={val => setArrayValue(selectedSection, reg.arrayField.key, val)}
                        />
                      )}
                      
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                        <button onClick={() => saveDraft(selectedSection)} style={{ ...S.btnPrimary, flex: 1 }}>Save Draft</button>
                        <button onClick={() => toggleVisibility(selectedSection)} style={{ ...S.btnGhost, color: '#fff' }}>👁 Toggle On/Off</button>
                      </div>
                    </div>
                  )}

                  {rightTab === 'seo' && (
                    <div>
                      <p style={S.label}>SEO Meta for {page?.title}</p>
                      <div style={{ marginBottom: '1rem' }}>
                        <label style={S.label}>SEO Page Title</label>
                        <input style={S.input} value={pageSeoData[activePage]?.title || ''} onChange={e => setPageSeoData({ ...pageSeoData, [activePage]: { ...(pageSeoData[activePage] || {}), title: e.target.value } })} />
                      </div>
                      <div style={{ marginBottom: '1rem' }}>
                        <label style={S.label}>Meta Description</label>
                        <textarea style={S.textarea} rows={4} value={pageSeoData[activePage]?.description || ''} onChange={e => setPageSeoData({ ...pageSeoData, [activePage]: { ...(pageSeoData[activePage] || {}), description: e.target.value } })} />
                      </div>
                      <button onClick={() => savePageSeo(activePage)} style={{ ...S.btnPrimary, width: '100%' }}>Save SEO Metadata</button>
                    </div>
                  )}

                  {rightTab === 'revisions' && (
                    <div>
                      <span style={S.label}>Restore Previous State</span>
                      {revisions.map((rev, idx) => (
                        <div key={rev.id || idx} style={{ ...S.card, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                          <div>
                            <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 600 }}>{rev.label || 'Saved State'}</p>
                            <p style={{ margin: 0, fontSize: '0.68rem', color: '#6b7280' }}>{new Date(rev.timestamp).toLocaleString()}</p>
                          </div>
                          <button onClick={() => restoreRevision(rev.id)} style={{ ...S.btnGhost, fontSize: '0.7rem', padding: '0.3rem 0.6rem' }}>Restore</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Add Page Modal */}
      {showAddPageModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}>
          <form onSubmit={handleCreatePage} style={{ background: '#0e1420', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '2rem', width: '400px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ margin: 0, fontFamily: 'Outfit, sans-serif' }}>Create Dynamic Page / Service</h3>
            
            <div>
              <label style={S.label}>Page/Service Title</label>
              <input style={S.input} required value={newPageTitle} onChange={e => setNewPageTitle(e.target.value)} placeholder="Shopify Store Migration" />
            </div>

            <div>
              <label style={S.label}>Slug Path URL</label>
              <input style={S.input} required value={newPageSlug} onChange={e => setNewPageSlug(e.target.value)} placeholder="services/shopify/migration" />
            </div>

            <div>
              <label style={S.label}>Type</label>
              <select style={S.input} value={newPageType} onChange={e => setNewPageType(e.target.value)}>
                <option value="standard">Standard Content Page</option>
                <option value="service">Detailed Service Offer Family</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button type="button" onClick={() => setShowAddPageModal(false)} style={S.btnGhost}>Cancel</button>
              <button type="submit" style={S.btnPrimary}>Create Page</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
