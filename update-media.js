const fs = require('fs');
const path = require('path');
let code = fs.readFileSync('src/app/api/admin/media/route.js', 'utf8');

const target = `      // Write file
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fs.writeFileSync(filePath, buffer);

      // Build media record
      const mediaRecord = {
        id: \`media_\${Date.now()}_\${Math.random().toString(36).slice(2, 8)}\`,
        filename: uniqueName,
        originalName: file.name,
        url: \`/uploads/\${uniqueName}\`,`;

const replacement = `      // Write file
      let finalUrl = '';
      let fileSize = 0;
      if (process.env.BLOB_READ_WRITE_TOKEN) {
        const { put } = require('@vercel/blob');
        const blob = await put(uniqueName, file, { access: 'public' });
        finalUrl = blob.url;
        fileSize = file.size || 0;
      } else {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        fs.writeFileSync(filePath, buffer);
        finalUrl = \`/uploads/\${uniqueName}\`;
        fileSize = buffer.length;
      }

      // Build media record
      const mediaRecord = {
        id: \`media_\${Date.now()}_\${Math.random().toString(36).slice(2, 8)}\`,
        filename: uniqueName,
        originalName: file.name,
        url: finalUrl,`;

code = code.replace(target, replacement);

const targetDelete = `    // Delete file from disk if it's in /uploads/
    if (item.url && item.url.startsWith('/uploads/')) {
      const filePath = path.join(process.cwd(), 'public', item.url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }`;
    
const replaceDelete = `    // Delete file from disk if it's in /uploads/
    if (item.url && item.url.startsWith('/uploads/')) {
      const filePath = path.join(process.cwd(), 'public', item.url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } else if (item.url && item.url.includes('vercel-storage.com') && process.env.BLOB_READ_WRITE_TOKEN) {
      const { del } = require('@vercel/blob');
      await del(item.url);
    }`;
    
code = code.replace(targetDelete, replaceDelete);
code = code.replace(/size: buffer\.length,/, 'size: fileSize,');

fs.writeFileSync('src/app/api/admin/media/route.js', code);
console.log('media route updated');
