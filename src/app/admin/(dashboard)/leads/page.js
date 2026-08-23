'use client';
import { useState, useEffect } from 'react';
import AdminLayoutWrapper from '@/components/AdminLayoutWrapper';

const STATUS_OPTIONS = ['New', 'Contacted', 'In Discussion', 'Won', 'Lost'];
const STATUS_COLORS  = {
  New:           { bg: 'rgba(0,184,135,0.1)',   color: 'var(--hs-emerald)', border: 'var(--hs-emerald-a30)' },
  Contacted:     { bg: 'rgba(201,166,83,0.1)',  color: 'var(--hs-gold)',    border: 'rgba(201,166,83,0.3)' },
  'In Discussion':{ bg: 'rgba(99,102,241,0.1)', color: '#818cf8',           border: 'rgba(99,102,241,0.3)' },
  Won:           { bg: 'rgba(0,184,135,0.15)',  color: 'var(--hs-emerald)', border: 'var(--hs-emerald-a30)' },
  Lost:          { bg: 'rgba(239,68,68,0.1)',   color: '#f87171',           border: 'rgba(239,68,68,0.3)' },
};

export default function AdminLeadsPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [selected, setSelected]   = useState(null);
  const [filter, setFilter]       = useState('All');

  useEffect(() => { fetchLeads(); }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/admin/leads');
      if (res.ok) { const d = await res.json(); setInquiries(d.inquiries || []); }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
      if (res.ok) {
        setInquiries(prev => prev.map(i => i.id === id ? { ...i, status: newStatus } : i));
        if (selected?.id === id) setSelected(prev => ({ ...prev, status: newStatus }));
      }
    } catch (e) { console.error(e); }
  };

  const sorted = [...inquiries].sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
  const filtered = filter === 'All' ? sorted : sorted.filter(i => i.status === filter);

  const counts = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s] = inquiries.filter(i => i.status === s).length;
    return acc;
  }, {});

  return (
    <AdminLayoutWrapper>
      {/* Detail Drawer */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)' }} onClick={() => setSelected(null)}>
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 'min(520px, 100vw)', background: 'var(--hs-white)', padding: '2.5rem', overflowY: 'auto', boxShadow: '-8px 0 40px rgba(0,0,0,0.15)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700 }}>Inquiry Detail</h3>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: 'var(--hs-text-400)' }}>✕</button>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>{selected.name}</div>
              {selected.company && <div style={{ color: 'var(--hs-text-400)', fontWeight: 600 }}>{selected.company}</div>}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
              {[
                { label: 'Email', val: selected.email, href: `mailto:${selected.email}` },
                { label: 'Phone', val: selected.phone || '—' },
                { label: 'Service', val: selected.service },
                { label: 'Budget', val: selected.budget },
                { label: 'Submitted', val: new Date(selected.createdDate).toLocaleString() },
              ].map(({ label, val, href }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'var(--hs-off-white)', borderRadius: 'var(--r-md)', fontSize: 'var(--text-sm)' }}>
                  <span style={{ fontWeight: 700, color: 'var(--hs-text-400)' }}>{label}</span>
                  {href ? <a href={href} style={{ color: 'var(--hs-emerald)', fontWeight: 600 }}>{val}</a> : <span style={{ fontWeight: 600 }}>{val}</span>}
                </div>
              ))}
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', marginBottom: '0.75rem', color: 'var(--hs-text-400)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Message</div>
              <div style={{ padding: '1.25rem', background: 'var(--hs-off-white)', borderRadius: 'var(--r-md)', whiteSpace: 'pre-wrap', fontSize: 'var(--text-sm)', lineHeight: 1.75, borderLeft: '3px solid var(--hs-emerald)' }}>
                {selected.message}
              </div>
            </div>

            <div>
              <label className="form-label">Update Status</label>
              <select className="form-input" value={selected.status} onChange={e => handleStatusChange(selected.id, e.target.value)} style={{ marginTop: '0.5rem' }}>
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h2 className="admin-card-title">Leads & Inquiries</h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--hs-text-400)', marginTop: '0.25rem' }}>
              {inquiries.length} total submissions · {counts['New'] || 0} new
            </p>
          </div>
        </div>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px,1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {[{ label: 'All', count: inquiries.length }, ...STATUS_OPTIONS.map(s => ({ label: s, count: counts[s] || 0 }))].map(({ label, count }) => {
            const c = label !== 'All' ? STATUS_COLORS[label] : null;
            return (
              <button key={label} onClick={() => setFilter(label)} style={{
                padding: '0.75rem', border: `1px solid ${filter === label ? 'var(--hs-emerald)' : 'var(--hs-border-light)'}`,
                borderRadius: 'var(--r-md)', background: filter === label ? 'var(--hs-emerald-a08)' : 'var(--hs-white)',
                cursor: 'pointer', textAlign: 'center'
              }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: filter === label ? 'var(--hs-emerald)' : 'var(--hs-text-900)' }}>{count}</div>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--hs-text-400)', marginTop: '0.2rem' }}>{label}</div>
              </button>
            );
          })}
        </div>

        {loading && <div className="admin-empty"><div className="admin-empty-icon">⏳</div><h3>Loading...</h3></div>}

        {!loading && filtered.length === 0 && (
          <div className="admin-empty">
            <div className="admin-empty-icon" aria-hidden="true">✉</div>
            <h3>No {filter !== 'All' ? filter.toLowerCase() : ''} leads yet</h3>
            <p>Inquiries submitted through the public contact form will appear here.</p>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>Submitted</th><th>Client</th><th>Service</th><th>Budget</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map(lead => {
                  const sc = STATUS_COLORS[lead.status] || {};
                  return (
                    <tr key={lead.id} style={{ cursor: 'pointer' }}>
                      <td style={{ fontSize: '0.75rem', color: 'var(--hs-text-400)', whiteSpace: 'nowrap' }}>
                        {new Date(lead.createdDate).toLocaleDateString()}
                      </td>
                      <td>
                        <div className="cell-primary">{lead.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--hs-text-400)' }}>{lead.email}</div>
                      </td>
                      <td>{lead.service}</td>
                      <td>{lead.budget}</td>
                      <td>
                        <select
                          value={lead.status}
                          onChange={e => { e.stopPropagation(); handleStatusChange(lead.id, e.target.value); }}
                          onClick={e => e.stopPropagation()}
                          style={{ background: sc.bg || 'var(--hs-off-white)', color: sc.color || 'var(--hs-text-600)', border: `1px solid ${sc.border || 'var(--hs-border-light)'}`, borderRadius: 'var(--r-sm)', padding: '0.3rem 0.6rem', fontWeight: 700, fontSize: '0.7rem', cursor: 'pointer' }}
                        >
                          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td>
                        <button onClick={() => setSelected(lead)} className="btn btn-outline btn-sm">View</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayoutWrapper>
  );
}
