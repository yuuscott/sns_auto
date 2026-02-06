'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { PlatformDraftCard } from '@/components/platform-drafts/PlatformDraftCard';
import { Toast, useToast } from '@/components/ui/Toast';
import type { Platform, GeneratedDrafts } from '@/types/platform';
import type { GenerateTextResponse, GenerateImageResponse } from '@/types/api';

function CreatePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toasts, showToast, removeToast } = useToast();

  const theme = searchParams.get('theme') || '';
  const platformsParam = searchParams.get('platforms') || '';
  const referenceText = searchParams.get('ref') || '';

  const platforms = platformsParam.split(',').filter(Boolean) as Platform[];

  const [drafts, setDrafts] = useState<GeneratedDrafts | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // プラットフォームごとの画像データ
  const [images, setImages] = useState<
    Record<string, { data: string; mimeType: string } | null>
  >({});
  const [generatingImages, setGeneratingImages] = useState<
    Record<string, boolean>
  >({});

  const generateText = useCallback(async () => {
    if (!theme || platforms.length === 0) return;

    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch('/api/generate-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme,
          referenceText: referenceText || undefined,
          platforms,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'テキスト生成に失敗しました');
      }

      const data: GenerateTextResponse = await res.json();
      setDrafts(data.drafts);
      showToast('テキストの生成が完了しました！', 'success');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'テキスト生成中にエラーが発生しました';
      setError(message);
      showToast(message, 'error');
    } finally {
      setIsGenerating(false);
    }
  }, [theme, referenceText, platforms, showToast]);

  // 初回テキスト生成
  useEffect(() => {
    if (theme && platforms.length > 0 && !drafts && !isGenerating) {
      generateText();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 画像生成
  const generateImage = async (platform: Platform) => {
    const draft = drafts?.[platform];
    if (!draft) return;

    const imagePrompt = 'imagePrompt' in draft ? draft.imagePrompt : undefined;
    if (!imagePrompt) return;

    setGeneratingImages((prev) => ({ ...prev, [platform]: true }));

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: imagePrompt, platform }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || '画像生成に失敗しました');
      }

      const data: GenerateImageResponse = await res.json();
      setImages((prev) => ({
        ...prev,
        [platform]: { data: data.imageData, mimeType: data.mimeType },
      }));
      showToast(`${platform}の画像を生成しました！`, 'success');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '画像生成中にエラーが発生しました';
      showToast(message, 'error');
    } finally {
      setGeneratingImages((prev) => ({ ...prev, [platform]: false }));
    }
  };

  // テーマが無い場合はホームに戻す
  if (!theme) {
    router.push('/');
    return null;
  }

  // テキストを取得するヘルパー
  const getDraftText = (platform: Platform): string => {
    const draft = drafts?.[platform];
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
    const draft = drafts?.[platform];
    if (!draft) return undefined;

    if (platform === 'instagram' || platform === 'tiktok') {
      return (draft as { hashtags?: string[] }).hashtags;
    }
    return undefined;
  };

  const getImagePrompt = (platform: Platform): string | undefined => {
    const draft = drafts?.[platform];
    if (!draft) return undefined;
    return 'imagePrompt' in draft ? (draft as { imagePrompt?: string }).imagePrompt : undefined;
  };

  return (
    <div>
      {/* ヘッダー */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          ホームに戻る
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">生成結果</h1>
            <p className="mt-1 text-gray-500">
              テーマ：
              <span className="font-medium text-gray-700">{theme}</span>
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={generateText}
            isLoading={isGenerating}
            icon={<Sparkles className="h-4 w-4" />}
          >
            全体を再生成
          </Button>
        </div>
      </div>

      {/* 生成中 */}
      {isGenerating && !drafts && (
        <div className="flex flex-col items-center justify-center py-20">
          <LoadingSpinner size="lg" message="AIがコンテンツを生成中..." />
          <p className="mt-4 text-sm text-gray-400">
            各プラットフォーム向けに最適化しています
          </p>
        </div>
      )}

      {/* エラー */}
      {error && !drafts && (
        <div className="flex flex-col items-center gap-4 py-20">
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-red-800 font-medium">{error}</p>
            <p className="mt-2 text-sm text-red-600">
              APIキーの設定を確認してください
            </p>
          </div>
          <Button variant="primary" onClick={generateText}>
            もう一度試す
          </Button>
        </div>
      )}

      {/* 下書きカード */}
      {drafts && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {platforms.map((platform) => (
            <PlatformDraftCard
              key={platform}
              platform={platform}
              text={getDraftText(platform)}
              hashtags={getHashtags(platform)}
              imagePrompt={getImagePrompt(platform)}
              imageData={images[platform]?.data}
              imageMimeType={images[platform]?.mimeType}
              isGeneratingImage={generatingImages[platform]}
              onGenerateImage={() => generateImage(platform)}
              onRegenerateText={generateText}
              isRegenerating={isGenerating}
            />
          ))}
        </div>
      )}

      {/* Toast通知 */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}

export default function CreatePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" message="読み込み中..." />
        </div>
      }
    >
      <CreatePageContent />
    </Suspense>
  );
}
