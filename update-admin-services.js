const fs = require('fs');
let code = fs.readFileSync('src/app/admin/(dashboard)/services/page.js', 'utf8');

if (!code.includes('MediaSelector')) {
  code = code.replace(
    "import { useState, useEffect } from 'react';", 
    "import { useState, useEffect } from 'react';\nimport MediaSelector from '@/components/MediaSelector';"
  );
}

const oldInput = `<div className="form-group">
                <label className="form-label">Service Icon (Emoji / Symbol)</label>
                <input className="form-input" value={form.icon} onChange={e => f('icon', e.target.value)} placeholder="✨" />
              </div>`;

const newInput = `<div className="form-group">
                <MediaSelector label="Service Icon" value={form.icon} onChange={val => f('icon', val)} />
              </div>`;

if(code.includes('Service Icon (Emoji / Symbol)')) {
    code = code.replace(oldInput, newInput);
} else {
    console.log("Could not find the target HTML in services page");
}
fs.writeFileSync('src/app/admin/(dashboard)/services/page.js', code);
console.log('services admin page updated');
