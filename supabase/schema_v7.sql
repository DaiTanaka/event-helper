-- v7: 予算管理・報告書

-- events テーブルに総予算カラムを追加
ALTER TABLE events ADD COLUMN IF NOT EXISTS total_budget integer;

-- 予算項目テーブル
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

CREATE POLICY "users own budget items" ON event_budget_items
  USING (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()));

-- 報告書テーブル
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

CREATE POLICY "users own reports" ON event_reports
  USING (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()));
