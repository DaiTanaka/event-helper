-- v15: target_age を text → text[]（複数年齢層の同時選択に対応）

ALTER TABLE events
  ALTER COLUMN target_age TYPE text[]
  USING CASE
    WHEN target_age IS NULL THEN NULL
    ELSE ARRAY[target_age]
  END;
