'use client';

import { useEffect, useState, useCallback } from 'react';
import { History, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { HistoryCard } from '@/components/history/HistoryCard';
import { getHistoryStorage, StoredGeneration } from '@/lib/storage';

export default function HistoryPage() {
  const [generations, setGenerations] = useState<StoredGeneration[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 履歴を読み込み
  const loadHistory = useCallback(async () => {
    try {
      const storage = getHistoryStorage();
      const data = await storage.getGenerations();
      setGenerations(data);
    } catch (error) {
      console.error('履歴の読み込みに失敗:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // 履歴を削除
  const handleDelete = async (id: string) => {
    try {
      const storage = getHistoryStorage();
      await storage.deleteGeneration(id);
      setGenerations((prev) => prev.filter((g) => g.id !== id));
    } catch (error) {
      console.error('履歴の削除に失敗:', error);
    }
  };

  // 全履歴を削除
  const handleClearAll = async () => {
    if (!confirm('全ての履歴を削除してもええ？この操作は取り消せへんで。')) {
      return;
    }

    try {
      const storage = getHistoryStorage();
      await storage.clearAll();
      setGenerations([]);
    } catch (error) {
      console.error('履歴の全削除に失敗:', error);
    }
  };

  // 読み込み中
  if (isLoading) {
    return (
      <div className="flex flex-col items-center py-20">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-16 w-16 rounded-2xl bg-gray-200 mb-4" />
          <div className="h-6 w-32 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-48 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  // 履歴が空の場合
  if (generations.length === 0) {
    return (
      <div className="flex flex-col items-center py-20">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 mb-4">
          <History className="h-8 w-8 text-gray-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">生成履歴</h1>
        <p className="text-gray-500 mb-6 text-center">
          まだ履歴がないで！
          <br />
          新しいコンテンツを作成してみよか。
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-purple-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          新しいコンテンツを作成
        </Link>
      </div>
    );
  }

  // 履歴一覧
  return (
    <div>
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">生成履歴</h1>
          <p className="text-sm text-gray-500 mt-1">
            {generations.length}件の履歴
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="text-gray-500 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            全削除
          </Button>
          <Link href="/">
            <Button variant="primary" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              新規作成
            </Button>
          </Link>
        </div>
      </div>

      {/* 履歴リスト */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {generations.map((generation) => (
          <HistoryCard
            key={generation.id}
            generation={generation}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
