const fs = require('fs');
let code = fs.readFileSync('src/app/(public)/page.js', 'utf8');

const target = `                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--hs-text-900)', fontSize: 'var(--text-sm)' }}>{rev.name}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--hs-text-400)' }}>{rev.position}, {rev.company}</div>
                  </div>`;

const replacement = `                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {rev.image && (
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '1px solid var(--hs-border)' }}>
                        <img src={rev.image} alt={rev.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--hs-text-900)', fontSize: 'var(--text-sm)' }}>{rev.name}</div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--hs-text-400)' }}>{rev.position}, {rev.company}</div>
                    </div>
                  </div>`;

if(code.includes('var(--hs-text-900)')) {
    code = code.replace(target, replacement);
    fs.writeFileSync('src/app/(public)/page.js', code);
    console.log('reviews rendering updated');
}
