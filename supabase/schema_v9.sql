-- v9: ユーザープロフィール

CREATE TABLE IF NOT EXISTS user_profiles (
  id              uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization    text,
  industry        text,
  role            text,
  prefecture      text,
  events_per_year text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users manage own profile" ON user_profiles
  FOR ALL USING (id = auth.uid()) WITH CHECK (id = auth.uid());
