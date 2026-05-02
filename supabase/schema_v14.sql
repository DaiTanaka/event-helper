-- v14: 会場・当日詳細フィールドの追加

ALTER TABLE events
  ADD COLUMN IF NOT EXISTS venue_map_url        text,
  ADD COLUMN IF NOT EXISTS venue_meeting_place  text,
  ADD COLUMN IF NOT EXISTS venue_meeting_time   text,
  ADD COLUMN IF NOT EXISTS venue_entry          text,
  ADD COLUMN IF NOT EXISTS staff_dress_code     text;
