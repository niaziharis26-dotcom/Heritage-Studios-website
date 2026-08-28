const fs = require('fs');
let code = fs.readFileSync('src/app/(public)/services/[slug]/page.js', 'utf8');

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

if(code.includes('var(--hs-text-900)')) {
    code = code.replace(reviewTarget, reviewReplacement);
    fs.writeFileSync('src/app/(public)/services/[slug]/page.js', code);
    console.log('service page reviews rendering updated');
}
