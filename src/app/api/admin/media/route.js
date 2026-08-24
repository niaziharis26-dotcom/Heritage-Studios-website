import { verifySessionToken } from '@/lib/auth';
import db from '@/lib/db';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function checkApiAuth() {
  const cookieStore = cookies();
  const token = cookieStore.get('admin_session')?.value;
  if (!token) return false;
  return Boolean(verifySessionToken(token));
}

function ensureUploadsDir() {
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  return uploadsDir;
}

// GET /api/admin/media
export async function GET(request) {
  if (!checkApiAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const media = db.get('media') || [];
  return NextResponse.json({ media });
}

// POST /api/admin/media — handles both file upload (FormData) and JSON actions
export async function POST(request) {
  if (!checkApiAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const contentType = request.headers.get('content-type') || '';

  if (contentType.includes('multipart/form-data')) {
    // Handle file upload
    try {
      const formData = await request.formData();
      const file = formData.get('file');
      const altText = formData.get('alt') || '';

      if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 });
      }

      const uploadsDir = ensureUploadsDir();

      // Sanitize filename
      const originalName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const ext = path.extname(originalName);
      const base = path.basename(originalName, ext);
      const uniqueName = `${base}_${Date.now()}${ext}`;
      const filePath = path.join(uploadsDir, uniqueName);

      // Write file
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fs.writeFileSync(filePath, buffer);

      // Build media record
      const mediaRecord = {
        id: `media_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        filename: uniqueName,
        originalName: file.name,
        url: `/uploads/${uniqueName}`,
        type: file.type,
        size: buffer.length,
        alt: altText,
        folder: formData.get('folder') || '',
        uploadedAt: new Date().toISOString(),
      };

      const media = db.get('media') || [];
      media.unshift(mediaRecord);
      db.set('media', media);

      // Log activity
      if (typeof db.logActivity === 'function') {
        db.logActivity('admin', 'media_upload', `Uploaded: ${file.name}`);
      }

      return NextResponse.json({ success: true, media: mediaRecord });
    } catch (err) {
      console.error('Media upload error:', err);
      return NextResponse.json({ error: 'Upload failed: ' + err.message }, { status: 500 });
    }
  }

  // JSON actions
  try {
    const body = await request.json();
    const { action, id, alt, name } = body;

    if (action === 'updateMeta') {
      const media = db.get('media') || [];
      const idx = media.findIndex(m => m.id === id);
      if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      if (alt !== undefined) media[idx].alt = alt;
      if (name !== undefined) media[idx].filename = name;
      db.set('media', media);
      return NextResponse.json({ success: true, media: media[idx] });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

// DELETE /api/admin/media
export async function DELETE(request) {
  if (!checkApiAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await request.json();
    const media = db.get('media') || [];
    const item = media.find(m => m.id === id);
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Delete file from disk if it's in /uploads/
    if (item.url && item.url.startsWith('/uploads/')) {
      const filePath = path.join(process.cwd(), 'public', item.url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    const updated = media.filter(m => m.id !== id);
    db.set('media', updated);

    if (typeof db.logActivity === 'function') {
      db.logActivity('admin', 'media_delete', `Deleted: ${item.originalName || item.filename}`);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Media delete error:', err);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}

// PATCH /api/admin/media — update alt text or filename
export async function PATCH(request) {
  if (!checkApiAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, alt, name } = await request.json();
    const media = db.get('media') || [];
    const idx = media.findIndex(m => m.id === id);
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (alt !== undefined) media[idx].alt = alt;
    if (name !== undefined) media[idx].filename = name;
    db.set('media', media);

    return NextResponse.json({ success: true, media: media[idx] });
  } catch (err) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
