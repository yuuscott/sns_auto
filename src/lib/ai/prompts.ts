import type { Platform } from '@/types/platform';

/**
 * 全プラットフォーム分のテキスト + 画像プロンプトを1回で生成するためのプロンプト
 */
export function buildGenerationPrompt(
  theme: string,
  referenceText: string | undefined,
  platforms: Platform[]
): string {
  const platformInstructions = platforms
    .map((p) => getPlatformInstruction(p))
    .join('\n\n');

  return `あなたはSNSマーケティングの専門家です。以下のテーマについて、各SNSプラットフォームに最適化されたコンテンツを日本語で作成してください。

## テーマ
${theme}

${referenceText ? `## 参考情報\n${referenceText}\n` : ''}

## 各プラットフォームの要件

${platformInstructions}

## 出力形式

必ず以下のJSON形式のみで返してください（JSONの前後に余計なテキストは付けないでください）:

\`\`\`json
{
${platforms.map((p) => getJsonTemplate(p)).join(',\n')}
}
\`\`\`

## 注意事項
- すべて日本語で作成すること
- 各プラットフォームの特性に合わせて文体を変えること
- ハッシュタグは日本語と英語を混ぜてOK
- imagePromptは英語で、そのプラットフォームに適した雰囲気の画像を生成するためのプロンプトにすること
- imagePromptにはテーマの内容を反映させ、具体的で視覚的な描写にすること`;
}

function getPlatformInstruction(platform: Platform): string {
  switch (platform) {
    case 'instagram':
      return `### Instagram
- キャプション形式（改行を使って読みやすく）
- 絵文字を適度に使用してキャッチーに
- 関連ハッシュタグを10〜15個
- imagePrompt: 正方形（1:1）に適した、ビジュアルインパクトのある画像`;

    case 'note':
      return `### note
- 記事形式（タイトル＋本文の構成）
- 本文は800〜1200文字程度
- 見出しや段落分けで読みやすく
- 自分の体験や考えを織り交ぜた親しみやすい文体
- imagePrompt: 横長（16:9）のヘッダー画像に適した、記事のテーマを表す画像`;

    case 'x_twitter':
      return `### X (Twitter)
- 1ツイート目はインパクトのある内容（140文字以内）
- スレッド形式で3〜5ツイート
- 各ツイートは140文字以内
- ハッシュタグは最後のツイートに2〜3個
- imagePrompt: 横長（16:9）の、タイムラインで目を引く画像`;

    case 'tiktok':
      return `### TikTok
- 短くてキャッチーなキャプション（150文字以内）
- 動画の内容を想起させるテキスト
- トレンドに乗れるハッシュタグを5〜8個
- imagePrompt: 縦長（9:16）の、目を引くサムネイル画像`;
  }
}

function getJsonTemplate(platform: Platform): string {
  switch (platform) {
    case 'instagram':
      return `  "instagram": {
    "caption": "キャプションテキスト",
    "hashtags": ["ハッシュタグ1", "ハッシュタグ2"],
    "imagePrompt": "English image generation prompt for Instagram"
  }`;

    case 'note':
      return `  "note": {
    "title": "記事タイトル",
    "body": "記事本文（Markdown形式可）",
    "imagePrompt": "English image generation prompt for note header"
  }`;

    case 'x_twitter':
      return `  "x_twitter": {
    "tweets": ["1ツイート目", "2ツイート目", "3ツイート目"],
    "imagePrompt": "English image generation prompt for X/Twitter"
  }`;

    case 'tiktok':
      return `  "tiktok": {
    "caption": "キャプションテキスト",
    "hashtags": ["ハッシュタグ1", "ハッシュタグ2"],
    "imagePrompt": "English image generation prompt for TikTok thumbnail"
  }`;
  }
}
