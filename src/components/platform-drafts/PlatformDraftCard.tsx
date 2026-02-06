'use client';

import { useState } from 'react';
import { Copy, Check, RefreshCw, Image as ImageIcon, Download } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { PLATFORM_CONFIGS } from '@/lib/utils/platforms';
import { copyToClipboard } from '@/lib/utils/clipboard';
import { downloadBase64Image } from '@/lib/utils/download';
import type { Platform } from '@/types/platform';

interface PlatformDraftCardProps {
  platform: Platform;
  text: string;
  hashtags?: string[];
  imagePrompt?: string;
  imageData?: string | null;
  imageMimeType?: string;
  isGeneratingImage?: boolean;
  onRegenerateText?: () => void;
  onGenerateImage?: () => void;
  isRegenerating?: boolean;
}

export function PlatformDraftCard({
  platform,
  text,
  hashtags,
  imagePrompt,
  imageData,
  imageMimeType,
  isGeneratingImage,
  onRegenerateText,
  onGenerateImage,
  isRegenerating,
}: PlatformDraftCardProps) {
  const [copied, setCopied] = useState(false);
  const [editedText, setEditedText] = useState(text);
  const config = PLATFORM_CONFIGS[platform];

  // コピーするテキスト（本文 + ハッシュタグ）
  const fullText = hashtags
    ? `${editedText}\n\n${hashtags.map((h) => `#${h}`).join(' ')}`
    : editedText;

  const handleCopy = async () => {
    const success = await copyToClipboard(fullText);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadImage = () => {
    if (imageData) {
      downloadBase64Image(
        imageData,
        `${platform}_${Date.now()}.png`,
        imageMimeType || 'image/png'
      );
    }
  };

  const charCount = editedText.length;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
      {/* ヘッダー */}
      <div
        className="flex items-center justify-between px-5 py-3 border-b border-gray-100"
        style={{ backgroundColor: `${config.color}08` }}
      >
        <div className="flex items-center gap-2">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: config.color }}
          />
          <h3 className="font-semibold text-gray-900">{config.displayName}</h3>
        </div>
        <div className="flex items-center gap-2">
          {onRegenerateText && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRegenerateText}
              isLoading={isRegenerating}
              icon={<RefreshCw className="h-3.5 w-3.5" />}
            >
              再生成
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            icon={
              copied ? (
                <Check className="h-3.5 w-3.5 text-green-600" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )
            }
          >
            {copied ? 'コピー済み!' : 'コピー'}
          </Button>
        </div>
      </div>

      {/* テキストエリア */}
      <div className="p-5">
        <Textarea
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          charCount={config.maxLength ? charCount : undefined}
          maxChars={config.maxLength}
          className="min-h-[150px] border-gray-200"
        />

        {/* ハッシュタグ */}
        {hashtags && hashtags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {hashtags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* 画像セクション */}
        <div className="mt-4 border-t border-gray-100 pt-4">
          {imageData ? (
            <div className="space-y-3">
              <div className="relative overflow-hidden rounded-xl border border-gray-200">
                <img
                  src={`data:${imageMimeType || 'image/png'};base64,${imageData}`}
                  alt={`${config.displayName}用画像`}
                  className="w-full object-cover"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadImage}
                  icon={<Download className="h-3.5 w-3.5" />}
                >
                  画像をダウンロード
                </Button>
                {onGenerateImage && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onGenerateImage}
                    isLoading={isGeneratingImage}
                    icon={<RefreshCw className="h-3.5 w-3.5" />}
                  >
                    再生成
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-6">
              {isGeneratingImage ? (
                <LoadingSpinner message="画像を生成中..." />
              ) : (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                    <ImageIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-400">
                    {config.imageSize} ({config.aspectRatio})
                  </p>
                  {onGenerateImage && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={onGenerateImage}
                      icon={<ImageIcon className="h-3.5 w-3.5" />}
                    >
                      画像を生成
                    </Button>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* 画像プロンプト表示 */}
        {imagePrompt && (
          <details className="mt-3">
            <summary className="cursor-pointer text-xs text-gray-400 hover:text-gray-600">
              画像プロンプトを表示
            </summary>
            <p className="mt-1 text-xs text-gray-400 bg-gray-50 rounded-lg p-2">
              {imagePrompt}
            </p>
          </details>
        )}
      </div>
    </div>
  );
}
