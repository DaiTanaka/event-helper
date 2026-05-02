-- イベント開催ナビ データベーススキーマ

create table events (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete set null,
  title text not null,
  event_date date,
  end_date date,
  venue_name text,
  venue_address text,
  organizer text,
  co_organizers text,
  expected_visitors integer,
  target_audience text,
  overview text,
  contact_name text,
  contact_phone text,
  contact_email text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table event_schedules (
  id uuid default gen_random_uuid() primary key,
  event_id uuid references events(id) on delete cascade not null,
  day_number integer default 1,
  start_time time,
  end_time time,
  content text not null,
  location text,
  responsible_person text,
  notes text,
  sort_order integer default 0,
  created_at timestamptz default now()
);

create table event_equipment (
  id uuid default gen_random_uuid() primary key,
  event_id uuid references events(id) on delete cascade not null,
  category text,
  name text not null,
  quantity integer default 1,
  unit text default '個',
  supplier text,
  notes text,
  checked boolean default false,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- updated_at自動更新
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger events_updated_at
  before update on events
  for each row execute function update_updated_at();

-- RLS有効化
alter table events enable row level security;
alter table event_schedules enable row level security;
alter table event_equipment enable row level security;

-- eventsポリシー: 誰でも作成可・URLを知っていれば閲覧可
create policy "誰でも作成可" on events for insert with check (true);
create policy "URLで閲覧可" on events for select using (true);
create policy "オーナーのみ更新可" on events for update
  using (user_id = auth.uid() or user_id is null);
create policy "オーナーのみ削除可" on events for delete
  using (user_id = auth.uid());

-- event_schedulesポリシー
create policy "イベント参照で作成可" on event_schedules for insert
  with check (exists (select 1 from events where id = event_id));
create policy "全員閲覧可" on event_schedules for select using (true);
create policy "更新可" on event_schedules for update using (true);
create policy "削除可" on event_schedules for delete using (true);

-- event_equipmentポリシー
create policy "イベント参照で作成可" on event_equipment for insert
  with check (exists (select 1 from events where id = event_id));
create policy "全員閲覧可" on event_equipment for select using (true);
create policy "更新可" on event_equipment for update using (true);
create policy "削除可" on event_equipment for delete using (true);
