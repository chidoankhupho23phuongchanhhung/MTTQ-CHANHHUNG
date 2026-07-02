import { NextResponse } from 'next/server';

const SHEET_ID = '1h76CSsBYTZHFuCZ_pobjO_ZZF3tdZYH4Uql8rSZ-MGM';

/* ─── Simple CSV parser (handles quoted fields) ─── */
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  const lines = text.split(/\r?\n/);

  for (const line of lines) {
    if (!line.trim()) continue;
    const cells: string[] = [];
    let cur = '';
    let inQuote = false;

    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuote && line[i + 1] === '"') { cur += '"'; i++; }
        else inQuote = !inQuote;
      } else if (ch === ',' && !inQuote) {
        cells.push(cur.trim());
        cur = '';
      } else {
        cur += ch;
      }
    }
    cells.push(cur.trim());
    rows.push(cells);
  }
  return rows;
}

export async function GET() {
  try {
    const csvUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=1410972139`;

    const res = await fetch(csvUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      redirect: 'follow',
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Google Sheets trả về HTTP ${res.status}. Kiểm tra quyền chia sẻ Sheet.` },
        { status: 502 }
      );
    }

    const text = await res.text();

    // Detect HTML error page (happens when sheet is private)
    if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
      return NextResponse.json(
        { error: 'Sheet chưa được chia sẻ công khai. Vào Share → Anyone with the link → Viewer.' },
        { status: 403 }
      );
    }

    const rawRows = parseCSV(text);
    if (rawRows.length < 1) {
      return NextResponse.json({ headers: [], rows: [] });
    }

    // Find the row that contains "NỘI DUNG" or "THỜI GIAN" or "NGÀY" as the header row
    let headerIndex = 0;
    for (let i = 0; i < rawRows.length; i++) {
      const rowStr = rawRows[i].join(' ').toLowerCase();
      if (rowStr.includes('nội dung') || rowStr.includes('noi dung') || (rowStr.includes('ngày') && rowStr.includes('thời gian'))) {
        headerIndex = i;
        break;
      }
    }

    const headers = rawRows[headerIndex];
    const dataRows = rawRows.slice(headerIndex + 1).filter(r => r.some(c => c.trim() !== ''));

    return NextResponse.json(
      { headers, rows: dataRows, fetchedAt: new Date().toISOString() },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Access-Control-Allow-Origin': '*',
        }
      }
    );

  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Lỗi không xác định';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
