import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const SETTINGS_FILE = path.join(process.cwd(), 'data', 'settings.json');

async function readSettings() {
  try {
    const data = await fs.readFile(SETTINGS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return { fanpages: {}, phongtrao: {} };
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

// GET /api/settings - Fetch all saved custom URLs and backgrounds
export async function GET() {
  const settings = await readSettings();
  return NextResponse.json(settings);
}

// POST /api/settings - Update a fanpage or phongtrao setting
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, id, bg, url } = body;

    if (!type || !id) {
      return NextResponse.json({ error: 'Missing type or id' }, { status: 400 });
    }

    const current = await readSettings();

    if (type === 'fanpage') {
      current.fanpages = current.fanpages || {};
      current.fanpages[id] = current.fanpages[id] || {};
      if (bg !== undefined) current.fanpages[id].bg = bg;
      if (url !== undefined) current.fanpages[id].url = url;
    } else if (type === 'phongtrao') {
      current.phongtrao = current.phongtrao || {};
      if (bg !== undefined) current.phongtrao[id] = bg;
    }

    await writeSettings(current);
    return NextResponse.json({ success: true, settings: current });
  } catch (err: any) {
    console.error('Settings API POST error:', err);
    return NextResponse.json({ error: err.message || 'Lỗi lưu cấu hình' }, { status: 500 });
  }
}
