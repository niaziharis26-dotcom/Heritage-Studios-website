'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayoutWrapper from '@/components/AdminLayoutWrapper';

const FALLBACK_PAGES = [
  { id: 'home', title: 'Home', slug: '/', status: 'published', seo: { title: '', description: '', robots: 'index,follow' } },
  { id: 'about', title: 'About', slug: '/about', status: 'published', seo: { title: '', description: '', robots: 'index,follow' } },
  { id: 'services', title: 'Services', slug: '/services', status: 'published', seo: { title: '', description: '', robots: 'index,follow' } },
  { id: 'projects', title: 'Projects', slug: '/projects', status: 'published', seo: { title: '', description: '', robots: 'index,follow' } },
  { id: 'reviews', title: 'Reviews', slug: '/reviews', status: 'published', seo: { title: '', description: '', robots: 'index,follow' } },
  { id: 'contact', title: 'Contact', slug: '/contact', status: 'published', seo: { title: '', description: '', robots: 'index,follow' } },
  { id: 'social-media', title: 'Social Media', slug: '/social-media', status: 'published', seo: { title: '', description: '', robots: 'index,follow' } },
];

export default function PagesManager() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSeo, setActiveSeo] = useState(null);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const res = await fetch('/api/admin/pages');
      if (res.ok) {
        const data = await res.json();
        // Check if data is array or object containing pages array
        if (Array.isArray(data)) {
          setPages(data);
        } else if (data.pages) {
          setPages(data.pages);
        } else {
          setPages(FALLBACK_PAGES);
        }
      } else {
        setPages(FALLBACK_PAGES);
      }
    } catch (err) {
      setPages(FALLBACK_PAGES);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (pageId, currentStatus) => {
    const newStatus = currentStatus === 'published' ? 'hidden' : 'published';
    setPages(prev => prev.map(p => p.id === pageId ? { ...p, status: newStatus } : p));
    try {
      await fetch('/api/admin/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'updateStatus', pageId, status: newStatus })
      });
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleDuplicate = async (page) => {
    const newPage = { ...page, id: page.id + '-copy', title: page.title + ' (Copy)', slug: page.slug + '-copy', status: 'hidden' };
    setPages(prev => [...prev, newPage]);
    try {
      await fetch('/api/admin/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'duplicate', pageId: page.id })
      });
      fetchPages();
    } catch (err) {
      console.error('Failed to duplicate', err);
    }
  };

  const saveSeo = async (e) => {
    e.preventDefault();
    if (!activeSeo) return;
    
    setPages(prev => prev.map(p => p.id === activeSeo.id ? { ...p, seo: activeSeo.seo } : p));
    
    try {
      await fetch('/api/admin/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'updateSeo', pageId: activeSeo.id, seo: activeSeo.seo })
      });
    } catch (err) {
      console.error('Failed to update SEO', err);
    } finally {
      setActiveSeo(null);
    }
  };

  return (
    <AdminLayoutWrapper>
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', color: '#e5e7eb' }}>
        <h1 style={{ fontSize: '2rem', color: '#fff', marginBottom: '2rem' }}>Pages</h1>
        
        <div style={{ background: '#0e1420', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#141a26', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <th style={{ padding: '1rem', color: '#9ca3af', fontWeight: 500 }}>Page</th>
                <th style={{ padding: '1rem', color: '#9ca3af', fontWeight: 500 }}>Slug</th>
                <th style={{ padding: '1rem', color: '#9ca3af', fontWeight: 500 }}>Status</th>
                <th style={{ padding: '1rem', color: '#9ca3af', fontWeight: 500, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center' }}>Loading...</td></tr>
              ) : pages.map(page => (
                <tr key={page.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '1.25rem' }}>📄</span>
                      <strong style={{ color: '#fff' }}>{page.title}</strong>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', color: '#9ca3af' }}>{page.slug}</td>
                  <td style={{ padding: '1rem' }}>
                    <button 
                      onClick={() => handleStatusToggle(page.id, page.status)}
                      style={{
                        padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600, border: 'none', cursor: 'pointer',
                        background: page.status === 'published' ? 'rgba(5, 150, 105, 0.2)' : 'rgba(255,255,255,0.1)',
                        color: page.status === 'published' ? '#34d399' : '#9ca3af'
                      }}
                    >
                      {page.status === 'published' ? 'Published' : 'Hidden'}
                    </button>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <Link 
                      href={`/admin/visual-editor?page=${page.id}`}
                      style={{ padding: '0.4rem 0.75rem', background: '#059669', color: '#fff', textDecoration: 'none', borderRadius: '6px', fontSize: '0.85rem' }}
                    >
                      Open in Editor
                    </Link>
                    <button 
                      onClick={() => setActiveSeo({ id: page.id, seo: page.seo || { title: '', description: '', robots: 'index,follow' } })}
                      style={{ padding: '0.4rem 0.75rem', background: '#141a26', border: '1px solid rgba(255,255,255,0.1)', color: '#e5e7eb', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
                    >
                      SEO
                    </button>
                    <button 
                      onClick={() => handleDuplicate(page)}
                      style={{ padding: '0.4rem 0.75rem', background: '#141a26', border: '1px solid rgba(255,255,255,0.1)', color: '#e5e7eb', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
                    >
                      Duplicate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {activeSeo && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: '#0e1420', width: '90%', maxWidth: '500px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', padding: '2rem' }}>
              <h3 style={{ margin: '0 0 1.5rem 0', color: '#fff' }}>SEO Settings</h3>
              <form onSubmit={saveSeo}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#9ca3af', fontSize: '0.85rem' }}>Page Title</label>
                  <input 
                    type="text" 
                    value={activeSeo.seo.title || ''} 
                    onChange={e => setActiveSeo(prev => ({ ...prev, seo: { ...prev.seo, title: e.target.value } }))}
                    style={{ width: '100%', padding: '0.75rem', background: '#141a26', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '6px' }}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#9ca3af', fontSize: '0.85rem' }}>Meta Description</label>
                  <textarea 
                    value={activeSeo.seo.description || ''} 
                    onChange={e => setActiveSeo(prev => ({ ...prev, seo: { ...prev.seo, description: e.target.value } }))}
                    style={{ width: '100%', padding: '0.75rem', background: '#141a26', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '6px', minHeight: '100px' }}
                  />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#9ca3af', fontSize: '0.85rem' }}>Robots</label>
                  <select 
                    value={activeSeo.seo.robots || 'index,follow'} 
                    onChange={e => setActiveSeo(prev => ({ ...prev, seo: { ...prev.seo, robots: e.target.value } }))}
                    style={{ width: '100%', padding: '0.75rem', background: '#141a26', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '6px' }}
                  >
                    <option value="index,follow">Index, Follow</option>
                    <option value="noindex,nofollow">No Index, No Follow</option>
                    <option value="noindex,follow">No Index, Follow</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={() => setActiveSeo(null)} style={{ padding: '0.75rem 1.5rem', background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" style={{ padding: '0.75rem 1.5rem', background: '#059669', border: 'none', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Save Settings</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayoutWrapper>
  );
}
