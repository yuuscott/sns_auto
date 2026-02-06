'use client';

import { cn } from '@/lib/utils/cn';
import type { TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  charCount?: number;
  maxChars?: number;
}

export function Textarea({
  label,
  error,
  charCount,
  maxChars,
  className,
  ...props
}: TextareaProps) {
  const isOverLimit = maxChars && charCount ? charCount > maxChars : false;

  return (
    <div className="w-full">
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <textarea
        className={cn(
          'w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400',
          'transition-all duration-200',
          'focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20',
          'resize-y min-h-[120px]',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
          className
        )}
        {...props}
      />
      <div className="mt-1 flex items-center justify-between">
        {error && <p className="text-sm text-red-600">{error}</p>}
        {maxChars && charCount !== undefined && (
          <p
            className={cn(
              'ml-auto text-sm',
              isOverLimit ? 'text-red-600 font-medium' : 'text-gray-400'
            )}
          >
            {charCount}/{maxChars}
          </p>
        )}
      </div>
    </div>
  );
}
