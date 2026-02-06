'use client';

import Link from 'next/link';
import { Trash2, Instagram, FileText, Twitter, Music, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { Platform } from '@/types/platform';
import type { StoredGeneration } from '@/lib/storage/types';

interface HistoryCardProps {
  generation: StoredGeneration;
  onDelete: (id: string) => void;
}

// 相対時間を計算
function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'たった今';
  if (diffMin < 60) return `${diffMin}分前`;
  if (diffHour < 24) return `${diffHour}時間前`;
  if (diffDay < 7) return `${diffDay}日前`;

  return date.toLocaleDateString('ja-JP', {
    month: 'short',
    day: 'numeric',
  });
}

// プラットフォームアイコンを取得
function PlatformIcon({ platform }: { platform: Platform }) {
  const iconProps = { className: 'h-4 w-4' };

  switch (platform) {
    case 'instagram':
      return <Instagram {...iconProps} style={{ color: '#E4405F' }} />;
    case 'note':
      return <FileText {...iconProps} style={{ color: '#41C9B4' }} />;
    case 'x_twitter':
      return <Twitter {...iconProps} />;
    case 'tiktok':
      return <Music {...iconProps} />;
    default:
      return null;
  }
}

export function HistoryCard({ generation, onDelete }: HistoryCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('この履歴を削除してもええ？')) {
      onDelete(generation.id);
    }
  };

  return (
    <Link href={`/history/${generation.id}`}>
      <Card className="group hover:shadow-md transition-shadow cursor-pointer">
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {/* テーマ */}
              <h3 className="font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                {generation.theme}
              </h3>

              {/* 日時 */}
              <p className="text-sm text-gray-500 mt-1">
                {getRelativeTime(generation.createdAt)}
              </p>
            </div>

            {/* 削除ボタン */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {/* プラットフォームアイコン */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              {generation.platforms.map((platform) => (
                <div
                  key={platform}
                  className="p-1.5 rounded-md bg-gray-100"
                  title={platform}
                >
                  <PlatformIcon platform={platform} />
                </div>
              ))}
            </div>

            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
          </div>
        </div>
      </Card>
    </Link>
  );
}
