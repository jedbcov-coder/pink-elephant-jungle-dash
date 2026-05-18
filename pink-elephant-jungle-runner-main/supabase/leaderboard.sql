-- Supabase setup for the shared classroom leaderboard.
-- Run this in the Supabase SQL editor, then expose VITE_SUPABASE_URL and
-- VITE_SUPABASE_ANON_KEY to the Vite build.

create table if not exists public.leaderboard (
  initials text not null check (initials ~ '^[A-Z0-9]{3}$'),
  score integer not null check (score >= 0),
  "elapsedMs" integer not null check ("elapsedMs" >= 0),
  fruit integer not null check (fruit >= 0),
  crates integer not null check (crates >= 0),
  lives integer not null check (lives >= 0),
  "createdAt" timestamptz not null default now()
);

alter table public.leaderboard enable row level security;

drop policy if exists "leaderboard_select_public" on public.leaderboard;
create policy "leaderboard_select_public"
  on public.leaderboard
  for select
  using (true);

drop policy if exists "leaderboard_insert_safe_fields" on public.leaderboard;
create policy "leaderboard_insert_safe_fields"
  on public.leaderboard
  for insert
  with check (
    initials ~ '^[A-Z0-9]{3}$'
    and score >= 0
    and "elapsedMs" >= 0
    and fruit >= 0
    and crates >= 0
    and lives >= 0
  );

create index if not exists leaderboard_score_idx
  on public.leaderboard (score desc, "elapsedMs" asc, "createdAt" desc);
