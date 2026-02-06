import { GoogleGenAI } from '@google/genai';
import type { Platform } from '@/types/platform';

function getClient() {
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
}

/**
 * プラットフォーム別のデフォルトアスペクト比
 */
export const PLATFORM_IMAGE_DEFAULTS: Record<
  Platform,
  { aspectRatio: string; label: string }
> = {
  instagram: { aspectRatio: '1:1', label: '1080x1080' },
  note: { aspectRatio: '16:9', label: '1280x670' },
  x_twitter: { aspectRatio: '16:9', label: '1200x675' },
  tiktok: { aspectRatio: '9:16', label: '1080x1920' },
};

/**
 * Imagen 3 で画像を生成する
 */
export async function generateImage(
  prompt: string,
  aspectRatio: string = '1:1'
): Promise<{ data: string; mimeType: string } | null> {
  try {
    const ai = getClient();

    // Imagen 3 を使用
    const response = await ai.models.generateImages({
      model: 'imagen-3.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        aspectRatio: aspectRatio,
      },
    });

    const images = response.generatedImages;
    if (!images || images.length === 0) return null;

    const image = images[0];
    if (image.image?.imageBytes) {
      return {
        data: image.image.imageBytes,
        mimeType: 'image/png',
      };
    }
    return null;
  } catch (error) {
    console.error('Imagen画像生成エラー:', error);
    throw error;
  }
}

/**
 * プラットフォームに合わせた画像を生成する
 */
export async function generatePlatformImage(
  prompt: string,
  platform: Platform
): Promise<{ data: string; mimeType: string } | null> {
  const config = PLATFORM_IMAGE_DEFAULTS[platform];
  return generateImage(prompt, config.aspectRatio);
}
