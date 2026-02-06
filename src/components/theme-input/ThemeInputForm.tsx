'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { PlatformSelector } from './PlatformSelector';
import { ALL_PLATFORMS } from '@/lib/utils/platforms';
import type { Platform } from '@/types/platform';

export function ThemeInputForm() {
  const router = useRouter();
  const [theme, setTheme] = useState('');
  const [referenceText, setReferenceText] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] =
    useState<Platform[]>(ALL_PLATFORMS);
  const [showReference, setShowReference] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!theme.trim()) return;

    // クエリパラメータで生成画面に遷移
    const params = new URLSearchParams({
      theme: theme.trim(),
      platforms: selectedPlatforms.join(','),
    });
    if (referenceText.trim()) {
      params.set('ref', referenceText.trim());
    }
    router.push(`/create?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Textarea
        label="テーマ・トピック"
        placeholder="例：春のカフェ巡り、新商品のレビュー、朝活のススメ..."
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        className="min-h-[100px]"
      />

      {!showReference ? (
        <button
          type="button"
          onClick={() => setShowReference(true)}
          className="text-sm text-purple-600 hover:text-purple-800 font-medium transition-colors cursor-pointer"
        >
          + 参考テキストを追加
        </button>
      ) : (
        <Textarea
          label="参考テキスト（任意）"
          placeholder="参考にしてほしい情報やキーワードがあれば入力してください..."
          value={referenceText}
          onChange={(e) => setReferenceText(e.target.value)}
          className="min-h-[80px]"
        />
      )}

      <PlatformSelector
        selectedPlatforms={selectedPlatforms}
        onChange={setSelectedPlatforms}
      />

      <Button
        type="submit"
        size="lg"
        disabled={!theme.trim()}
        icon={<Sparkles className="h-5 w-5" />}
        className="w-full"
      >
        コンテンツを生成する
      </Button>
    </form>
  );
}
