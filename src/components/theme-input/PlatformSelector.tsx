'use client';

import { cn } from '@/lib/utils/cn';
import { PLATFORM_CONFIGS, ALL_PLATFORMS } from '@/lib/utils/platforms';
import { Instagram, FileText, Twitter, Music } from 'lucide-react';
import type { Platform } from '@/types/platform';

const PLATFORM_ICONS: Record<Platform, React.ComponentType<{ className?: string }>> = {
  instagram: Instagram,
  note: FileText,
  x_twitter: Twitter,
  tiktok: Music,
};

interface PlatformSelectorProps {
  selectedPlatforms: Platform[];
  onChange: (platforms: Platform[]) => void;
}

export function PlatformSelector({
  selectedPlatforms,
  onChange,
}: PlatformSelectorProps) {
  const togglePlatform = (platform: Platform) => {
    if (selectedPlatforms.includes(platform)) {
      // 最低1つは選択
      if (selectedPlatforms.length > 1) {
        onChange(selectedPlatforms.filter((p) => p !== platform));
      }
    } else {
      onChange([...selectedPlatforms, platform]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        投稿するプラットフォーム
      </label>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {ALL_PLATFORMS.map((platform) => {
          const config = PLATFORM_CONFIGS[platform];
          const Icon = PLATFORM_ICONS[platform];
          const isSelected = selectedPlatforms.includes(platform);

          return (
            <button
              key={platform}
              type="button"
              onClick={() => togglePlatform(platform)}
              className={cn(
                'flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all duration-200 cursor-pointer',
                isSelected
                  ? 'border-purple-500 bg-purple-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
              )}
            >
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
                  isSelected ? 'bg-purple-100' : 'bg-gray-100'
                )}
              >
                <Icon
                  className={cn(
                    'h-5 w-5',
                    isSelected ? 'text-purple-600' : 'text-gray-500'
                  )}
                />
              </div>
              <div className="text-center">
                <p
                  className={cn(
                    'text-sm font-medium',
                    isSelected ? 'text-purple-700' : 'text-gray-700'
                  )}
                >
                  {config.displayName}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{config.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
