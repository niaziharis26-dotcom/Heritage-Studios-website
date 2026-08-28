const fs = require('fs');
let code = fs.readFileSync('src/app/admin/(dashboard)/reviews/page.js', 'utf8');

if (!code.includes('MediaSelector')) {
  code = code.replace(
    "import { useState, useEffect } from 'react';", 
    "import { useState, useEffect } from 'react';\nimport MediaSelector from '@/components/MediaSelector';"
  );
}

code = code.replace(
  "const EMPTY_FORM = { name: '', company: '', position: '', rating: 5, review: '', published: true, sortOrder: 1 };",
  "const EMPTY_FORM = { name: '', company: '', position: '', rating: 5, review: '', published: true, sortOrder: 1, image: '' };"
);

const oldInput = `<div className="form-group" style={{ marginTop: '1rem' }}>
              <label className="form-label">Review Text</label>`;

const newInput = `<div className="form-group" style={{ marginTop: '1rem' }}>
              <MediaSelector label="Client Photo" value={form.image} onChange={val => f('image', val)} />
            </div>
            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label className="form-label">Review Text</label>`;

if (code.includes('Review Text')) {
    code = code.replace(oldInput, newInput);
}
fs.writeFileSync('src/app/admin/(dashboard)/reviews/page.js', code);
console.log('reviews admin page updated');
