-- v12: user_profiles に組織種別・電話・決裁権・予算規模を追加

ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS organization_type   text,
  ADD COLUMN IF NOT EXISTS phone               text,
  ADD COLUMN IF NOT EXISTS decision_authority  text,
  ADD COLUMN IF NOT EXISTS budget_range        text;
