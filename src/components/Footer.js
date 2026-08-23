import Link from 'next/link';
import Logo from '@/components/Logo';

const SocialIcon = ({ type }) => {
  const icons = {
    instagram: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" width="17" height="17" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
      </svg>
    ),
    facebook: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17" aria-hidden="true">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
    youtube: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17" aria-hidden="true">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
        <polygon fill="var(--hs-charcoal)" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
      </svg>
    ),
    tiktok: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34l.04-8.31a8.19 8.19 0 0 0 4.79 1.52V5.07a4.85 4.85 0 0 1-1.06-.38z"/>
      </svg>
    ),
    linkedin: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17" aria-hidden="true">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
      </svg>
    ),
  };
  return icons[type] || null;
};

export default function Footer({ settings = {}, services = [], footer = {} }) {
  const year = new Date().getFullYear();

  const socialLinks = [
    { key: 'instagramUrl', type: 'instagram', label: 'Instagram' },
    { key: 'facebookUrl',  type: 'facebook',  label: 'Facebook' },
    { key: 'youtubeUrl',   type: 'youtube',   label: 'YouTube' },
    { key: 'tiktokUrl',    type: 'tiktok',    label: 'TikTok' },
    { key: 'linkedinUrl',  type: 'linkedin',  label: 'LinkedIn' },
  ].filter(s => settings[s.key]);

  const companyLinks = footer.companyLinks || [
    { name: 'Home',           path: '/' },
    { name: 'About Us',       path: '/about' },
    { name: 'All Services',   path: '/services' },
    { name: 'Portfolio',      path: '/projects' },
    { name: 'Client Reviews', path: '/reviews' },
    { name: 'Social Media',   path: '/social-media' },
    { name: 'Contact',        path: '/contact' },
  ];

  const publishedServices = services
    .filter(s => s.published)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .slice(0, 5);

  const waHref = settings.whatsappNumber
    ? `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(settings.whatsappMessage || "Hi Heritage Studios, I'd like to discuss a project.")}`
    : '/contact';

  return (
    <footer className="hs-footer" role="contentinfo">
      <div className="container">

        {/* Main Grid */}
        <div className="footer-grid">

          {/* Brand */}
          <div className="footer-brand">
            <Link href="/" style={{ display: 'inline-flex', marginBottom: '1.25rem', color: 'var(--hs-text-inv)' }}>
              <Logo style={{ color: 'var(--hs-text-inv)' }} />
            </Link>
            <p className="footer-tagline">
              {footer.tagline || settings.footerText || 'Premium digital agency — engineering technology that moves business forward.'}
            </p>
            {socialLinks.length > 0 && (
              <div className="footer-socials" role="list" aria-label="Social media links">
                {socialLinks.map(({ key, type, label }) => (
                  <a
                    key={key}
                    href={settings[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-btn"
                    aria-label={label}
                    role="listitem"
                  >
                    <SocialIcon type={type} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Company Links */}
          <div>
            <p className="footer-col-label">{footer.companyLinksTitle || 'Company'}</p>
            <nav className="footer-links" aria-label="Company pages">
              {companyLinks.map(({ name, path }) => (
                <Link key={path} href={path}>{name}</Link>
              ))}
            </nav>
          </div>

          {/* Services */}
          <div>
            <p className="footer-col-label">{footer.servicesColumnTitle || 'Services'}</p>
            <nav className="footer-links" aria-label="Service pages">
              {publishedServices.map(s => (
                <Link key={s.id} href={`/services/${s.slug}`}>{s.name}</Link>
              ))}
              <Link href="/services" className="accent">All Services →</Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <p className="footer-col-label">{footer.contactColumnTitle || 'Get in Touch'}</p>
            <div className="footer-links">
              {settings.email && (
                <a href={`mailto:${settings.email}`}>{settings.email}</a>
              )}
              {settings.phone && (
                <a href={`tel:${settings.phone}`}>{settings.phone}</a>
              )}
              <a href={waHref} target="_blank" rel="noopener noreferrer"
                 className="btn btn-primary btn-sm" style={{ marginTop: '0.75rem', alignSelf: 'flex-start' }}>
                WhatsApp Us
              </a>
              {settings.bookingUrl && (
                <a href={settings.bookingUrl} target="_blank" rel="noopener noreferrer"
                   className="btn btn-ghost btn-sm" style={{ marginTop: '0.5rem', alignSelf: 'flex-start' }}>
                  Book a Call
                </a>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="footer-bar">
          <p>{settings.copyright || `© ${year} Heritage Studios. All rights reserved.`}</p>
        </div>

      </div>
    </footer>
  );
}
