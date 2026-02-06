-- =============================================
-- SNS Content Creator - 初期スキーマ
-- =============================================

-- 生成セッション
CREATE TABLE IF NOT EXISTS generations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  theme TEXT NOT NULL,
  reference_text TEXT,
  selected_platforms TEXT[] NOT NULL DEFAULT '{"instagram","note","x_twitter","tiktok"}',
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'generating', 'completed', 'error')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- プラットフォーム別下書き
CREATE TABLE IF NOT EXISTS platform_drafts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  generation_id UUID NOT NULL REFERENCES generations(id) ON DELETE CASCADE,
  platform TEXT NOT NULL
    CHECK (platform IN ('instagram', 'note', 'x_twitter', 'tiktok')),
  generated_text TEXT,
  edited_text TEXT,
  image_prompt TEXT,
  image_url TEXT,
  image_aspect_ratio TEXT,
  is_text_edited BOOLEAN DEFAULT FALSE,
  is_regenerated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(generation_id, platform)
);

-- 生成画像管理
CREATE TABLE IF NOT EXISTS image_assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  draft_id UUID NOT NULL REFERENCES platform_drafts(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  aspect_ratio TEXT NOT NULL,
  width INT,
  height INT,
  file_size_bytes INT,
  mime_type TEXT DEFAULT 'image/png',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS有効化
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE image_assets ENABLE ROW LEVEL SECURITY;

-- 個人ツール用：全操作許可ポリシー
CREATE POLICY "Allow all for generations" ON generations FOR ALL USING (true);
CREATE POLICY "Allow all for platform_drafts" ON platform_drafts FOR ALL USING (true);
CREATE POLICY "Allow all for image_assets" ON image_assets FOR ALL USING (true);

-- Storage bucket（Supabase Dashboard or CLIで作成）
-- INSERT INTO storage.buckets (id, name, public) VALUES ('generated-images', 'generated-images', true);
