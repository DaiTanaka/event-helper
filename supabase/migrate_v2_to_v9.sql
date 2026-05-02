-- 一括マイグレーション v2〜v9
-- 既存のテーブル・カラム・ポリシーは IF NOT EXISTS / DO $$ でスキップされます

-- ============================================================
-- v2: setup/teardown日、venue_access、schedule_type、contacts、Q&A
-- ============================================================

ALTER TABLE events ADD COLUMN IF NOT EXISTS setup_date date;
ALTER TABLE events ADD COLUMN IF NOT EXISTS teardown_date date;
ALTER TABLE events ADD COLUMN IF NOT EXISTS venue_access text;

ALTER TABLE event_schedules ADD COLUMN IF NOT EXISTS schedule_type text;

CREATE TABLE IF NOT EXISTS event_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name text NOT NULL,
  role text,
  company text,
  phone text,
  email text,
  notes text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE event_contacts ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'event_contacts' AND policyname = 'Users can manage their own event contacts'
  ) THEN
    CREATE POLICY "Users can manage their own event contacts" ON event_contacts
      USING (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()));
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS event_qa (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  question text NOT NULL,
  answer text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE event_qa ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'event_qa' AND policyname = 'Users can manage their own event QA'
  ) THEN
    CREATE POLICY "Users can manage their own event QA" ON event_qa
      USING (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()));
  END IF;
END $$;

-- ============================================================
-- v3: タスク管理
-- ============================================================

CREATE TABLE IF NOT EXISTS event_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  assignee text,
  start_date date,
  due_date date,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE event_tasks ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'event_tasks' AND policyname = 'Users can manage their own event tasks'
  ) THEN
    CREATE POLICY "Users can manage their own event tasks" ON event_tasks FOR ALL
      USING (EXISTS (SELECT 1 FROM events e WHERE e.id = event_tasks.event_id AND e.user_id = auth.uid()));
  END IF;
END $$;

-- ============================================================
-- v4: コンテンツ管理
-- ============================================================

CREATE TABLE IF NOT EXISTS event_contents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  catalog_id text,
  title text NOT NULL,
  category text,
  company_name text,
  estimated_cost int,
  actual_cost int,
  status text NOT NULL DEFAULT 'considering'
    CHECK (status IN ('considering', 'confirmed', 'cancelled')),
  notes text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE event_contents ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'event_contents' AND policyname = 'Users can manage their own event contents'
  ) THEN
    CREATE POLICY "Users can manage their own event contents" ON event_contents FOR ALL
      USING (EXISTS (SELECT 1 FROM events e WHERE e.id = event_contents.event_id AND e.user_id = auth.uid()));
  END IF;
END $$;

-- ============================================================
-- v5: カタログ・タスクテンプレート
-- ============================================================

ALTER TABLE event_contents ADD COLUMN IF NOT EXISTS url text;
ALTER TABLE event_contents ADD COLUMN IF NOT EXISTS og_image_url text;

CREATE TABLE IF NOT EXISTS catalog_items (
  id text PRIMARY KEY,
  title text NOT NULL,
  category text NOT NULL,
  company_name text NOT NULL,
  price_from int,
  price_to int,
  description text NOT NULL DEFAULT '',
  tags text[] NOT NULL DEFAULT '{}',
  is_piqton boolean NOT NULL DEFAULT false,
  is_ad boolean NOT NULL DEFAULT false,
  contact_url text,
  url text,
  og_image_url text,
  sort_order int NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS task_template_categories (
  id text PRIMARY KEY,
  label text NOT NULL,
  color text NOT NULL,
  sort_order int NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS task_template_tasks (
  id text PRIMARY KEY,
  title text NOT NULL,
  category_id text NOT NULL REFERENCES task_template_categories(id) ON DELETE CASCADE,
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  start_days int,
  due_days int,
  sort_order int NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true
);

-- ============================================================
-- v6: カタログ掲載期間
-- ============================================================

ALTER TABLE catalog_items ADD COLUMN IF NOT EXISTS display_start_date date;
ALTER TABLE catalog_items ADD COLUMN IF NOT EXISTS display_end_date date;

-- ============================================================
-- v7: 予算管理・報告書
-- ============================================================

ALTER TABLE events ADD COLUMN IF NOT EXISTS total_budget integer;

CREATE TABLE IF NOT EXISTS event_budget_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  category text NOT NULL DEFAULT 'その他',
  name text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  unit_price integer NOT NULL DEFAULT 0,
  actual_price integer,
  notes text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE event_budget_items ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'event_budget_items' AND policyname = 'users own budget items'
  ) THEN
    CREATE POLICY "users own budget items" ON event_budget_items
      USING (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()));
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS event_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  actual_visitors integer,
  total_revenue integer,
  total_expense integer,
  summary text,
  highlights text,
  improvements text,
  next_actions text,
  satisfaction_score numeric(3,1),
  weather text,
  report_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(event_id)
);
ALTER TABLE event_reports ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'event_reports' AND policyname = 'users own reports'
  ) THEN
    CREATE POLICY "users own reports" ON event_reports
      USING (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()));
  END IF;
END $$;

-- ============================================================
-- v8: AI データ収集フィールド
-- ============================================================

ALTER TABLE events ADD COLUMN IF NOT EXISTS event_type text;
ALTER TABLE events ADD COLUMN IF NOT EXISTS target_age text;
ALTER TABLE events ADD COLUMN IF NOT EXISTS venue_type text;
ALTER TABLE events ADD COLUMN IF NOT EXISTS prefecture text;

ALTER TABLE event_contents ADD COLUMN IF NOT EXISTS cancel_reason text;
ALTER TABLE event_tasks ADD COLUMN IF NOT EXISTS template_task_id text;

ALTER TABLE event_reports ADD COLUMN IF NOT EXISTS content_score integer;
ALTER TABLE event_reports ADD COLUMN IF NOT EXISTS venue_score integer;
ALTER TABLE event_reports ADD COLUMN IF NOT EXISTS operation_score integer;
ALTER TABLE event_reports ADD COLUMN IF NOT EXISTS attendance_rate numeric(5,2);

CREATE TABLE IF NOT EXISTS catalog_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  catalog_id text NOT NULL,
  event_id uuid REFERENCES events(id) ON DELETE SET NULL,
  viewed_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE catalog_views ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'catalog_views' AND policyname = 'users insert catalog views'
  ) THEN
    CREATE POLICY "users insert catalog views" ON catalog_views
      FOR INSERT WITH CHECK (user_id = auth.uid() OR user_id IS NULL);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'catalog_views' AND policyname = 'users read own catalog views'
  ) THEN
    CREATE POLICY "users read own catalog views" ON catalog_views
      FOR SELECT USING (user_id = auth.uid());
  END IF;
END $$;

-- ============================================================
-- v9: ユーザープロフィール（未適用 → これが原因）
-- ============================================================

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization text,
  industry text,
  role text,
  prefecture text,
  events_per_year text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'user_profiles' AND policyname = 'users manage own profile'
  ) THEN
    CREATE POLICY "users manage own profile" ON user_profiles
      FOR ALL USING (id = auth.uid()) WITH CHECK (id = auth.uid());
  END IF;
END $$;
