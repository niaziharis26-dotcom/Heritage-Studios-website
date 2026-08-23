'use client';
import { useState, useEffect } from 'react';
import AdminLayoutWrapper from '@/components/AdminLayoutWrapper';

const STATUS_OPTIONS = ['Active', 'Prospect', 'Completed', 'On Hold', 'Inactive'];
const inputStyle = { background: '#1c2333', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '0.65rem 0.85rem', color: '#fff', fontSize: '0.88rem', fontFamily: 'Plus Jakarta Sans, sans-serif', outline: 'none', width: '100%' };
const STATUS_COLORS = { Active: '#10b981', Prospect: '#f59e0b', Completed: '#6366f1', 'On Hold': '#f97316', Inactive: '#6b7280' };

function toast(msg, type = 'success') {
  const t = document.createElement('div');
  t.textContent = msg;
  Object.assign(t.style, { position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 99999, padding: '0.85rem 1.5rem', borderRadius: '12px', fontWeight: 600, fontSize: '0.9rem', color: '#fff', background: type === 'success' ? '#059669' : '#dc2626', boxShadow: '0 8px 30px rgba(0,0,0,0.3)' });
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

const EMPTY = { name: '', company: '', email: '', phone: '', project: '', status: 'Active', budget: '', deadline: '', notes: '' };

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const load = () => {
    setLoading(true);
    fetch('/api/admin/clients').then(r => r.json()).then(data => { setClients(Array.isArray(data) ? data : []); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const action = editing ? 'update' : 'create';
    const payload = editing ? { ...form, id: editing } : form;
    const r = await fetch('/api/admin/clients', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, client: payload }) });
    if (r.ok) {
      toast(editing ? 'Client updated!' : 'Client added!');
      setForm(EMPTY); setEditing(null); setShowForm(false); load();
    } else toast('Failed to save', 'error');
  };

  const handleEdit = (c) => {
    setForm({ name: c.name || '', company: c.company || '', email: c.email || '', phone: c.phone || '', project: c.project || '', status: c.status || 'Active', budget: c.budget || '', deadline: c.deadline || '', notes: c.notes || '' });
    setEditing(c.id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this client?')) return;
    await fetch('/api/admin/clients', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'delete', client: { id } }) });
    toast('Client deleted'); load();
  };

  const filtered = clients.filter(c => {
    const q = search.toLowerCase();
    const matchQ = !q || (c.name || '').toLowerCase().includes(q) || (c.company || '').toLowerCase().includes(q) || (c.email || '').toLowerCase().includes(q);
    const matchS = !filterStatus || c.status === filterStatus;
    return matchQ && matchS;
  });

  return (
    <AdminLayoutWrapper>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: 0 }}>Clients</h1>
          <p style={{ color: '#6b7280', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>{clients.length} clients total</p>
        </div>
        <button onClick={() => { setForm(EMPTY); setEditing(null); setShowForm(true); }} style={{ background: 'linear-gradient(135deg,#059669,#047857)', border: 'none', borderRadius: 10, color: '#fff', padding: '0.75rem 1.5rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
          + Add Client
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clients..." style={{ ...inputStyle, maxWidth: 280 }} />
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ ...inputStyle, maxWidth: 180 }}>
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#0e1420', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', padding: '2rem', width: '100%', maxWidth: 580, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ color: '#fff', fontWeight: 800, margin: 0 }}>{editing ? 'Edit Client' : 'Add Client'}</h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {[['name','Name *','text',true],['company','Company','text',false],['email','Email','email',false],['phone','Phone','text',false],['project','Current Project','text',false],['budget','Budget','text',false]].map(([k,l,t,req]) => (
                  <div key={k}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', marginBottom: '0.4rem' }}>{l}</label>
                    <input type={t} value={form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} required={req} style={inputStyle} />
                  </div>
                ))}
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Status</label>
                  <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} style={{ ...inputStyle }}>
                    {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Deadline</label>
                  <input type="date" value={form.deadline} onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))} style={inputStyle} />
                </div>
              </div>
              <div style={{ marginTop: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Notes</label>
                <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="submit" style={{ flex: 1, background: 'linear-gradient(135deg,#059669,#047857)', border: 'none', borderRadius: 10, color: '#fff', padding: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
                  {editing ? 'Update Client' : 'Add Client'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#9ca3af', padding: '0.75rem 1.5rem', cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <p style={{ color: '#6b7280', textAlign: 'center', padding: '3rem' }}>Loading clients...</p>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#4b5563' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
          <p style={{ fontSize: '1rem', fontWeight: 600 }}>No clients yet</p>
          <p style={{ fontSize: '0.85rem' }}>Click "Add Client" to get started.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Client', 'Company', 'Email', 'Project', 'Budget', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '1rem', color: '#e5e7eb', fontWeight: 600 }}>{c.name}</td>
                  <td style={{ padding: '1rem', color: '#9ca3af' }}>{c.company || '—'}</td>
                  <td style={{ padding: '1rem', color: '#9ca3af', fontSize: '0.85rem' }}>{c.email || '—'}</td>
                  <td style={{ padding: '1rem', color: '#9ca3af', fontSize: '0.85rem', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.project || '—'}</td>
                  <td style={{ padding: '1rem', color: '#9ca3af' }}>{c.budget || '—'}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ background: `${STATUS_COLORS[c.status] || '#6b7280'}22`, color: STATUS_COLORS[c.status] || '#6b7280', border: `1px solid ${STATUS_COLORS[c.status] || '#6b7280'}44`, borderRadius: 20, padding: '0.25rem 0.75rem', fontSize: '0.78rem', fontWeight: 700 }}>
                      {c.status || 'Active'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleEdit(c)} style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 8, color: '#818cf8', cursor: 'pointer', padding: '0.4rem 0.75rem', fontSize: '0.8rem', fontWeight: 600 }}>Edit</button>
                      <button onClick={() => handleDelete(c.id)} style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: 8, color: '#f87171', cursor: 'pointer', padding: '0.4rem 0.75rem', fontSize: '0.8rem', fontWeight: 600 }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayoutWrapper>
  );
}
