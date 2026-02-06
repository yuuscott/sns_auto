import { NextResponse } from 'next/server';
import { generateSNSContent } from '@/lib/ai/gemini-text';
import type { GenerateTextRequest } from '@/types/api';

export async function POST(request: Request) {
  try {
    const body: GenerateTextRequest = await request.json();
    const { theme, referenceText, platforms } = body;

    if (!theme || !platforms || platforms.length === 0) {
      return NextResponse.json(
        { error: 'テーマとプラットフォームを指定してください' },
        { status: 400 }
      );
    }

    const drafts = await generateSNSContent(theme, platforms, referenceText);

    return NextResponse.json({ drafts });
  } catch (error) {
    console.error('テキスト生成エラー:', error);
    const message =
      error instanceof Error ? error.message : 'テキスト生成中にエラーが発生しました';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
