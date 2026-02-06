import { NextResponse } from 'next/server';
import { generatePlatformImage } from '@/lib/ai/nano-banana';
import type { GenerateImageRequest } from '@/types/api';

export async function POST(request: Request) {
  try {
    const body: GenerateImageRequest = await request.json();
    const { prompt, platform } = body;

    if (!prompt || !platform) {
      return NextResponse.json(
        { error: 'プロンプトとプラットフォームを指定してください' },
        { status: 400 }
      );
    }

    const result = await generatePlatformImage(prompt, platform);

    if (!result) {
      return NextResponse.json(
        { error: '画像の生成に失敗しました。もう一度お試しください。' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      imageData: result.data,
      mimeType: result.mimeType,
    });
  } catch (error) {
    console.error('画像生成エラー:', error);
    const message =
      error instanceof Error ? error.message : '画像生成中にエラーが発生しました';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
