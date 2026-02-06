import { HistoryStorage } from './types';
import { LocalHistoryStorage } from './localStorage';

export * from './types';
export { LocalHistoryStorage } from './localStorage';

// シングルトンインスタンス
let storageInstance: HistoryStorage | null = null;

// ストレージインスタンスを取得
// 将来的にSupabaseに切り替える場合はここを変更
export function getHistoryStorage(): HistoryStorage {
  if (!storageInstance) {
    storageInstance = new LocalHistoryStorage();
  }
  return storageInstance;
}
