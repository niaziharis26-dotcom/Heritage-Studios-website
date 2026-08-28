import { NextResponse } from 'next/server';
import db from '@/lib/db';
import fs from 'fs';
import path from 'path';

// GET /api/admin/sync-media — scans public/icons and public/projects into the media store
export async function GET(request) {
  await db.load();

  const publicDir = path.join(process.cwd(), 'public');
  const scanDirs = [
    { dir: path.join(publicDir, 'icons', 'services'), urlBase: '/icons/services/' },
    { dir: path.join(publicDir, 'icons'),             urlBase: '/icons/' },
    { dir: path.join(publicDir, 'projects'),          urlBase: '/projects/' },
    { dir: path.join(publicDir, 'uploads'),           urlBase: '/uploads/' },
  ];

  const existing = db.get('media') || [];
  const existingUrls = new Set(existing.map(m => m.url));

  const imageExts = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.avif']);
  const added = [];

  for (const { dir, urlBase } of scanDirs) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if (!imageExts.has(ext)) continue;
      const url = urlBase + file;
      if (existingUrls.has(url)) continue; // already registered

      const filePath = path.join(dir, file);
      let size = 0;
      try { size = fs.statSync(filePath).size; } catch {}

      const mimeMap = {
        '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
        '.webp': 'image/webp', '.gif': 'image/gif', '.svg': 'image/svg+xml',
        '.avif': 'image/avif',
      };

      const record = {
        id: `media_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        filename: file,
        originalName: file,
        url,
        type: mimeMap[ext] || 'image/jpeg',
        size,
        alt: file.replace(/[_-]/g, ' ').replace(/\.[^.]+$/, ''),
        folder: urlBase.replace(/^\/|\/$/g, ''),
        uploadedAt: new Date().toISOString(),
      };
      existing.unshift(record);
      existingUrls.add(url);
      added.push(url);
    }
  }

  if (added.length > 0) {
    await db.set('media', existing);
  }

  return NextResponse.json({
    success: true,
    added: added.length,
    total: existing.length,
    files: added,
  });
}
