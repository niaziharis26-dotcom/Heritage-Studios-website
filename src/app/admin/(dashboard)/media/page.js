'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import AdminLayoutWrapper from '@/components/AdminLayoutWrapper';

export default function MediaLibraryPage() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All'); 
  const [selectedItem, setSelectedItem] = useState(null);
  const [editAlt, setEditAlt] = useState('');
  
  const fileInputRef = useRef(null);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/media');
      if (res.ok) {
        const data = await res.json();
        // The API returns either an array directly or { media: [...] }
        if (Array.isArray(data)) {
          setMedia(data);
        } else if (data.media) {
          setMedia(data.media);
        } else {
          setMedia([]);
        }
      } else {
        setMedia([]);
      }
    } catch (err) {
      console.error('Failed to fetch media', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleUpload = async (file) => {
    if (!file) return;
    try {
      setUploading(true);
      
      const fakeId = Math.random().toString(36).substring(7);
      const tempMedia = {
        id: fakeId,
        filename: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
        size: file.size,
        alt: '',
        uploadedAt: new Date().toISOString()
      };
      
      setMedia(prev => [tempMedia, ...prev]);

      const formData = new FormData();
      formData.append('file', file);
      
      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      });
      
      if (res.ok) fetchMedia(); 
    } catch (err) {
      console.error('Upload failed', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDelete = async (id) => {
    try {
      setMedia(prev => prev.filter(m => m.id !== id));
      setSelectedItem(null);
      await fetch(`/api/admin/media?id=${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      fetchMedia();
    } catch (err) {
      console.error('Delete failed', err);
      fetchMedia(); 
    }
  };

  const handleUpdateAlt = async () => {
    if (!selectedItem) return;
    try {
      setMedia(prev => prev.map(m => m.id === selectedItem.id ? { ...m, alt: editAlt } : m));
      await fetch('/api/admin/media', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedItem.id, alt: editAlt })
      });
    } catch (err) {
      console.error('Update failed', err);
    }
  };

  const filteredMedia = media.filter(item => {
    const filename = item.filename || item.name || '';
    const type = item.type || '';
    if (search && !filename.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter === 'Images' && !type.startsWith('image/')) return false;
    if (filter === 'Videos' && !type.startsWith('video/')) return false;
    if (filter === 'Documents' && !type.startsWith('application/')) return false;
    return true;
  });

  return (
    <AdminLayoutWrapper>
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', color: '#e5e7eb' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', color: '#fff', margin: 0 }}>Media Library</h1>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input 
              type="text" 
              placeholder="Search files..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                background: '#141a26', border: '1px solid rgba(255,255,255,0.06)', 
                color: '#fff', padding: '0.5rem 1rem', borderRadius: '8px'
              }}
            />
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              style={{
                background: '#059669', color: '#fff', border: 'none', 
                padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer',
                fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem'
              }}
            >
              {uploading ? 'Uploading...' : 'Upload File'}
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={(e) => handleUpload(e.target.files?.[0])}
            />
          </div>
        </div>

        <div 
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          style={{
            border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '12px',
            padding: '3rem', textAlign: 'center', marginBottom: '2rem',
            background: '#0e1420', cursor: 'pointer'
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📁</div>
          <h3 style={{ color: '#fff', margin: '0 0 0.5rem 0' }}>Drag & Drop files here</h3>
          <p style={{ color: '#9ca3af', margin: 0 }}>or click to browse</p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '1rem' }}>
          {['All', 'Images', 'Videos', 'Documents'].map(tab => (
            <button 
              key={tab}
              onClick={() => setFilter(tab)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem',
                color: filter === tab ? '#34d399' : '#9ca3af',
                fontWeight: filter === tab ? 600 : 400
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>Loading media...</div>
        ) : filteredMedia.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: '#0e1420', borderRadius: '12px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>🖼️</div>
            <p style={{ color: '#9ca3af' }}>No media found.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
            {filteredMedia.map(item => (
              <div 
                key={item.id}
                onClick={() => { setSelectedItem(item); setEditAlt(item.alt || ''); }}
                style={{
                  background: '#141a26', borderRadius: '8px', overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer',
                  transition: 'transform 0.2s',
                }}
              >
                <div style={{ height: '150px', background: '#0a0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {item.type?.startsWith('image/') ? (
                    <img src={item.url} alt={item.alt || item.filename || item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ fontSize: '3rem' }}>📄</div>
                  )}
                </div>
                <div style={{ padding: '0.75rem' }}>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.filename || item.name}
                  </p>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: '#9ca3af' }}>
                    {item.size ? `${(item.size / 1024).toFixed(1)} KB` : '0 KB'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedItem && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: '#0e1420', width: '90%', maxWidth: '800px', borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.1)', display: 'flex', overflow: 'hidden',
              maxHeight: '90vh'
            }}>
              <div style={{ flex: 1, background: '#0a0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                {selectedItem.type?.startsWith('image/') ? (
                  <img src={selectedItem.url} alt={selectedItem.alt} style={{ maxWidth: '100%', maxHeight: '60vh', objectFit: 'contain' }} />
                ) : (
                  <div style={{ fontSize: '5rem' }}>📄</div>
                )}
              </div>
              <div style={{ width: '300px', padding: '1.5rem', borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <h3 style={{ margin: 0, color: '#fff' }}>Details</h3>
                  <button onClick={() => setSelectedItem(null)} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '1.2rem' }}>&times;</button>
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>Filename</label>
                  <div style={{ fontSize: '0.9rem', wordBreak: 'break-all' }}>{selectedItem.filename || selectedItem.name}</div>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>Type & Size</label>
                  <div style={{ fontSize: '0.9rem' }}>{selectedItem.type} • {selectedItem.size ? `${(selectedItem.size / 1024).toFixed(1)} KB` : '0 KB'}</div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>Alt Text</label>
                  <input 
                    type="text" 
                    value={editAlt} 
                    onChange={(e) => setEditAlt(e.target.value)}
                    onBlur={handleUpdateAlt}
                    style={{ width: '100%', padding: '0.5rem', background: '#141a26', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '4px' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <button 
                    onClick={() => navigator.clipboard.writeText(window.location.origin + selectedItem.url)}
                    style={{ padding: '0.5rem', background: '#141a26', color: '#e5e7eb', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Copy URL
                  </button>
                  <button 
                    onClick={() => handleDelete(selectedItem.id)}
                    style={{ padding: '0.5rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Delete File
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayoutWrapper>
  );
}
