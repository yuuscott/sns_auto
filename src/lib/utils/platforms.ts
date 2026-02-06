import type { Platform, PlatformConfig } from '@/types/platform';

export const PLATFORM_CONFIGS: Record<Platform, PlatformConfig> = {
  instagram: {
    id: 'instagram',
    name: 'instagram',
    displayName: 'Instagram',
    icon: 'Instagram',
    color: '#E4405F',
    aspectRatio: '1:1',
    imageSize: '1080x1080',
    description: 'キャプション + ハッシュタグ',
  },
  note: {
    id: 'note',
    name: 'note',
    displayName: 'note',
    icon: 'FileText',
    color: '#41C9B4',
    aspectRatio: '16:9',
    imageSize: '1280x670',
    description: '記事形式（タイトル + 本文）',
  },
  x_twitter: {
    id: 'x_twitter',
    name: 'x_twitter',
    displayName: 'X (Twitter)',
    icon: 'Twitter',
    color: '#000000',
    maxLength: 140,
    aspectRatio: '16:9',
    imageSize: '1200x675',
    description: 'ツイート（140文字）+ スレッド対応',
  },
  tiktok: {
    id: 'tiktok',
    name: 'tiktok',
    displayName: 'TikTok',
    icon: 'Music',
    color: '#000000',
    maxLength: 150,
    aspectRatio: '9:16',
    imageSize: '1080x1920',
    description: 'キャプション + トレンドハッシュタグ',
  },
};

export const ALL_PLATFORMS: Platform[] = ['instagram', 'note', 'x_twitter', 'tiktok'];

export function getPlatformConfig(platform: Platform): PlatformConfig {
  return PLATFORM_CONFIGS[platform];
}

export function getPlatformColor(platform: Platform): string {
  return PLATFORM_CONFIGS[platform].color;
}
