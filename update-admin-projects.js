const fs = require('fs');
let code = fs.readFileSync('src/app/admin/(dashboard)/projects/page.js', 'utf8');

if (!code.includes('MediaSelector')) {
  code = code.replace(
    "import { useState, useEffect } from 'react';", 
    "import { useState, useEffect } from 'react';\nimport MediaSelector from '@/components/MediaSelector';"
  );
}

const oldInput = `<div className="form-group" style={{ marginTop: '1rem' }}>
              <label className="form-label">Image URL</label>
              <input className="form-input" value={form.image} onChange={e => f('image', e.target.value)} placeholder="https://..." />
              {form.image && <img src={form.image} alt="preview" style={{ marginTop: '0.75rem', maxHeight: 120, borderRadius: 'var(--r-md)', objectFit: 'cover' }} />}
            </div>`;

const newInput = `<div className="form-group" style={{ marginTop: '1rem' }}>
              <MediaSelector label="Project Image" value={form.image} onChange={val => f('image', val)} />
            </div>`;

if(code.includes('Image URL')) {
    code = code.replace(oldInput, newInput);
} else {
    console.log("Could not find the target HTML in projects page");
}
fs.writeFileSync('src/app/admin/(dashboard)/projects/page.js', code);
console.log('projects admin page updated');
