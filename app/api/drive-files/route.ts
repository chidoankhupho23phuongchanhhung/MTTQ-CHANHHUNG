import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(req: NextRequest) {
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

    if (!gasUrl || !gasUrl.startsWith('http')) {
      return NextResponse.json({ success: false, message: 'Chưa cấu hình Google Apps Script URL', files: [] });
    }

    // Call Google Apps Script with action=list
    const urlWithParam = `${gasUrl}${gasUrl.includes('?') ? '&' : '?'}action=list`;
    const res = await fetch(urlWithParam, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      redirect: 'follow',
    });

    if (res.ok) {
      const data = await res.json();
      if (data.files && Array.isArray(data.files)) {
        return NextResponse.json({
          success: true,
          count: data.files.length,
          files: data.files,
        });
      }
    }

    return NextResponse.json({ success: false, message: 'Google Apps Script chưa kích hoạt tính năng liệt kê tệp', files: [] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message, files: [] });
  }
}
