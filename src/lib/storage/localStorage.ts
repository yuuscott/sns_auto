import {
  HistoryStorage,
  StoredGeneration,
  GenerationCreateInput,
} from './types';

const STORAGE_KEY = 'sns_history';
const MAX_ITEMS = 50;

// UUID生成（簡易版）
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// localStorageから履歴を取得
function getStoredData(): StoredGeneration[] {
  if (typeof window === 'undefined') return [];

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data) as StoredGeneration[];
  } catch {
    console.error('履歴の読み込みに失敗したで');
    return [];
  }
}

// localStorageに履歴を保存
function setStoredData(data: StoredGeneration[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('履歴の保存に失敗したで:', error);
    // 容量超過の場合、古いデータを削除して再試行
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      const reduced = data.slice(0, Math.floor(data.length / 2));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reduced));
    }
  }
}

export class LocalHistoryStorage implements HistoryStorage {
  async saveGeneration(input: GenerationCreateInput): Promise<StoredGeneration> {
    const newGeneration: StoredGeneration = {
      id: generateId(),
      theme: input.theme,
      referenceText: input.referenceText || null,
      platforms: input.platforms,
      drafts: input.drafts,
      createdAt: new Date().toISOString(),
    };

    // 既存データを取得して先頭に追加
    const existing = getStoredData();
    const updated = [newGeneration, ...existing];

    // 最大件数を超えたら古いものを削除
    if (updated.length > MAX_ITEMS) {
      updated.splice(MAX_ITEMS);
    }

    setStoredData(updated);
    return newGeneration;
  }

  async getGenerations(limit?: number): Promise<StoredGeneration[]> {
    const data = getStoredData();
    if (limit && limit > 0) {
      return data.slice(0, limit);
    }
    return data;
  }

  async getGeneration(id: string): Promise<StoredGeneration | null> {
    const data = getStoredData();
    return data.find((item) => item.id === id) || null;
  }

  async deleteGeneration(id: string): Promise<void> {
    const data = getStoredData();
    const filtered = data.filter((item) => item.id !== id);
    setStoredData(filtered);
  }

  async clearAll(): Promise<void> {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  }
}
