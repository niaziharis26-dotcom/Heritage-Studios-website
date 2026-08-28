'use client';
import { useState, useEffect } from 'react';
import MediaSelector from '@/components/MediaSelector';
import AdminLayoutWrapper from '@/components/AdminLayoutWrapper';

const CATEGORIES = ['Web & E-commerce', 'Software & Technology', 'Creative', 'Marketing & Research'];

const EMPTY_FORM = {
  name: '', slug: '', icon: '💻', parentService: '', category: 'Web & E-commerce',
  shortDescription: '', heroTitle: '', heroDescription: '', startingPrice: '',
  technologies: '', benefits: '', deliverables: '',
  featuresJson: '[]', processJson: '[]', pricingJson: '[]', faqsJson: '[]',
  seoTitle: '', seoDescription: '',
  published: true, sortOrder: 1
};

export default function AdminServicesPage() {
  const [services, setServices]     = useState([]);
  const [editing, setEditing]       = useState(null);  // null = list, 'new' = create, object = edit
  const [form, setForm]             = useState(EMPTY_FORM);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [toast, setToast]           = useState('');

  useEffect(() => { fetchServices(); }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/admin/services');
      if (res.ok) { const d = await res.json(); setServices(d.services || []); }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const openCreate = () => {
    setForm({ ...EMPTY_FORM, sortOrder: services.length + 1 });
    setEditing('new');
  };

  const openEdit = (s) => {
    setForm({
      ...s,
      icon: s.icon || '💻',
      parentService: s.parentService || '',
      startingPrice: s.startingPrice || '',
      technologies: (s.technologies || []).join(', '),
      benefits: (s.benefits || []).join('\n'),
      deliverables: (s.deliverables || []).join('\n'),
      featuresJson: JSON.stringify(s.features || [], null, 2),
      processJson: JSON.stringify(s.process || [], null, 2),
      pricingJson: JSON.stringify(s.pricing || [], null, 2),
      faqsJson: JSON.stringify(s.faqs || [], null, 2),
      seoTitle: s.seo?.title || '',
      seoDescription: s.seo?.description || '',
    });
    setEditing(s);
  };

  const closePanel = () => setEditing(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    let features = [], process = [], pricing = [], faqs = [];
    try { features = JSON.parse(form.featuresJson || '[]'); } catch { showToast('Invalid JSON in Features', 'error'); setSaving(false); return; }
    try { process = JSON.parse(form.processJson || '[]'); } catch { showToast('Invalid JSON in Process', 'error'); setSaving(false); return; }
    try { pricing = JSON.parse(form.pricingJson || '[]'); } catch { showToast('Invalid JSON in Pricing', 'error'); setSaving(false); return; }
    try { faqs = JSON.parse(form.faqsJson || '[]'); } catch { showToast('Invalid JSON in FAQs', 'error'); setSaving(false); return; }

    const payload = {
      ...form,
      technologies: (form.technologies || '').split(',').map(s => s.trim()).filter(Boolean),
      benefits: (form.benefits || '').split('\n').map(s => s.trim()).filter(Boolean),
      deliverables: (form.deliverables || '').split('\n').map(s => s.trim()).filter(Boolean),
      features,
      process,
      pricing,
      faqs,
      seo: { title: form.seoTitle, description: form.seoDescription },
    };
    delete payload.featuresJson;
    delete payload.processJson;
    delete payload.pricingJson;
    delete payload.faqsJson;
    delete payload.seoTitle;
    delete payload.seoDescription;

    if (editing !== 'new') payload.id = editing.id;

    try {
      const res = await fetch('/api/admin/services', {
        method: editing === 'new' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) { showToast('Service saved ✓'); closePanel(); fetchServices(); }
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch('/api/admin/services', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) { showToast('Service deleted'); fetchServices(); }
    } catch (e) { console.error(e); }
  };

  const f = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  return (
    <AdminLayoutWrapper>
      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999, background: 'var(--hs-emerald)', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: 'var(--r-full)', fontWeight: 600, fontSize: 'var(--text-sm)', boxShadow: '0 4px 20px rgba(0,184,135,0.4)' }}>
          {toast}
        </div>
      )}

      <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
        <div className="admin-card-header">
          <div>
            <h2 className="admin-card-title">Services</h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--hs-text-400)', marginTop: '0.25rem' }}>
              Manage your agency service offerings and their public pages.
            </p>
          </div>
          {!editing && (
            <button onClick={openCreate} className="btn btn-primary btn-sm">+ Add Service</button>
          )}
        </div>

        {/* ── Loading ── */}
        {loading && (
          <div className="admin-empty">
            <div className="admin-empty-icon">⏳</div>
            <h3>Loading services...</h3>
          </div>
        )}

        {/* ── List View ── */}
        {!loading && !editing && (
          <>
            {services.length === 0 ? (
              <div className="admin-empty">
                <div className="admin-empty-icon" aria-hidden="true">✦</div>
                <h3>No services yet</h3>
                <p>Add your first service offering to display it on the public services page.</p>
                <button onClick={openCreate} className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
                  + Add Your First Service
                </button>
              </div>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Technologies</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...services].sort((a, b) => a.sortOrder - b.sortOrder).map(s => (
                      <tr key={s.id}>
                        <td style={{ color: 'var(--hs-text-400)', fontWeight: 600, width: 36 }}>{s.sortOrder}</td>
                        <td className="cell-primary">{s.name}</td>
                        <td>{s.category}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                            {(s.technologies || []).slice(0, 3).map(t => (
                              <span key={t} className="badge badge-light" style={{ fontSize: '0.6rem' }}>{t}</span>
                            ))}
                            {(s.technologies || []).length > 3 && (
                              <span style={{ fontSize: '0.65rem', color: 'var(--hs-text-400)' }}>+{s.technologies.length - 3}</span>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${s.published ? 'badge-emerald' : 'badge-light'}`}>
                            {s.published ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={() => openEdit(s)} className="btn btn-outline btn-sm">Edit</button>
                            <button onClick={() => handleDelete(s.id, s.name)} className="btn btn-sm" style={{ color: '#e53e3e', border: '1px solid #e53e3e33', borderRadius: 'var(--r-sm)', padding: '0.35rem 0.75rem', background: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 'var(--text-xs)' }}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* ── Create / Edit Form ── */}
        {editing && (
          <form onSubmit={handleSave}>
            <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--hs-border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem' }}>
                {editing === 'new' ? 'New Service' : `Editing: ${editing.name}`}
              </h3>
              <button type="button" onClick={closePanel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--hs-text-400)', fontSize: '1.2rem' }}>✕</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }} className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Service Name *</label>
                <input required className="form-input" value={form.name} onChange={e => f('name', e.target.value)} placeholder="e.g. Shopify Development" />
              </div>
              <div className="form-group">
                <label className="form-label">URL Slug *</label>
                <input required className="form-input" value={form.slug} onChange={e => f('slug', e.target.value)} placeholder="shopify-development" />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label className="form-label">Category</label>
              <select className="form-input" value={form.category} onChange={e => f('category', e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label className="form-label">Short Description (used on cards) *</label>
              <textarea required rows="2" className="form-input" value={form.shortDescription} onChange={e => f('shortDescription', e.target.value)} placeholder="Bespoke Shopify stores engineered for growth..." />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginTop: '1rem' }} className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Hero Title</label>
                <input className="form-input" value={form.heroTitle} onChange={e => f('heroTitle', e.target.value)} placeholder="Premium Shopify Development" />
              </div>
              <div className="form-group">
                <label className="form-label">Technologies (comma separated)</label>
                <input className="form-input" value={form.technologies} onChange={e => f('technologies', e.target.value)} placeholder="Shopify, Liquid, React, Node.js" />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label className="form-label">Hero Description</label>
              <textarea rows="3" className="form-input" value={form.heroDescription} onChange={e => f('heroDescription', e.target.value)} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem', marginTop: '1rem' }} className="form-grid-3">
              <div className="form-group">
                <label className="form-label">Service Icon (Emoji / Symbol)</label>
                <input className="form-input" value={form.icon} onChange={e => f('icon', e.target.value)} placeholder="💻" />
              </div>
              <div className="form-group">
                <label className="form-label">Parent Service (for sub-services)</label>
                <select className="form-input" value={form.parentService} onChange={e => f('parentService', e.target.value)}>
                  <option value="">None (Primary Root Service)</option>
                  {services.filter(s => s.id !== editing?.id).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Starting Price Text</label>
                <input className="form-input" value={form.startingPrice} onChange={e => f('startingPrice', e.target.value)} placeholder="Starting from PKR 25,000 / $250" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginTop: '1rem' }} className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Key Benefits (One per line)</label>
                <textarea rows="4" className="form-input" value={form.benefits} onChange={e => f('benefits', e.target.value)} placeholder="Tailored to your exact brand goals&#10;Built with modern Next.js" />
              </div>
              <div className="form-group">
                <label className="form-label">Deliverables (One per line)</label>
                <textarea rows="4" className="form-input" value={form.deliverables} onChange={e => f('deliverables', e.target.value)} placeholder="Complete Source Code&#10;Production Deployment" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginTop: '1rem' }} className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Pricing Packages (JSON format)</label>
                <textarea rows="5" className="form-input" value={form.pricingJson} onChange={e => f('pricingJson', e.target.value)} style={{ fontFamily: 'monospace', fontSize: '0.8rem' }} />
              </div>
              <div className="form-group">
                <label className="form-label">FAQs (JSON format)</label>
                <textarea rows="5" className="form-input" value={form.faqsJson} onChange={e => f('faqsJson', e.target.value)} style={{ fontFamily: 'monospace', fontSize: '0.8rem' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginTop: '1rem' }} className="form-grid-2">
              <div className="form-group">
                <label className="form-label">SEO Title</label>
                <input className="form-input" value={form.seoTitle} onChange={e => f('seoTitle', e.target.value)} placeholder="Custom Web Development | Heritage Studios" />
              </div>
              <div className="form-group">
                <label className="form-label">SEO Meta Description</label>
                <input className="form-input" value={form.seoDescription} onChange={e => f('seoDescription', e.target.value)} placeholder="Bespoke website engineering..." />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginTop: '1rem' }} className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-input" value={form.published ? 'yes' : 'no'} onChange={e => f('published', e.target.value === 'yes')}>
                  <option value="yes">Published (Public)</option>
                  <option value="no">Draft (Hidden)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Sort Order</label>
                <input type="number" className="form-input" value={form.sortOrder} onChange={e => f('sortOrder', Number(e.target.value))} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button type="submit" disabled={saving} className="btn btn-primary">
                {saving ? 'Saving...' : 'Save Service'}
              </button>
              <button type="button" onClick={closePanel} className="btn btn-outline">Cancel</button>
            </div>

            <style>{`
              @media (max-width: 640px) {
                .form-grid-2 { grid-template-columns: 1fr !important; }
              }
            `}</style>
          </form>
        )}
      </div>
    </AdminLayoutWrapper>
  );
}
