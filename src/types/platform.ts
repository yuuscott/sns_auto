export type Platform = 'instagram' | 'note' | 'x_twitter' | 'tiktok';

export interface PlatformConfig {
  id: Platform;
  name: string;
  displayName: string;
  icon: string;
  color: string;
  maxLength?: number;
  aspectRatio: string;
  imageSize: string;
  description: string;
}

export interface InstagramDraft {
  caption: string;
  hashtags: string[];
  imagePrompt: string;
}

export interface NoteDraft {
  title: string;
  body: string;
  imagePrompt: string;
}

export interface XTwitterDraft {
  tweets: string[];
  imagePrompt: string;
}

export interface TikTokDraft {
  caption: string;
  hashtags: string[];
  imagePrompt: string;
}

export interface GeneratedDrafts {
  instagram?: InstagramDraft;
  note?: NoteDraft;
  x_twitter?: XTwitterDraft;
  tiktok?: TikTokDraft;
}
