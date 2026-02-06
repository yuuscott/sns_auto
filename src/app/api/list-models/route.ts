import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function GET() {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

    // 利用可能なモデル一覧を取得
    const models = await ai.models.list();

    // 画像生成に対応してそうなモデルをフィルタリング
    const imageModels = [];
    for await (const model of models) {
      const name = model.name || '';
      if (name.includes('imagen') || name.includes('image')) {
        imageModels.push({
          name: model.name,
          displayName: model.displayName,
          supportedGenerationMethods: model.supportedGenerationMethods,
        });
      }
    }

    return NextResponse.json({
      imageModels,
      allModelsCount: 'Check server logs for full list'
    });
  } catch (error) {
    console.error('モデル一覧取得エラー:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
