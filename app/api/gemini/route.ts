import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, systemInstruction } = body;

    // Get API Key from environment or request headers
    const apiKey = process.env.GEMINI_API_KEY || req.headers.get('x-gemini-key');

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Chưa cấu hình API Key cho Gemini. Vui lòng cấu hình GEMINI_API_KEY trong file .env hoặc nhập trực tiếp.' },
        { status: 400 }
      );
    }

    // Call official Gemini API (using gemini-2.5-flash as default high-performance fast model)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        systemInstruction: systemInstruction ? {
          parts: [{ text: systemInstruction }]
        } : undefined,
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 2048,
        }
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json(
        { error: `Lỗi kết nối Gemini API: ${errText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return NextResponse.json({ text: generatedText });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Lỗi máy chủ không xác định' },
      { status: 500 }
    );
  }
}
