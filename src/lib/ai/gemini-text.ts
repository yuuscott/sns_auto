import { GoogleGenAI } from '@google/genai';
import { buildGenerationPrompt } from './prompts';
import type { Platform, GeneratedDrafts } from '@/types/platform';

function getClient() {
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
}

/**
 * Gemini APIを使って全プラットフォーム分のSNSコンテンツを生成する
 */
export async function generateSNSContent(
  theme: string,
  platforms: Platform[],
  referenceText?: string
): Promise<GeneratedDrafts> {
  const prompt = buildGenerationPrompt(theme, referenceText, platforms);

  const ai = getClient();
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
  });

  const text = response.text;
  if (!text) {
    throw new Error('Gemini APIからテキストレスポンスが返ってきませんでした');
  }

  // JSONブロックを抽出してパース
  const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[1]) as GeneratedDrafts;
  }

  // ```json が無い場合、直接JSONとしてパースを試みる
  try {
    return JSON.parse(text) as GeneratedDrafts;
  } catch {
    throw new Error('Gemini APIのレスポンスからJSONを解析できませんでした');
  }
}
