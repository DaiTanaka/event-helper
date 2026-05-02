-- v13: イベント共有（メンバー招待・引き継ぎ）

-- ── event_members: 承認済みメンバー ──────────────────────────
CREATE TABLE IF NOT EXISTS event_members (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id    uuid        NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role        text        NOT NULL DEFAULT 'editor'
                          CHECK (role IN ('editor', 'viewer')),
  invited_by  uuid        REFERENCES auth.users(id),
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE(event_id, user_id)
);

ALTER TABLE event_members ENABLE ROW LEVEL SECURITY;

-- メンバー自身・イベントオーナーが参照可
CREATE POLICY "event_members_select" ON event_members
  FOR SELECT USING (
    user_id = auth.uid()
    OR event_id IN (SELECT id FROM events WHERE user_id = auth.uid())
  );

-- イベントオーナーのみ追加可
CREATE POLICY "event_members_insert" ON event_members
  FOR INSERT WITH CHECK (
    event_id IN (SELECT id FROM events WHERE user_id = auth.uid())
  );

-- イベントオーナーのみロール変更可
CREATE POLICY "event_members_update" ON event_members
  FOR UPDATE USING (
    event_id IN (SELECT id FROM events WHERE user_id = auth.uid())
  );

-- オーナーが削除 or 本人が脱退
CREATE POLICY "event_members_delete" ON event_members
  FOR DELETE USING (
    user_id = auth.uid()
    OR event_id IN (SELECT id FROM events WHERE user_id = auth.uid())
  );

-- ── event_invitations: 招待トークン ─────────────────────────
CREATE TABLE IF NOT EXISTS event_invitations (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id    uuid        NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  label       text,
  role        text        NOT NULL DEFAULT 'editor'
                          CHECK (role IN ('editor', 'viewer')),
  invited_by  uuid        NOT NULL REFERENCES auth.users(id),
  token       text        UNIQUE NOT NULL,
  expires_at  timestamptz NOT NULL DEFAULT now() + interval '30 days',
  accepted_at timestamptz,
  accepted_by uuid        REFERENCES auth.users(id),
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE event_invitations ENABLE ROW LEVEL SECURITY;

-- オーナー・招待者が参照可（token 受諾は admin client で処理）
CREATE POLICY "event_invitations_select" ON event_invitations
  FOR SELECT USING (
    invited_by = auth.uid()
    OR event_id IN (SELECT id FROM events WHERE user_id = auth.uid())
  );

-- イベントオーナーのみ作成可
CREATE POLICY "event_invitations_insert" ON event_invitations
  FOR INSERT WITH CHECK (
    event_id IN (SELECT id FROM events WHERE user_id = auth.uid())
  );

-- オーナーのみ削除可
CREATE POLICY "event_invitations_delete" ON event_invitations
  FOR DELETE USING (
    event_id IN (SELECT id FROM events WHERE user_id = auth.uid())
  );

-- ── events UPDATE ポリシー更新: editor メンバーにも編集権を付与 ──
DROP POLICY IF EXISTS "オーナーのみ更新可" ON events;
CREATE POLICY "オーナーまたはeditorが更新可" ON events
  FOR UPDATE USING (
    deleted_at IS NULL AND (
      user_id = auth.uid()
      OR user_id IS NULL
      OR id IN (
        SELECT event_id FROM event_members
        WHERE user_id = auth.uid() AND role = 'editor'
      )
    )
  );

-- ── サブテーブルRLS更新: editor メンバーにも書き込み権を付与 ──

-- event_tasks
DROP POLICY IF EXISTS "Users can manage their own event tasks" ON event_tasks;
CREATE POLICY "owners_and_editors_manage_tasks" ON event_tasks
  FOR ALL USING (
    event_id IN (
      SELECT id FROM events WHERE user_id = auth.uid()
      UNION ALL
      SELECT event_id FROM event_members WHERE user_id = auth.uid() AND role = 'editor'
    )
  );

-- event_contents
DROP POLICY IF EXISTS "Users can manage their own event contents" ON event_contents;
CREATE POLICY "owners_and_editors_manage_contents" ON event_contents
  FOR ALL USING (
    event_id IN (
      SELECT id FROM events WHERE user_id = auth.uid()
      UNION ALL
      SELECT event_id FROM event_members WHERE user_id = auth.uid() AND role = 'editor'
    )
  );

-- event_budget_items
DROP POLICY IF EXISTS "users own budget items" ON event_budget_items;
CREATE POLICY "owners_and_editors_manage_budget" ON event_budget_items
  FOR ALL USING (
    event_id IN (
      SELECT id FROM events WHERE user_id = auth.uid()
      UNION ALL
      SELECT event_id FROM event_members WHERE user_id = auth.uid() AND role = 'editor'
    )
  );

-- event_reports
DROP POLICY IF EXISTS "users own reports" ON event_reports;
CREATE POLICY "owners_and_editors_manage_reports" ON event_reports
  FOR ALL USING (
    event_id IN (
      SELECT id FROM events WHERE user_id = auth.uid()
      UNION ALL
      SELECT event_id FROM event_members WHERE user_id = auth.uid() AND role = 'editor'
    )
  );

-- event_contacts
DROP POLICY IF EXISTS "Users can manage their own event contacts" ON event_contacts;
CREATE POLICY "owners_and_editors_manage_contacts" ON event_contacts
  FOR ALL USING (
    event_id IN (
      SELECT id FROM events WHERE user_id = auth.uid()
      UNION ALL
      SELECT event_id FROM event_members WHERE user_id = auth.uid() AND role = 'editor'
    )
  );

-- event_qa
DROP POLICY IF EXISTS "Users can manage their own event QA" ON event_qa;
CREATE POLICY "owners_and_editors_manage_qa" ON event_qa
  FOR ALL USING (
    event_id IN (
      SELECT id FROM events WHERE user_id = auth.uid()
      UNION ALL
      SELECT event_id FROM event_members WHERE user_id = auth.uid() AND role = 'editor'
    )
  );
