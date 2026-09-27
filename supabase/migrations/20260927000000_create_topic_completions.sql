create table public.topic_completions (
  user_id uuid not null references auth.users (id) on delete cascade,
  topic_id text not null,
  completed_at timestamptz not null default now(),
  constraint topic_completions_pkey primary key (user_id, topic_id)
);

alter table public.topic_completions enable row level security;

revoke all on table public.topic_completions from anon, public;
grant select, insert, delete on table public.topic_completions to authenticated;

create policy "Users can read their own topic completions"
  on public.topic_completions
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can add their own topic completions"
  on public.topic_completions
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own topic completions"
  on public.topic_completions
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);
