-- Run this once in Supabase: Dashboard > SQL Editor > New query > paste > Run
create table if not exists readings (
  user_id text not null, id text not null,
  sys int, dia int, pulse int, taken_at timestamptz, symptom text, notes text,
  primary key (user_id, id));
create table if not exists family_members (
  user_id text not null, id text not null,
  name text, relation text, sys int, dia int, pulse int, updated_at timestamptz default now(),
  primary key (user_id, id));
alter table readings enable row level security;
alter table family_members enable row level security;
-- App has no login, so the anon key must be allowed to read/write.
drop policy if exists "anon all readings" on readings;
drop policy if exists "anon all family" on family_members;
create policy "anon all readings" on readings for all to anon using (true) with check (true);
create policy "anon all family" on family_members for all to anon using (true) with check (true);
