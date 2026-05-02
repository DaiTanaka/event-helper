-- event_contents: program contents and products selected for each event
create table if not exists event_contents (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  catalog_id text,         -- references static catalog item id (optional)
  title text not null,
  category text,
  company_name text,
  estimated_cost int,      -- estimated cost in JPY
  actual_cost int,         -- confirmed/actual cost in JPY
  status text not null default 'considering'
    check (status in ('considering', 'confirmed', 'cancelled')),
  notes text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table event_contents enable row level security;

create policy "Users can manage their own event contents"
  on event_contents for all
  using (
    exists (
      select 1 from events e
      where e.id = event_contents.event_id and e.user_id = auth.uid()
    )
  );
