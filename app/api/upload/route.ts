import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Không tìm thấy tệp tải lên' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const originalName = file.name || 'image.jpg';
    let ext = path.extname(originalName) || '.jpg';
    ext = ext.replace(/[^a-zA-Z0-9.]/g, '').toLowerCase();
    if (!['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif'].includes(ext)) {
      ext = '.jpg';
    }

    const fileName = `mttq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}${ext}`;

    // 1. Try uploading to Google Drive via Google Apps Script if configured
    try {
      const settingsPath = path.join(process.cwd(), 'data', 'settings.json');
      let gasUrl = process.env.GOOGLE_APPS_SCRIPT_URL || '';
      let driveFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID || '1IEL2r2RZf1UnIeYiD6p753rWaSeTAi6J';

      try {
        const rawSettings = await fs.readFile(settingsPath, 'utf-8');
        const parsed = JSON.parse(rawSettings);
        if (parsed.drive?.scriptUrl) gasUrl = parsed.drive.scriptUrl;
        if (parsed.drive?.folderId) driveFolderId = parsed.drive.folderId;
      } catch {}

      if (gasUrl && gasUrl.startsWith('http')) {
        const base64Data = buffer.toString('base64');
        const gasResponse = await fetch(gasUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            base64: base64Data,
            fileName: fileName,
            mimeType: file.type || (ext === '.png' ? 'image/png' : 'image/jpeg'),
            folderId: driveFolderId
          }),
          redirect: 'follow',
        });

        if (gasResponse.ok) {
          const gasResult = await gasResponse.json();
          if (gasResult.success && gasResult.url) {
            return NextResponse.json({
              success: true,
              url: gasResult.url,
              driveUrl: gasResult.url,
              source: 'google-drive'
            });
          }
        }
      }
    } catch (gasErr) {
      console.warn('Google Drive Apps Script upload error, falling back to local server storage:', gasErr);
    }

    // 2. Fallback to local server uploads
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });

    const filePath = path.join(uploadsDir, fileName);
    await fs.writeFile(filePath, buffer);

    const fileUrl = `/uploads/${fileName}`;
    return NextResponse.json({ success: true, url: fileUrl, source: 'local-server' });
  } catch (error: any) {
    console.error('API upload error:', error);
    return NextResponse.json({ error: error.message || 'Lỗi khi lưu ảnh lên máy chủ' }, { status: 500 });
  }
}
