-- v8: AI データ収集フィールド

-- events: イベント分類
ALTER TABLE events ADD COLUMN IF NOT EXISTS event_type  text;
ALTER TABLE events ADD COLUMN IF NOT EXISTS target_age  text;
ALTER TABLE events ADD COLUMN IF NOT EXISTS venue_type  text;
ALTER TABLE events ADD COLUMN IF NOT EXISTS prefecture  text;

-- event_contents: キャンセル理由
ALTER TABLE event_contents ADD COLUMN IF NOT EXISTS cancel_reason text;

-- event_tasks: テンプレート参照
ALTER TABLE event_tasks ADD COLUMN IF NOT EXISTS template_task_id text;

-- event_reports: 詳細スコア・来場率
ALTER TABLE event_reports ADD COLUMN IF NOT EXISTS content_score    integer;
ALTER TABLE event_reports ADD COLUMN IF NOT EXISTS venue_score      integer;
ALTER TABLE event_reports ADD COLUMN IF NOT EXISTS operation_score  integer;
ALTER TABLE event_reports ADD COLUMN IF NOT EXISTS attendance_rate  numeric(5,2);

-- カタログ閲覧トラッキング
CREATE TABLE IF NOT EXISTS catalog_views (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  catalog_id  text        NOT NULL,
  event_id    uuid        REFERENCES events(id) ON DELETE SET NULL,
  viewed_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE catalog_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users insert catalog views" ON catalog_views
  FOR INSERT WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "users read own catalog views" ON catalog_views
  FOR SELECT USING (user_id = auth.uid());
