'use client';
import { useState, useEffect } from 'react';
import AdminLayoutWrapper from '@/components/AdminLayoutWrapper';

const EMPTY_FORM = { name: '', company: '', position: '', rating: 5, review: '', published: true, sortOrder: 1 };

export default function AdminReviewsPage() {
  const [reviews, setReviews]   = useState([]);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [toast, setToast]       = useState('');

  useEffect(() => { fetchReviews(); }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/admin/reviews');
      if (res.ok) { const d = await res.json(); setReviews(d.reviews || []); }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };
  const openCreate = () => { setForm({ ...EMPTY_FORM, sortOrder: reviews.length + 1 }); setEditing('new'); };
  const openEdit   = (r) => { setForm({ ...r }); setEditing(r); };
  const close      = () => setEditing(null);
  const f          = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    const payload = { ...form };
    if (editing !== 'new') payload.id = editing.id;
    try {
      const res = await fetch('/api/admin/reviews', {
        method: editing === 'new' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) { showToast('Review saved ✓'); close(); fetchReviews(); }
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete review from "${name}"?`)) return;
    try {
      const res = await fetch('/api/admin/reviews', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
      if (res.ok) { showToast('Deleted'); fetchReviews(); }
    } catch (e) { console.error(e); }
  };

  const stars = (n) => '★'.repeat(n) + '☆'.repeat(5 - n);

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
            <h2 className="admin-card-title">Client Reviews</h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--hs-text-400)', marginTop: '0.25rem' }}>
              Manage testimonials shown on the public reviews page.
            </p>
          </div>
          {!editing && <button onClick={openCreate} className="btn btn-primary btn-sm">+ Add Review</button>}
        </div>

        {loading && <div className="admin-empty"><div className="admin-empty-icon">⏳</div><h3>Loading...</h3></div>}

        {!loading && !editing && (
          reviews.length === 0 ? (
            <div className="admin-empty">
              <div className="admin-empty-icon" aria-hidden="true">★</div>
              <h3>No reviews yet</h3>
              <p>Add your first client testimonial to display it publicly.</p>
              <button onClick={openCreate} className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>+ Add Review</button>
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr><th>Client</th><th>Company</th><th>Rating</th><th>Review</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {[...reviews].sort((a, b) => a.sortOrder - b.sortOrder).map(r => (
                    <tr key={r.id}>
                      <td>
                        <div className="cell-primary">{r.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--hs-text-400)' }}>{r.position}</div>
                      </td>
                      <td>{r.company || '—'}</td>
                      <td><span style={{ color: 'var(--hs-gold)', letterSpacing: 2 }}>{stars(r.rating || 5)}</span></td>
                      <td style={{ maxWidth: 260 }}>
                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--hs-text-400)' }}>
                          {r.review?.slice(0, 80)}{r.review?.length > 80 ? '...' : ''}
                        </span>
                      </td>
                      <td><span className={`badge ${r.published ? 'badge-emerald' : 'badge-light'}`}>{r.published ? 'Published' : 'Draft'}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => openEdit(r)} className="btn btn-outline btn-sm">Edit</button>
                          <button onClick={() => handleDelete(r.id, r.name)} className="btn btn-sm" style={{ color: '#e53e3e', border: '1px solid #e53e3e33', borderRadius: 'var(--r-sm)', padding: '0.35rem 0.75rem', background: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 'var(--text-xs)' }}>Delete</button>
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
                {editing === 'new' ? 'New Review' : `Editing: ${editing.name}`}
              </h3>
              <button type="button" onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--hs-text-400)', fontSize: '1.2rem' }}>✕</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }} className="form-grid-2">
              <div className="form-group"><label className="form-label">Client Name *</label><input required className="form-input" value={form.name} onChange={e => f('name', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Position / Title</label><input className="form-input" value={form.position} onChange={e => f('position', e.target.value)} placeholder="CEO, Founder..." /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem', marginTop: '1rem' }} className="form-grid-2">
              <div className="form-group"><label className="form-label">Company</label><input className="form-input" value={form.company} onChange={e => f('company', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Star Rating</label>
                <select className="form-input" value={form.rating} onChange={e => f('rating', Number(e.target.value))}>
                  {[5,4,3,2,1].map(n => <option key={n} value={n}>{stars(n)} ({n}/5)</option>)}
                </select>
              </div>
              <div className="form-group"><label className="form-label">Sort Order</label><input type="number" className="form-input" value={form.sortOrder} onChange={e => f('sortOrder', Number(e.target.value))} /></div>
            </div>
            <div className="form-group" style={{ marginTop: '1rem' }}><label className="form-label">Review Text *</label><textarea required rows="4" className="form-input" value={form.review} onChange={e => f('review', e.target.value)} placeholder="Write the client testimonial here..." /></div>
            <div className="form-group" style={{ marginTop: '1rem' }}><label className="form-label">Status</label>
              <select className="form-input" style={{ maxWidth: 200 }} value={form.published ? 'yes' : 'no'} onChange={e => f('published', e.target.value === 'yes')}>
                <option value="yes">Published</option><option value="no">Draft</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button type="submit" disabled={saving} className="btn btn-primary">{saving ? 'Saving...' : 'Save Review'}</button>
              <button type="button" onClick={close} className="btn btn-outline">Cancel</button>
            </div>
            <style>{`@media(max-width:640px){.form-grid-2{grid-template-columns:1fr!important}}`}</style>
          </form>
        )}
      </div>
    </AdminLayoutWrapper>
  );
}
