'use client';

import { cn } from '@/lib/utils/cn';
import { CheckCircle, XCircle, X } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';

export type ToastType = 'success' | 'error';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  }, [onClose]);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(handleClose, duration);
    return () => clearTimeout(timer);
  }, [duration, handleClose]);

  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-xl px-4 py-3 shadow-lg transition-all duration-300',
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0',
        type === 'success' && 'bg-green-50 text-green-800 border border-green-200',
        type === 'error' && 'bg-red-50 text-red-800 border border-red-200'
      )}
    >
      {type === 'success' ? (
        <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
      ) : (
        <XCircle className="h-5 w-5 text-red-600 shrink-0" />
      )}
      <p className="text-sm font-medium">{message}</p>
      <button
        onClick={handleClose}
        className="ml-2 shrink-0 rounded-full p-1 hover:bg-black/5 transition-colors cursor-pointer"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

// Toastの状態管理用のカスタムフック
export interface ToastState {
  message: string;
  type: ToastType;
  id: number;
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { message, type, id }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, showToast, removeToast };
}
