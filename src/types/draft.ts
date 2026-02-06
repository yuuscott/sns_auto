import type { Platform, GeneratedDrafts } from './platform';

export interface Generation {
  id: string;
  theme: string;
  reference_text: string | null;
  selected_platforms: Platform[];
  status: 'pending' | 'generating' | 'completed' | 'error';
  created_at: string;
  updated_at: string;
}

export interface PlatformDraft {
  id: string;
  generation_id: string;
  platform: Platform;
  generated_text: string | null;
  edited_text: string | null;
  image_prompt: string | null;
  image_url: string | null;
  image_aspect_ratio: string | null;
  is_text_edited: boolean;
  is_regenerated: boolean;
  created_at: string;
  updated_at: string;
}

export interface ImageAsset {
  id: string;
  draft_id: string;
  storage_path: string;
  public_url: string;
  aspect_ratio: string;
  width: number | null;
  height: number | null;
  file_size_bytes: number | null;
  mime_type: string;
  created_at: string;
}

export interface GenerationWithDrafts extends Generation {
  platform_drafts: PlatformDraft[];
}

export interface DraftState {
  generation: Generation | null;
  drafts: GeneratedDrafts | null;
  platformDrafts: Record<Platform, PlatformDraft | null>;
  isGeneratingText: boolean;
  isGeneratingImage: Record<Platform, boolean>;
  error: string | null;
}
