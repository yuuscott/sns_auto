import { Platform, GeneratedDrafts } from '@/types/platform';

// 保存される生成データの型
export interface StoredGeneration {
  id: string;
  theme: string;
  referenceText: string | null;
  platforms: Platform[];
  drafts: GeneratedDrafts;
  createdAt: string; // ISO文字列
}

// 生成データ作成時の入力型
export interface GenerationCreateInput {
  theme: string;
  referenceText?: string;
  platforms: Platform[];
  drafts: GeneratedDrafts;
}

// ストレージ操作の共通インターフェース
export interface HistoryStorage {
  saveGeneration(data: GenerationCreateInput): Promise<StoredGeneration>;
  getGenerations(limit?: number): Promise<StoredGeneration[]>;
  getGeneration(id: string): Promise<StoredGeneration | null>;
  deleteGeneration(id: string): Promise<void>;
  clearAll(): Promise<void>;
}
