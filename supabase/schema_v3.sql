-- event_tasks: task management for events
create table if not exists event_tasks (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'done')),
  priority text not null default 'medium' check (priority in ('high', 'medium', 'low')),
  assignee text,
  start_date date,
  due_date date,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table event_tasks enable row level security;

create policy "Users can manage their own event tasks"
  on event_tasks for all
  using (
    exists (
      select 1 from events e where e.id = event_tasks.event_id and e.user_id = auth.uid()
    )
  );
