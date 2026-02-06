import { ThemeInputForm } from '@/components/theme-input/ThemeInputForm';
import { Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center">
      {/* ヒーローセクション */}
      <div className="mb-10 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-purple-50 px-4 py-2 text-sm font-medium text-purple-700">
          <Sparkles className="h-4 w-4" />
          AI搭載SNSコンテンツ一括生成
        </div>
        <h1 className="mb-3 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            1つのテーマ
          </span>
          から
          <br />
          全SNSの投稿を作成
        </h1>
        <p className="mx-auto max-w-lg text-lg text-gray-500">
          テーマを入力するだけで、Instagram・note・X・TikTok向けの
          テキストと画像を自動生成。コピペですぐ投稿できます。
        </p>
      </div>

      {/* 入力フォーム */}
      <div className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <ThemeInputForm />
      </div>

      {/* 使い方ステップ */}
      <div className="mt-16 grid w-full max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3">
        {[
          {
            step: '1',
            title: 'テーマを入力',
            desc: '投稿したいテーマやトピックを入力するだけ',
          },
          {
            step: '2',
            title: 'AIが生成',
            desc: '各SNSに最適化されたテキストと画像をAIが作成',
          },
          {
            step: '3',
            title: 'コピペで投稿',
            desc: 'テキストをコピー、画像をダウンロードして投稿',
          },
        ].map(({ step, title, desc }) => (
          <div key={step} className="text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-lg font-bold text-white">
              {step}
            </div>
            <h3 className="mb-1 font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
