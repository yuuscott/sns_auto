import { History } from 'lucide-react';
import Link from 'next/link';

export default function HistoryPage() {
  return (
    <div className="flex flex-col items-center py-20">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 mb-4">
        <History className="h-8 w-8 text-gray-400" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">生成履歴</h1>
      <p className="text-gray-500 mb-6 text-center">
        Supabaseを接続すると、過去の生成結果がここに表示されます。
        <br />
        現在はローカルモードで動作しています。
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-purple-700 transition-colors"
      >
        新しいコンテンツを作成
      </Link>
    </div>
  );
}
