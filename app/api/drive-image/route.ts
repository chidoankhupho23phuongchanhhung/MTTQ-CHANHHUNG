import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    let id = searchParams.get('id') || '';
    const rawUrl = searchParams.get('url') || '';

    if (!id && rawUrl) {
      // Extract Google Drive ID from various URL formats
      const match1 = rawUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      const match2 = rawUrl.match(/id=([a-zA-Z0-9_-]+)/);
      const match3 = rawUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (match1) id = match1[1];
      else if (match2) id = match2[1];
      else if (match3) id = match3[1];
    }

    if (!id) {
      return NextResponse.json({ error: 'Missing file id or url' }, { status: 400 });
    }

    // Try fetching image from Google's high-speed CDN
    const targetUrl = `https://lh3.googleusercontent.com/d/${id}`;
    let imageRes = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    });

    // Fallback to uc export view if lh3 fails
    if (!imageRes.ok) {
      const fallbackUrl = `https://drive.google.com/uc?export=view&id=${id}`;
      imageRes = await fetch(fallbackUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        },
      });
    }

    if (!imageRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch image from Google Drive' }, { status: imageRes.status });
    }

    const contentType = imageRes.headers.get('content-type') || 'image/jpeg';
    const buffer = await imageRes.arrayBuffer();

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error: any) {
    console.error('Error in drive-image proxy:', error);
    return NextResponse.json({ error: error.message || 'Internal proxy error' }, { status: 500 });
  }
}
