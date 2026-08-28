'use client';

import { useState, useEffect, useRef } from 'react';

export default function MediaSelector({ value, onChange, label = "Select Image" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen]);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/media');
      if (res.ok) {
        const data = await res.json();
        setMedia(Array.isArray(data) ? data : (data.media || []));
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/media', { method: 'POST', body: formData });
      if (res.ok) {
        await fetchMedia();
      }
    } catch (err) {
      console.error(err);
    }
    setUploading(false);
  };

  return (
    <div className="media-selector" style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', fontSize: '0.85rem', color: '#9ca3af', marginBottom: '0.5rem' }}>{label}</label>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {value ? (
          <div style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', background: '#0a0f1a', border: '1px solid rgba(255,255,255,0.1)' }}>
            {value.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) || value.startsWith('/') ? (
              <img src={value} alt="Selected" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              <div style={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>📄</div>
            )}
            <button 
              type="button"
              onClick={() => onChange('')} 
              style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}
            >
              &times;
            </button>
          </div>
        ) : null}
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="button" onClick={() => setIsOpen(true)} className="btn btn-outline-inv btn-sm" style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}>
              Select Media
            </button>
            <input 
              className="form-input" 
              value={value || ''} 
              onChange={e => onChange(e.target.value)} 
              placeholder="Or enter URL/emoji" 
              style={{ flex: 1, padding: '0.4rem 0.75rem', fontSize: '0.85rem', width: '200px' }} 
            />
          </div>
        </div>
      </div>

      {isOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#0e1420', width: '90%', maxWidth: '800px', height: '80vh', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, color: '#fff' }}>Select Media</h3>
              <button type="button" onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '1.5rem' }}>&times;</button>
            </div>
            
            <div style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn btn-primary btn-sm"
              >
                {uploading ? 'Uploading...' : 'Upload New File'}
              </button>
              <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={(e) => handleUpload(e.target.files?.[0])} />
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
              {loading ? (
                <div style={{ color: '#9ca3af', textAlign: 'center' }}>Loading...</div>
              ) : media.length === 0 ? (
                <div style={{ color: '#9ca3af', textAlign: 'center' }}>No media found.</div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1rem' }}>
                  {media.filter(m => m.type?.startsWith('image/')).map(item => (
                    <div 
                      key={item.id} 
                      onClick={() => { onChange(item.url); setIsOpen(false); }}
                      style={{ background: '#141a26', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', border: '2px solid transparent' }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = '#34d399'}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
                    >
                      <img src={item.url} alt={item.alt || item.filename} style={{ width: '100%', height: '100px', objectFit: 'contain', background: '#0a0f1a' }} />
                      <div style={{ padding: '0.5rem', fontSize: '0.7rem', color: '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.filename}
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