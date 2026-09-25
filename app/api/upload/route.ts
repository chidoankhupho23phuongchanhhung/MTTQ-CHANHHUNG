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

    // 1. Luôn lưu bản sao nội bộ tại public/uploads/ để website hiển thị tức thì 100% không lo lỗi mạng/CORS
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });
    const filePath = path.join(uploadsDir, fileName);
    await fs.writeFile(filePath, buffer);
    const localUrl = `/uploads/${fileName}`;

    // 2. Đồng bộ lưu ảnh lên thư mục Google Drive của MTTQ Phường Chánh Hưng qua Google Apps Script
    let driveUrl = '';
    let driveFileId = '';
    let directDriveImageUrl = '';
    let gasSuccess = false;

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
          if (gasResult.success) {
            gasSuccess = true;
            driveFileId = gasResult.fileId || '';
            driveUrl = gasResult.driveUrl || gasResult.viewUrl || '';
            directDriveImageUrl = gasResult.url || (driveFileId ? `https://lh3.googleusercontent.com/d/${driveFileId}` : '');
          }
        }
      }
    } catch (gasErr) {
      console.warn('Lưu Google Drive không thành công, đã lưu tại máy chủ:', gasErr);
    }

    return NextResponse.json({
      success: true,
      url: localUrl,
      localUrl: localUrl,
      driveUrl: driveUrl,
      driveFileId: driveFileId,
      directDriveImageUrl: directDriveImageUrl,
      proxyUrl: driveFileId ? `/api/drive-image?id=${driveFileId}` : localUrl,
      gasSuccess: gasSuccess,
      source: gasSuccess ? 'local-and-drive' : 'local-server'
    });
  } catch (error: any) {
    console.error('API upload error:', error);
    return NextResponse.json({ error: error.message || 'Lỗi khi lưu ảnh lên máy chủ' }, { status: 500 });
  }
}
