-- Migration: add setup/teardown dates, venue access, schedule_type, contacts, Q&A

-- events table additions
ALTER TABLE events ADD COLUMN IF NOT EXISTS setup_date date;
ALTER TABLE events ADD COLUMN IF NOT EXISTS teardown_date date;
ALTER TABLE events ADD COLUMN IF NOT EXISTS venue_access text;

-- event_schedules addition
ALTER TABLE event_schedules ADD COLUMN IF NOT EXISTS schedule_type text;

-- event_contacts table
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

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'event_contacts' AND policyname = 'Users can manage their own event contacts'
  ) THEN
    CREATE POLICY "Users can manage their own event contacts"
      ON event_contacts
      USING (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()));
  END IF;
END $$;

-- event_qa table
CREATE TABLE IF NOT EXISTS event_qa (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  question text NOT NULL,
  answer text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE event_qa ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'event_qa' AND policyname = 'Users can manage their own event QA'
  ) THEN
    CREATE POLICY "Users can manage their own event QA"
      ON event_qa
      USING (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()));
  END IF;
END $$;
