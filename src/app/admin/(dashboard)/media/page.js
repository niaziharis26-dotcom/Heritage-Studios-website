'use client';

import { useState, useEffect, useRef } from 'react';
import AdminLayoutWrapper from '@/components/AdminLayoutWrapper';

export default function MediaLibraryPage() {
  const [media, setMedia]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [uploading, setUploading]   = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [search, setSearch]         = useState('');
  const [filter, setFilter]         = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);
  const [editAlt, setEditAlt]       = useState('');
  const [toast, setToast]           = useState('');
  const [dragOver, setDragOver]     = useState(false);
  const fileInputRef = useRef(null);

  const [syncing, setSyncing]       = useState(false);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(''), 3500);
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch('/api/admin/sync-media');
      const data = await res.json();
      if (data.success) {
        showToast(`Synced! ${data.added} new file${data.added !== 1 ? 's' : ''} added (${data.total} total)`);
        await fetchMedia();
      } else {
        showToast('Sync failed', 'error');
      }
    } catch (err) {
      showToast('Sync error: ' + err.message, 'error');
    }
    setSyncing(false);
  };

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/media');
      if (res.ok) {
        const data = await res.json();
        setMedia(Array.isArray(data) ? data : (data.media || []));
      } else if (res.status === 401) {
        showToast('Session expired — please log in again', 'error');
        setMedia([]);
      } else {
        setMedia([]);
      }
    } catch (err) {
      console.error('Failed to fetch media', err);
      showToast('Failed to load media library', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMedia(); }, []);

  const handleUpload = async (files) => {
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files);

    setUploading(true);
    let successCount = 0;

    for (const file of fileArray) {
      setUploadProgress(`Uploading ${file.name}...`);
      try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/admin/media', {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          successCount++;
        } else {
          const err = await res.json().catch(() => ({}));
          showToast(`Failed to upload ${file.name}: ${err.error || res.status}`, 'error');
        }
      } catch (err) {
        showToast(`Upload error: ${err.message}`, 'error');
      }
    }

    setUploading(false);
    setUploadProgress('');

    // Reset input so same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = '';

    if (successCount > 0) {
      showToast(`${successCount} file${successCount > 1 ? 's' : ''} uploaded successfully!`);
      await fetchMedia();
    }
  };

  const handleFileInput = (e) => {
    handleUpload(e.target.files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleUpload(e.dataTransfer.files);
  };

  const handleDelete = async (item) => {
    if (!confirm(`Delete "${item.filename || item.originalName}"? This cannot be undone.`)) return;
    try {
      // Optimistic removal
      setMedia(prev => prev.filter(m => m.id !== item.id));
      setSelectedItem(null);

      const res = await fetch('/api/admin/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id }),
      });

      if (res.ok) {
        showToast('File deleted');
      } else {
        showToast('Delete failed — refreshing', 'error');
        fetchMedia();
      }
    } catch (err) {
      showToast('Delete error: ' + err.message, 'error');
      fetchMedia();
    }
  };

  const handleUpdateAlt = async () => {
    if (!selectedItem) return;
    try {
      setMedia(prev => prev.map(m => m.id === selectedItem.id ? { ...m, alt: editAlt } : m));
      const res = await fetch('/api/admin/media', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedItem.id, alt: editAlt }),
      });
      if (res.ok) showToast('Alt text saved');
    } catch (err) {
      showToast('Failed to save alt text', 'error');
    }
  };

  const handleCopyUrl = (item) => {
    const url = item.url.startsWith('http') ? item.url : window.location.origin + item.url;
    navigator.clipboard.writeText(url).then(() => showToast('URL copied to clipboard!'));
  };

  const filteredMedia = media.filter(item => {
    const filename = (item.filename || item.name || '').toLowerCase();
    const type = item.type || '';
    if (search && !filename.includes(search.toLowerCase())) return false;
    if (filter === 'Images' && !type.startsWith('image/')) return false;
    if (filter === 'Videos' && !type.startsWith('video/')) return false;
    if (filter === 'Documents' && !type.startsWith('application/')) return false;
    return true;
  });

  const formatSize = (bytes) => {
    if (!bytes) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <AdminLayoutWrapper>
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', color: '#e5e7eb' }}>

        {/* Toast */}
        {toast && (
          <div style={{
            position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 9999,
            background: toast.type === 'error' ? '#ef4444' : '#059669',
            color: '#fff', padding: '0.75rem 1.25rem', borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)', fontWeight: 600, fontSize: '0.9rem',
            transition: 'opacity 0.3s'
          }}>
            {toast.msg}
          </div>
        )}

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', color: '#fff', margin: 0 }}>Media Library</h1>
            <p style={{ margin: '0.25rem 0 0', color: '#9ca3af', fontSize: '0.875rem' }}>
              {media.length} file{media.length !== 1 ? 's' : ''} stored
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search files..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                background: '#141a26', border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff', padding: '0.5rem 1rem', borderRadius: '8px',
                outline: 'none', width: '200px',
              }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              style={{
                background: uploading ? '#064e3b' : '#059669', color: '#fff', border: 'none',
                padding: '0.6rem 1.25rem', borderRadius: '8px', cursor: uploading ? 'default' : 'pointer',
                fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap',
              }}
            >
              {uploading ? (uploadProgress || 'Uploading...') : '+ Upload Files'}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              multiple
              accept="image/*,video/*,.pdf,.svg"
              onChange={handleFileInput}
            />
            <button
              onClick={handleSync}
              disabled={syncing}
              title="Import all icons/images from public folders into the library"
              style={{
                background: syncing ? '#1e3a5f' : '#1e3a8a', color: '#93c5fd',
                border: '1px solid rgba(96,165,250,0.3)',
                padding: '0.6rem 1rem', borderRadius: '8px', cursor: syncing ? 'default' : 'pointer',
                fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap',
              }}
            >
              {syncing ? 'Syncing...' : '↻ Sync Assets'}
            </button>
          </div>
        </div>

        {/* Drag & Drop Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${dragOver ? '#34d399' : 'rgba(255,255,255,0.12)'}`,
            borderRadius: '12px', padding: '2.5rem', textAlign: 'center',
            marginBottom: '1.5rem', background: dragOver ? 'rgba(52,211,153,0.05)' : '#0e1420',
            cursor: 'pointer', transition: 'all 0.2s',
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📁</div>
          <h3 style={{ color: '#fff', margin: '0 0 0.25rem 0', fontSize: '1rem' }}>
            {dragOver ? 'Drop files here' : 'Drag & Drop files here'}
          </h3>
          <p style={{ color: '#9ca3af', margin: 0, fontSize: '0.85rem' }}>
            or click to browse · supports images, SVG, PDF, video
          </p>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.75rem' }}>
          {['All', 'Images', 'Videos', 'Documents'].map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              style={{
                background: filter === tab ? 'rgba(52,211,153,0.15)' : 'none',
                border: filter === tab ? '1px solid rgba(52,211,153,0.3)' : '1px solid transparent',
                cursor: 'pointer', fontSize: '0.875rem', borderRadius: '6px',
                color: filter === tab ? '#34d399' : '#9ca3af',
                fontWeight: filter === tab ? 600 : 400,
                padding: '0.35rem 0.85rem',
                transition: 'all 0.15s',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#9ca3af' }}>Loading media...</div>
        ) : filteredMedia.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', background: '#0e1420', borderRadius: '12px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.4 }}>🖼️</div>
            <p style={{ color: '#9ca3af', margin: 0 }}>
              {search ? `No files matching "${search}"` : 'No media yet — upload your first file above'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
            {filteredMedia.map(item => (
              <div
                key={item.id}
                onClick={() => { setSelectedItem(item); setEditAlt(item.alt || ''); }}
                style={{
                  background: '#141a26', borderRadius: '10px', overflow: 'hidden',
                  border: selectedItem?.id === item.id ? '2px solid #34d399' : '1px solid rgba(255,255,255,0.06)',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#34d399'}
                onMouseLeave={e => e.currentTarget.style.borderColor = selectedItem?.id === item.id ? '#34d399' : 'rgba(255,255,255,0.06)'}
              >
                <div style={{ height: '140px', background: '#0a0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {item.type?.startsWith('image/') || item.url?.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) ? (
                    <img
                      src={item.url}
                      alt={item.alt || item.filename}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                    />
                  ) : null}
                  <div style={{ display: 'none', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>📄</div>
                </div>
                <div style={{ padding: '0.6rem 0.75rem' }}>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#e5e7eb', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.filename || item.name}
                  </p>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.72rem', color: '#6b7280' }}>
                    {formatSize(item.size)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Detail Panel */}
        {selectedItem && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', zIndex: 1000, padding: '1rem',
          }}
            onClick={(e) => { if (e.target === e.currentTarget) setSelectedItem(null); }}
          >
            <div style={{
              background: '#0e1420', width: '90%', maxWidth: '820px', borderRadius: '14px',
              border: '1px solid rgba(255,255,255,0.1)', display: 'flex',
              overflow: 'hidden', maxHeight: '90vh', flexDirection: 'row',
            }}>
              {/* Preview */}
              <div style={{ flex: 1, background: '#0a0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', minHeight: '300px' }}>
                {selectedItem.type?.startsWith('image/') || selectedItem.url?.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) ? (
                  <img
                    src={selectedItem.url}
                    alt={selectedItem.alt || selectedItem.filename}
                    style={{ maxWidth: '100%', maxHeight: '55vh', objectFit: 'contain', borderRadius: '4px' }}
                  />
                ) : (
                  <div style={{ fontSize: '5rem', textAlign: 'center' }}>
                    📄<br />
                    <span style={{ fontSize: '1rem', color: '#9ca3af' }}>{selectedItem.type}</span>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div style={{ width: '300px', padding: '1.5rem', borderLeft: '1px solid rgba(255,255,255,0.06)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, color: '#fff', fontSize: '1rem' }}>File Details</h3>
                  <button
                    onClick={() => setSelectedItem(null)}
                    style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '1.4rem', lineHeight: 1 }}
                  >
                    &times;
                  </button>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: '#6b7280', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Filename</div>
                  <div style={{ fontSize: '0.85rem', color: '#e5e7eb', wordBreak: 'break-all' }}>{selectedItem.filename || selectedItem.name}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: '#6b7280', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</div>
                  <div style={{ fontSize: '0.85rem', color: '#e5e7eb' }}>{selectedItem.type || 'unknown'}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: '#6b7280', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Size</div>
                  <div style={{ fontSize: '0.85rem', color: '#e5e7eb' }}>{formatSize(selectedItem.size)}</div>
                </div>

                {selectedItem.uploadedAt && (
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#6b7280', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Uploaded</div>
                    <div style={{ fontSize: '0.85rem', color: '#e5e7eb' }}>{new Date(selectedItem.uploadedAt).toLocaleString()}</div>
                  </div>
                )}

                <div>
                  <div style={{ fontSize: '0.72rem', color: '#6b7280', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>URL</div>
                  <div style={{
                    fontSize: '0.78rem', color: '#9ca3af', wordBreak: 'break-all',
                    background: '#141a26', padding: '0.4rem 0.6rem', borderRadius: '4px',
                    border: '1px solid rgba(255,255,255,0.06)'
                  }}>
                    {selectedItem.url}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: '#6b7280', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Alt Text (SEO)</div>
                  <input
                    type="text"
                    value={editAlt}
                    onChange={(e) => setEditAlt(e.target.value)}
                    onBlur={handleUpdateAlt}
                    placeholder="Describe this image..."
                    style={{
                      width: '100%', padding: '0.5rem 0.6rem', background: '#141a26',
                      border: '1px solid rgba(255,255,255,0.1)', color: '#fff',
                      borderRadius: '4px', fontSize: '0.85rem', boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: 'auto' }}>
                  <button
                    onClick={() => handleCopyUrl(selectedItem)}
                    style={{
                      padding: '0.55rem', background: '#1f2937', color: '#e5e7eb',
                      border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px',
                      cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500,
                    }}
                  >
                    📋 Copy URL
                  </button>
                  <button
                    onClick={() => handleDelete(selectedItem)}
                    style={{
                      padding: '0.55rem', background: '#7f1d1d', color: '#fca5a5',
                      border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px',
                      cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500,
                    }}
                  >
                    🗑 Delete File
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
