import type { Platform, GeneratedDrafts } from './platform';

// テキスト生成API
export interface GenerateTextRequest {
  theme: string;
  referenceText?: string;
  platforms: Platform[];
}

export interface GenerateTextResponse {
  drafts: GeneratedDrafts;
}

// 画像生成API
export interface GenerateImageRequest {
  prompt: string;
  platform: Platform;
  aspectRatio?: string;
}

export interface GenerateImageResponse {
  imageData: string;  // base64
  mimeType: string;
}

// 画像アップロードAPI
export interface UploadImageRequest {
  imageData: string;  // base64
  platform: Platform;
  generationId: string;
}

export interface UploadImageResponse {
  url: string;
  path: string;
}

// 下書きAPI
export interface SaveDraftRequest {
  generationId: string;
  platform: Platform;
  editedText: string;
}

// エラーレスポンス
export interface ApiErrorResponse {
  error: string;
  details?: string;
}
