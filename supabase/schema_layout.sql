-- 会場レイアウト

create table venue_layouts (
  id uuid default gen_random_uuid() primary key,
  event_id uuid references events(id) on delete cascade not null unique,
  name text not null default '会場レイアウト',
  room_width integer not null default 2000,
  room_height integer not null default 1500,
  grid_size integer not null default 100,
  items jsonb not null default '[]',
  thumbnail text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger venue_layouts_updated_at
  before update on venue_layouts
  for each row execute function update_updated_at();

alter table venue_layouts enable row level security;

create policy "全員閲覧可" on venue_layouts for select using (true);
create policy "イベント参照で作成可" on venue_layouts for insert
  with check (exists (select 1 from events where id = event_id));
create policy "更新可" on venue_layouts for update using (true);
create policy "削除可" on venue_layouts for delete using (true);
