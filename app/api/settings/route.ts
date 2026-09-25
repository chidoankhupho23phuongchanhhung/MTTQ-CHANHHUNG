import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SETTINGS_FILE = path.join(process.cwd(), 'data', 'settings.json');

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
};

async function readSettings() {
  try {
    const data = await fs.readFile(SETTINGS_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    return {
      fanpages: parsed.fanpages || {},
      phongtrao: parsed.phongtrao || {},
      intro: parsed.intro || {},
      drive: parsed.drive || {
        folderId: '1IEL2r2RZf1UnIeYiD6p753rWaSeTAi6J',
        scriptUrl: process.env.GOOGLE_APPS_SCRIPT_URL || '',
      },
    };
  } catch {
    return {
      fanpages: {},
      phongtrao: {},
      intro: {},
      drive: {
        folderId: '1IEL2r2RZf1UnIeYiD6p753rWaSeTAi6J',
        scriptUrl: process.env.GOOGLE_APPS_SCRIPT_URL || '',
      },
    };
  }
}

async function writeSettings(settings: any) {
  try {
    const dir = path.dirname(SETTINGS_FILE);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write settings:', err);
  }
}

// GET /api/settings - Fetch all saved custom URLs and backgrounds (No-cache)
export async function GET() {
  const settings = await readSettings();
  return NextResponse.json(settings, {
    headers: NO_CACHE_HEADERS,
  });
}

// POST /api/settings - Update a fanpage, phongtrao, intro, or drive setting
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, id, bg, url, data } = body;

    if (!type) {
      return NextResponse.json({ error: 'Missing type' }, { status: 400, headers: NO_CACHE_HEADERS });
    }

    const current = await readSettings();

    if (type === 'fanpage') {
      if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400, headers: NO_CACHE_HEADERS });
      current.fanpages = current.fanpages || {};
      current.fanpages[id] = current.fanpages[id] || {};
      if (bg !== undefined) current.fanpages[id].bg = bg;
      if (url !== undefined) current.fanpages[id].url = url;
    } else if (type === 'phongtrao') {
      if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400, headers: NO_CACHE_HEADERS });
      current.phongtrao = current.phongtrao || {};
      if (bg !== undefined) current.phongtrao[id] = bg;
    } else if (type === 'intro') {
      // Thay thế trực tiếp toàn bộ dữ liệu intro mới nhất, không shallow-merge dữ liệu cũ
      if (data) {
        current.intro = data;
      }
    } else if (type === 'drive') {
      current.drive = current.drive || {};
      if (data) {
        current.drive = { ...current.drive, ...data };
      }
    }

    await writeSettings(current);
    return NextResponse.json({ success: true, settings: current }, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    console.error('Settings API POST error:', err);
    return NextResponse.json({ error: err.message || 'Lỗi lưu cấu hình' }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}
