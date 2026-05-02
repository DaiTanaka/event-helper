-- v11: ソフトデリート + 監査ログ + 削除済みユーザースナップショット

-- ── events にソフトデリート列 ───────────────────────────────
ALTER TABLE events ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

-- 既存の SELECT/UPDATE ポリシーを更新して deleted_at IS NULL フィルターを追加
DROP POLICY IF EXISTS "URLで閲覧可" ON events;
CREATE POLICY "URLで閲覧可" ON events
  FOR SELECT USING (deleted_at IS NULL);

DROP POLICY IF EXISTS "オーナーのみ更新可" ON events;
CREATE POLICY "オーナーのみ更新可" ON events
  FOR UPDATE USING (
    (user_id = auth.uid() OR user_id IS NULL)
    AND deleted_at IS NULL
  );

-- ── 監査ログテーブル ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_logs (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  action          text        NOT NULL,
  entity_type     text        NOT NULL,
  entity_id       text        NOT NULL,
  entity_snapshot jsonb,
  user_id         uuid,
  created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- サーバーアクションからの INSERT は許可（ログ書き込みのため）
CREATE POLICY "audit insert" ON audit_logs
  FOR INSERT WITH CHECK (true);

-- SELECT は管理者メールのみ
CREATE POLICY "audit admin read" ON audit_logs
  FOR SELECT USING (
    auth.jwt() ->> 'email' = ANY(ARRAY[
      'tanakadai1980@gmail.com',
      'tanaka@picoton.com'
    ])
  );

-- UPDATE/DELETE は禁止（ログ改ざん防止）
CREATE POLICY "audit no update" ON audit_logs
  FOR UPDATE USING (false);
CREATE POLICY "audit no delete" ON audit_logs
  FOR DELETE USING (false);

-- ── 削除済みユーザースナップショット ─────────────────────────
CREATE TABLE IF NOT EXISTS deleted_user_snapshots (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  original_user_id  uuid        NOT NULL,
  email             text,
  profile_snapshot  jsonb,
  deletion_reason   text        NOT NULL DEFAULT 'user_request',
  deleted_at        timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE deleted_user_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "snapshot insert" ON deleted_user_snapshots
  FOR INSERT WITH CHECK (true);

CREATE POLICY "snapshot admin read" ON deleted_user_snapshots
  FOR SELECT USING (
    auth.jwt() ->> 'email' = ANY(ARRAY[
      'tanakadai1980@gmail.com',
      'tanaka@picoton.com'
    ])
  );

CREATE POLICY "snapshot no update" ON deleted_user_snapshots
  FOR UPDATE USING (false);
CREATE POLICY "snapshot no delete" ON deleted_user_snapshots
  FOR DELETE USING (false);
