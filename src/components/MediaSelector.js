'use client';

import { useState, useEffect, useRef } from 'react';

export default function MediaSelector({ value, onChange, label = 'Select Image' }) {
  const [isOpen, setIsOpen]       = useState(false);
  const [media, setMedia]         = useState([]);
  const [loading, setLoading]     = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch]       = useState('');
  const [toast, setToast]         = useState('');
  const fileInputRef = useRef(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(''), 3000);
  };

  useEffect(() => {
    if (isOpen) fetchMedia();
  }, [isOpen]);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/media');
      if (res.ok) {
        const data = await res.json();
        setMedia(Array.isArray(data) ? data : (data.media || []));
      } else {
        showToast('Could not load media library', 'error');
      }
    } catch (err) {
      showToast('Network error loading media', 'error');
    }
    setLoading(false);
  };

  const handleUpload = async (files) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    let successCount = 0;
    for (const file of Array.from(files)) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/admin/media', { method: 'POST', body: formData });
        if (res.ok) successCount++;
        else {
          const e = await res.json().catch(() => ({}));
          showToast(`Failed: ${e.error || res.status}`, 'error');
        }
      } catch (err) {
        showToast(`Upload error: ${err.message}`, 'error');
      }
    }
    // reset input so same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = '';
    setUploading(false);
    if (successCount > 0) {
      showToast(`${successCount} file${successCount > 1 ? 's' : ''} uploaded!`);
      await fetchMedia();
    }
  };

  const filtered = media.filter(m => {
    const name = (m.filename || m.name || '').toLowerCase();
    return !search || name.includes(search.toLowerCase());
  });

  const isImage = (item) =>
    (item.type && item.type.startsWith('image/')) ||
    (item.url && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(item.url));

  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', fontSize: '0.82rem', color: '#9ca3af', marginBottom: '0.5rem', fontWeight: 500 }}>
        {label}
      </label>

      {/* Current preview + controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        {/* Preview */}
        {value && (
          <div style={{ position: 'relative', width: '72px', height: '72px', borderRadius: '8px', overflow: 'hidden', background: '#0a0f1a', border: '1px solid rgba(255,255,255,0.12)', flexShrink: 0 }}>
            {value.startsWith('/') || value.startsWith('http') ? (
              <img src={value} alt="icon" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                {value}
              </div>
            )}
            <button
              type="button"
              onClick={() => onChange('')}
              title="Remove"
              style={{
                position: 'absolute', top: 2, right: 2, width: '18px', height: '18px',
                background: 'rgba(0,0,0,0.7)', color: '#fff', border: 'none',
                borderRadius: '50%', cursor: 'pointer', fontSize: '11px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1,
              }}
            >
              &times;
            </button>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              style={{
                padding: '0.4rem 0.75rem', background: '#1f2937',
                border: '1px solid rgba(255,255,255,0.15)', color: '#e5e7eb',
                borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', whiteSpace: 'nowrap',
              }}
            >
              📂 Select from Library
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                padding: '0.4rem 0.75rem', background: '#064e3b',
                border: '1px solid rgba(52,211,153,0.3)', color: '#34d399',
                borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', whiteSpace: 'nowrap',
              }}
            >
              ↑ Upload
            </button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              multiple
              accept="image/*,.svg"
              onChange={(e) => handleUpload(e.target.files)}
            />
          </div>
          <input
            className="form-input"
            value={value || ''}
            onChange={e => onChange(e.target.value)}
            placeholder="Or paste URL / type emoji"
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}
          />
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 9999, background: 'rgba(0,0,0,0.82)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}
        >
          <div style={{
            background: '#0e1420', width: '90%', maxWidth: '860px', height: '80vh',
            borderRadius: '14px', border: '1px solid rgba(255,255,255,0.12)',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
          }}>
            {/* Modal header */}
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <h3 style={{ margin: 0, color: '#fff', fontSize: '1rem' }}>Media Library</h3>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ background: '#141a26', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.4rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem', outline: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  style={{
                    padding: '0.45rem 1rem', background: uploading ? '#064e3b' : '#059669',
                    color: '#fff', border: 'none', borderRadius: '6px',
                    cursor: uploading ? 'default' : 'pointer', fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap',
                  }}
                >
                  {uploading ? 'Uploading...' : '+ Upload'}
                </button>
                <button type="button" onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '1.6rem', lineHeight: 1, padding: 0 }}>
                  &times;
                </button>
              </div>
            </div>

            {/* Toast inside modal */}
            {toast && (
              <div style={{
                padding: '0.6rem 1.25rem', fontSize: '0.85rem', fontWeight: 600,
                background: toast.type === 'error' ? '#7f1d1d' : '#064e3b',
                color: toast.type === 'error' ? '#fca5a5' : '#34d399',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}>
                {toast.msg}
              </div>
            )}

            {/* Grid */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
              {loading ? (
                <div style={{ color: '#9ca3af', textAlign: 'center', padding: '3rem' }}>Loading...</div>
              ) : filtered.length === 0 ? (
                <div style={{ color: '#9ca3af', textAlign: 'center', padding: '3rem' }}>
                  {search ? `No files matching "${search}"` : 'No media yet — upload files above'}
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '0.75rem' }}>
                  {filtered.map(item => (
                    <div
                      key={item.id}
                      onClick={() => { onChange(item.url); setIsOpen(false); }}
                      style={{
                        background: '#141a26', borderRadius: '8px', overflow: 'hidden',
                        cursor: 'pointer', border: '2px solid transparent', transition: 'border-color 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = '#34d399'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
                      title={`Select: ${item.filename || item.name}`}
                    >
                      <div style={{ height: '90px', background: '#0a0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        {isImage(item) ? (
                          <img
                            src={item.url}
                            alt={item.alt || item.filename}
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          />
                        ) : (
                          <div style={{ fontSize: '2rem' }}>📄</div>
                        )}
                      </div>
                      <div style={{ padding: '0.4rem 0.5rem' }}>
                        <p style={{ margin: 0, fontSize: '0.7rem', color: '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.filename || item.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}