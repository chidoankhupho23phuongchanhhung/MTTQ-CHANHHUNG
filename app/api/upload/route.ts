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

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });

    const originalName = file.name || 'image.jpg';
    let ext = path.extname(originalName) || '.jpg';
    ext = ext.replace(/[^a-zA-Z0-9.]/g, '').toLowerCase();
    if (!['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif'].includes(ext)) {
      ext = '.jpg';
    }

    const fileName = `bg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}${ext}`;
    const filePath = path.join(uploadsDir, fileName);

    await fs.writeFile(filePath, buffer);

    const fileUrl = `/uploads/${fileName}`;
    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error: any) {
    console.error('API upload error:', error);
    return NextResponse.json({ error: error.message || 'Lỗi khi lưu ảnh lên máy chủ' }, { status: 500 });
  }
}
