-- URL fields for event_contents
alter table event_contents add column if not exists url text;
alter table event_contents add column if not exists og_image_url text;

-- Admin-managed catalog items
create table if not exists catalog_items (
  id text primary key,
  title text not null,
  category text not null,
  company_name text not null,
  price_from int,
  price_to int,
  description text not null default '',
  tags text[] not null default '{}',
  is_piqton boolean not null default false,
  is_ad boolean not null default false,
  contact_url text,
  url text,
  og_image_url text,
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Admin-managed task template categories
create table if not exists task_template_categories (
  id text primary key,
  label text not null,
  color text not null,
  sort_order int not null default 0
);

-- Admin-managed task template tasks
create table if not exists task_template_tasks (
  id text primary key,
  title text not null,
  category_id text not null references task_template_categories(id) on delete cascade,
  priority text not null default 'medium' check (priority in ('high', 'medium', 'low')),
  start_days int,
  due_days int,
  sort_order int not null default 0,
  active boolean not null default true
);
