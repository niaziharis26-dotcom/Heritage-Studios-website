'use client';
import { useState, useEffect } from 'react';
import MediaSelector from '@/components/MediaSelector';
import AdminLayoutWrapper from '@/components/AdminLayoutWrapper';

const EMPTY_FORM = {
  name: '', slug: '', category: 'Web & E-commerce', image: '',
  description: '', technologies: '', result: '', client: '',
  featured: true, published: true, sortOrder: 1
};
const CATEGORIES = ['Web & E-commerce', 'Software & Technology', 'Creative', 'Marketing & Research'];

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [toast, setToast]       = useState('');

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/admin/projects');
      if (res.ok) { const d = await res.json(); setProjects(d.projects || []); }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };
  const openCreate = () => { setForm({ ...EMPTY_FORM, sortOrder: projects.length + 1 }); setEditing('new'); };
  const openEdit   = (p) => { setForm({ ...p, technologies: (p.technologies || []).join(', ') }); setEditing(p); };
  const close      = () => setEditing(null);
  const f          = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    const payload = { ...form, technologies: form.technologies.split(',').map(s => s.trim()).filter(Boolean) };
    if (editing !== 'new') payload.id = editing.id;
    try {
      const res = await fetch('/api/admin/projects', {
        method: editing === 'new' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) { showToast('Project saved ✓'); close(); fetchProjects(); }
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      const res = await fetch('/api/admin/projects', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
      if (res.ok) { showToast('Deleted'); fetchProjects(); }
    } catch (e) { console.error(e); }
  };

  return (
    <AdminLayoutWrapper>
      {toast && (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999, background: 'var(--hs-emerald)', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: 'var(--r-full)', fontWeight: 600, fontSize: 'var(--text-sm)', boxShadow: '0 4px 20px rgba(0,184,135,0.4)' }}>
          {toast}
        </div>
      )}

      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h2 className="admin-card-title">Portfolio Projects</h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--hs-text-400)', marginTop: '0.25rem' }}>
              Manage the projects shown on your public portfolio page.
            </p>
          </div>
          {!editing && <button onClick={openCreate} className="btn btn-primary btn-sm">+ Add Project</button>}
        </div>

        {loading && <div className="admin-empty"><div className="admin-empty-icon">⏳</div><h3>Loading...</h3></div>}

        {!loading && !editing && (
          projects.length === 0 ? (
            <div className="admin-empty">
              <div className="admin-empty-icon" aria-hidden="true">◎</div>
              <h3>No projects yet</h3>
              <p>Add your first portfolio project to display it publicly.</p>
              <button onClick={openCreate} className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>+ Add Project</button>
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr><th>#</th><th>Project</th><th>Client</th><th>Category</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {[...projects].sort((a, b) => a.sortOrder - b.sortOrder).map(p => (
                    <tr key={p.id}>
                      <td style={{ color: 'var(--hs-text-400)', fontWeight: 600, width: 36 }}>{p.sortOrder}</td>
                      <td>
                        <div className="cell-primary">{p.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--hs-text-400)', marginTop: '0.15rem' }}>{p.description?.slice(0, 60)}{p.description?.length > 60 ? '...' : ''}</div>
                      </td>
                      <td>{p.client || '—'}</td>
                      <td>{p.category}</td>
                      <td><span className={`badge ${p.published ? 'badge-emerald' : 'badge-light'}`}>{p.published ? 'Published' : 'Draft'}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => openEdit(p)} className="btn btn-outline btn-sm">Edit</button>
                          <button onClick={() => handleDelete(p.id, p.name)} className="btn btn-sm" style={{ color: '#e53e3e', border: '1px solid #e53e3e33', borderRadius: 'var(--r-sm)', padding: '0.35rem 0.75rem', background: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 'var(--text-xs)' }}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}

        {editing && (
          <form onSubmit={handleSave}>
            <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--hs-border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem' }}>
                {editing === 'new' ? 'New Project' : `Editing: ${editing.name}`}
              </h3>
              <button type="button" onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--hs-text-400)', fontSize: '1.2rem' }}>✕</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }} className="form-grid-2">
              <div className="form-group"><label className="form-label">Project Name *</label><input required className="form-input" value={form.name} onChange={e => f('name', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Client</label><input className="form-input" value={form.client} onChange={e => f('client', e.target.value)} /></div>
            </div>
            <div className="form-group" style={{ marginTop: '1rem' }}>
              <MediaSelector label="Project Image" value={form.image} onChange={val => f('image', val)} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginTop: '1rem' }} className="form-grid-2">
              <div className="form-group"><label className="form-label">Category</label>
                <select className="form-input" value={form.category} onChange={e => f('category', e.target.value)}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group"><label className="form-label">Technologies (comma separated)</label><input className="form-input" value={form.technologies} onChange={e => f('technologies', e.target.value)} placeholder="Next.js, Shopify, React" /></div>
            </div>
            <div className="form-group" style={{ marginTop: '1rem' }}><label className="form-label">Description *</label><textarea required rows="3" className="form-input" value={form.description} onChange={e => f('description', e.target.value)} /></div>
            <div className="form-group" style={{ marginTop: '1rem' }}><label className="form-label">Result / Outcome</label><input className="form-input" value={form.result} onChange={e => f('result', e.target.value)} placeholder="e.g. 40% increase in conversions" /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem', marginTop: '1rem' }} className="form-grid-3">
              <div className="form-group"><label className="form-label">Status</label>
                <select className="form-input" value={form.published ? 'yes' : 'no'} onChange={e => f('published', e.target.value === 'yes')}>
                  <option value="yes">Published</option><option value="no">Draft</option>
                </select>
              </div>
              <div className="form-group"><label className="form-label">Sort Order</label><input type="number" className="form-input" value={form.sortOrder} onChange={e => f('sortOrder', Number(e.target.value))} /></div>
              <div className="form-group"><label className="form-label">Featured</label>
                <select className="form-input" value={form.featured ? 'yes' : 'no'} onChange={e => f('featured', e.target.value === 'yes')}>
                  <option value="yes">Featured</option><option value="no">Standard</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button type="submit" disabled={saving} className="btn btn-primary">{saving ? 'Saving...' : 'Save Project'}</button>
              <button type="button" onClick={close} className="btn btn-outline">Cancel</button>
            </div>
            <style>{`@media(max-width:640px){.form-grid-2,.form-grid-3{grid-template-columns:1fr!important}}`}</style>
          </form>
        )}
      </div>
    </AdminLayoutWrapper>
  );
}
