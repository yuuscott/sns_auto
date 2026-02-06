import Anthropic from '@anthropic-ai/sdk';
import { buildGenerationPrompt } from './prompts';
import type { Platform, GeneratedDrafts } from '@/types/platform';

function getClient() {
  return new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!,
  });
}

/**
 * Claude APIを使って全プラットフォーム分のSNSコンテンツを生成する
 */
export async function generateSNSContent(
  theme: string,
  platforms: Platform[],
  referenceText?: string
): Promise<GeneratedDrafts> {
  const prompt = buildGenerationPrompt(theme, referenceText, platforms);

  const client = getClient();
  const message = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  });

  const textContent = message.content.find((c) => c.type === 'text');
  if (!textContent || textContent.type !== 'text') {
    throw new Error('Claude APIからテキストレスポンスが返ってきませんでした');
  }

  // JSONブロックを抽出してパース
  const jsonMatch = textContent.text.match(/```json\n([\s\S]*?)\n```/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[1]) as GeneratedDrafts;
  }

  // ```json が無い場合、直接JSONとしてパースを試みる
  try {
    return JSON.parse(textContent.text) as GeneratedDrafts;
  } catch {
    throw new Error('Claude APIのレスポンスからJSONを解析できませんでした');
  }
}
