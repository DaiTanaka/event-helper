-- v10: user_profiles に同意フィールド + テストフラグを追加

ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS terms_accepted_at      timestamptz,
  ADD COLUMN IF NOT EXISTS newsletter_opt_in       boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS newsletter_opted_in_at  timestamptz,
  ADD COLUMN IF NOT EXISTS marketing_opt_in        boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS marketing_opted_in_at   timestamptz,
  ADD COLUMN IF NOT EXISTS is_test_account         boolean NOT NULL DEFAULT false;
