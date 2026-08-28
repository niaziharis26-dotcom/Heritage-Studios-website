const fs = require('fs');
let code = fs.readFileSync('src/app/(public)/services/[slug]/page.js', 'utf8');

// Update Hero to show icon
const heroTarget = `<h1 data-cms-field="heroTitle" style={{ marginBottom: '1.25rem' }}>`;
const heroReplacement = `{svc.icon && svc.icon.startsWith('/') && (
              <div style={{ width: '64px', height: '64px', marginBottom: '1.25rem' }}>
                 <img src={svc.icon} alt={svc.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
            )}
            <h1 data-cms-field="heroTitle" style={{ marginBottom: '1.25rem' }}>`;
code = code.replace(heroTarget, heroReplacement);

// Update child services to render image icon
const childIconTarget = `{child.icon && (
                    <div style={{ fontSize: '2rem', marginBottom: '0.75rem', lineHeight: 1 }}>{child.icon}</div>
                  )}`;
const childIconReplacement = `{child.icon && (
                    <div style={{ fontSize: '2rem', marginBottom: '0.75rem', lineHeight: 1, width: '40px', height: '40px' }}>
                      {child.icon.startsWith('/') ? <img src={child.icon} alt={child.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : child.icon}
                    </div>
                  )}`;
code = code.replace(childIconTarget, childIconReplacement);

// Update review card to render client image
const reviewTarget = `<div style={{ paddingTop: '1.25rem', borderTop: '1px solid var(--hs-border-light)' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--hs-text-900)', marginBottom: '0.25rem' }}>
                      {rev.name}
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--hs-text-400)', fontWeight: 500 }}>
                      {rev.position}{rev.company ? (", " + rev.company) : ''}
                    </div>
                  </div>`;
const reviewReplacement = `<div style={{ paddingTop: '1.25rem', borderTop: '1px solid var(--hs-border-light)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {rev.image && (
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '1px solid var(--hs-border-light)' }}>
                        <img src={rev.image} alt={rev.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--hs-text-900)', marginBottom: '0.25rem' }}>
                        {rev.name}
                      </div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--hs-text-400)', fontWeight: 500 }}>
                        {rev.position}{rev.company ? (", " + rev.company) : ''}
                      </div>
                    </div>
                  </div>`;
code = code.replace(reviewTarget, reviewReplacement);

fs.writeFileSync('src/app/(public)/services/[slug]/page.js', code);
console.log('service detail page updated');
