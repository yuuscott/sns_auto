'use client';

import { useEffect, useState, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { PlatformDraftCard } from '@/components/platform-drafts/PlatformDraftCard';
import { getHistoryStorage, StoredGeneration } from '@/lib/storage';
import type { Platform, GeneratedDrafts } from '@/types/platform';

interface HistoryDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function HistoryDetailPage({ params }: HistoryDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [generation, setGeneration] = useState<StoredGeneration | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // 履歴を読み込み
  const loadGeneration = useCallback(async () => {
    try {
      const storage = getHistoryStorage();
      const data = await storage.getGeneration(id);
      if (data) {
        setGeneration(data);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error('履歴の読み込みに失敗:', error);
      setNotFound(true);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadGeneration();
  }, [loadGeneration]);

  // 履歴を削除
  const handleDelete = async () => {
    if (!confirm('この履歴を削除してもええ？')) {
      return;
    }

    try {
      const storage = getHistoryStorage();
      await storage.deleteGeneration(id);
      router.push('/history');
    } catch (error) {
      console.error('履歴の削除に失敗:', error);
    }
  };

  // 再生成リンクを生成
  const getRegenerateUrl = () => {
    if (!generation) return '/';
    const params = new URLSearchParams({
      theme: generation.theme,
      platforms: generation.platforms.join(','),
    });
    if (generation.referenceText) {
      params.set('ref', generation.referenceText);
    }
    return `/create?${params.toString()}`;
  };

  // テキストを取得するヘルパー
  const getDraftText = (platform: Platform): string => {
    const draft = generation?.drafts?.[platform];
    if (!draft) return '';

    switch (platform) {
      case 'instagram':
        return (draft as GeneratedDrafts['instagram'])?.caption || '';
      case 'note': {
        const noteDraft = draft as GeneratedDrafts['note'];
        return noteDraft ? `${noteDraft.title}\n\n${noteDraft.body}` : '';
      }
      case 'x_twitter': {
        const xDraft = draft as GeneratedDrafts['x_twitter'];
        return xDraft?.tweets?.join('\n\n---\n\n') || '';
      }
      case 'tiktok':
        return (draft as GeneratedDrafts['tiktok'])?.caption || '';
      default:
        return '';
    }
  };

  const getHashtags = (platform: Platform): string[] | undefined => {
    const draft = generation?.drafts?.[platform];
    if (!draft) return undefined;

    if (platform === 'instagram' || platform === 'tiktok') {
      return (draft as { hashtags?: string[] }).hashtags;
    }
    return undefined;
  };

  const getImagePrompt = (platform: Platform): string | undefined => {
    const draft = generation?.drafts?.[platform];
    if (!draft) return undefined;
    return 'imagePrompt' in draft
      ? (draft as { imagePrompt?: string }).imagePrompt
      : undefined;
  };

  // 読み込み中
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" message="読み込み中..." />
      </div>
    );
  }

  // 見つからない場合
  if (notFound || !generation) {
    return (
      <div className="flex flex-col items-center py-20">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          履歴が見つかりません
        </h1>
        <p className="text-gray-500 mb-6">
          この履歴は削除されたか、存在しないで。
        </p>
        <Link href="/history">
          <Button variant="primary">履歴一覧に戻る</Button>
        </Link>
      </div>
    );
  }

  // 日時フォーマット
  const formattedDate = new Date(generation.createdAt).toLocaleString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div>
      {/* ヘッダー */}
      <div className="mb-8">
        <Link
          href="/history"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          履歴一覧に戻る
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {generation.theme}
            </h1>
            <p className="mt-1 text-sm text-gray-500">{formattedDate}</p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="text-gray-500 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              削除
            </Button>
            <Link href={getRegenerateUrl()}>
              <Button variant="primary" size="sm">
                <RefreshCw className="h-4 w-4 mr-1" />
                このテーマで再生成
              </Button>
            </Link>
          </div>
        </div>

        {/* 参考テキストがある場合 */}
        {generation.referenceText && (
          <div className="mt-4 p-3 rounded-lg bg-gray-50 border border-gray-200">
            <p className="text-xs text-gray-500 mb-1">参考テキスト</p>
            <p className="text-sm text-gray-700 whitespace-pre-wrap line-clamp-3">
              {generation.referenceText}
            </p>
          </div>
        )}
      </div>

      {/* 下書きカード */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {generation.platforms.map((platform) => (
          <PlatformDraftCard
            key={platform}
            platform={platform}
            text={getDraftText(platform)}
            hashtags={getHashtags(platform)}
            imagePrompt={getImagePrompt(platform)}
            // 履歴詳細では画像生成は無効
            isGeneratingImage={false}
            onGenerateImage={() => {
              // 履歴詳細では画像は再生成ページへ誘導
              alert('画像を生成するには「このテーマで再生成」を使ってや！');
            }}
            onRegenerateText={() => {
              router.push(getRegenerateUrl());
            }}
            isRegenerating={false}
          />
        ))}
      </div>
    </div>
  );
}
