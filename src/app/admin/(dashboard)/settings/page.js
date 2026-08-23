'use client';
import { useState, useEffect } from 'react';
import AdminLayoutWrapper from '@/components/AdminLayoutWrapper';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings || {});
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback({ type: '', text: '' });
    const fd = new FormData(e.target);
    const payload = {};
    for (let [key, val] of fd.entries()) {
      payload[key] = val;
    }

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setFeedback({ type: 'success', text: 'Settings updated successfully!' });
        fetchSettings();
      } else {
        setFeedback({ type: 'error', text: 'Failed to save settings.' });
      }
    } catch (err) {
      console.error(err);
      setFeedback({ type: 'error', text: 'An unexpected error occurred while saving.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayoutWrapper>
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-primary-light)' }}>Loading site configuration...</div>
      </AdminLayoutWrapper>
    );
  }

  return (
    <AdminLayoutWrapper>
      <div className="admin-settings-container">
        <h3>Site settings & Integrations</h3>
        <p style={{ fontSize: '0.9rem', marginBottom: '2.5rem' }}>Update centralized brand profiles, dynamic booking integrations, and social links.</p>

        {feedback.text && (
          <div className={`form-feedback ${feedback.type}-box`} style={{
            padding: '1rem 1.5rem',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '2rem',
            fontSize: '0.95rem',
            textAlign: 'left',
            background: feedback.type === 'success' ? 'rgba(52, 211, 153, 0.1)' : 'rgba(220, 38, 38, 0.1)',
            border: feedback.type === 'success' ? '1px solid rgba(52, 211, 153, 0.2)' : '1px solid rgba(220, 38, 38, 0.2)',
            color: feedback.type === 'success' ? '#34d399' : '#ef4444'
          }}>
            {feedback.text}
          </div>
        )}

        <div className="card-glass panel-inner" style={{ padding: '2.5rem' }}>
          <form onSubmit={handleSave}>
            {/* Branding Column */}
            <h4 style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>Branding & Contact Info</h4>
            <div className="form-row-two" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Company Name</label>
                <input name="companyName" className="form-input" defaultValue={settings.companyName} required />
              </div>
              <div className="form-group">
                <label className="form-label">Logo Text Header</label>
                <input name="logoText" className="form-input" defaultValue={settings.logoText} required />
              </div>
            </div>

            <div className="form-row-two" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Official Email Address</label>
                <input name="email" className="form-input" type="email" defaultValue={settings.email} required />
              </div>
              <div className="form-group">
                <label className="form-label">Official Phone Number</label>
                <input name="phone" className="form-input" defaultValue={settings.phone} required />
              </div>
            </div>

            {/* Integrations Column */}
            <h4 style={{ margin: '2.5rem 0 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>External Integrations & CTAs</h4>
            <div className="form-row-three" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">WhatsApp Status</label>
                <select name="whatsappEnabled" className="form-input" defaultValue={settings.whatsappEnabled !== undefined ? settings.whatsappEnabled : "true"}>
                  <option value="true">Enabled</option>
                  <option value="false">Disabled</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">WhatsApp Number (Digits only)</label>
                <input name="whatsappNumber" className="form-input" defaultValue={settings.whatsappNumber} placeholder="15550192834" required />
              </div>
              <div className="form-group">
                <label className="form-label">WhatsApp Default Text</label>
                <input name="whatsappMessage" className="form-input" defaultValue={settings.whatsappMessage} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Calendly / Booking Portal URL (Fallbacks to contact form if blank)</label>
              <input name="bookingUrl" className="form-input" defaultValue={settings.bookingUrl} placeholder="https://calendly.com/yourname" />
            </div>

            {/* SEO Column */}
            <h4 style={{ margin: '2.5rem 0 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>SEO Settings</h4>
            <div className="form-group">
              <label className="form-label">Default Page Title</label>
              <input name="defaultSeoTitle" className="form-input" defaultValue={settings.defaultSeoTitle} required />
            </div>
            <div className="form-group">
              <label className="form-label">Default Meta Description</label>
              <textarea name="defaultSeoDescription" className="form-input" rows="3" defaultValue={settings.defaultSeoDescription} required></textarea>
            </div>

            {/* Social Links Column */}
            <h4 style={{ margin: '2.5rem 0 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>Social Networks</h4>
            <div className="form-row-two" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Instagram Link</label>
                <input name="instagramUrl" className="form-input" defaultValue={settings.instagramUrl} />
              </div>
              <div className="form-group">
                <label className="form-label">Facebook Link</label>
                <input name="facebookUrl" className="form-input" defaultValue={settings.facebookUrl} />
              </div>
            </div>
            <div className="form-row-three" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">TikTok Link</label>
                <input name="tiktokUrl" className="form-input" defaultValue={settings.tiktokUrl} />
              </div>
              <div className="form-group">
                <label className="form-label">YouTube Link</label>
                <input name="youtubeUrl" className="form-input" defaultValue={settings.youtubeUrl} />
              </div>
              <div className="form-group">
                <label className="form-label">LinkedIn Link</label>
                <input name="linkedinUrl" className="form-input" defaultValue={settings.linkedinUrl} />
              </div>
            </div>

            {/* Footer Copy */}
            <h4 style={{ margin: '2.5rem 0 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>Footer Configurations</h4>
            <div className="form-group">
              <label className="form-label">Footer Tagline/Copy</label>
              <input name="footerText" className="form-input" defaultValue={settings.footerText} required />
            </div>
            <div className="form-group">
              <label className="form-label">Copyright Notice</label>
              <input name="copyright" className="form-input" defaultValue={settings.copyright} required />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '2rem' }} disabled={saving}>
              {saving ? 'Saving...' : 'Save Settings Configuration'}
            </button>
          </form>
        </div>
      </div>
    </AdminLayoutWrapper>
  );
}
