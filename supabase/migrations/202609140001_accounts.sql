-- LokaBasa: username identities and private progress. No passwords in public schema.
begin;
create table if not exists public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 username text not null unique check (username ~ '^[a-z][a-z0-9_]{2,19}$'),
 created_at timestamptz not null default now()
);
create table if not exists public.user_progress (
 user_id uuid primary key references auth.users(id) on delete cascade,
 data jsonb not null check(jsonb_typeof(data)='object' and (data->>'version')='1' and octet_length(data::text)<2000000),
 revision bigint not null default 1,
 updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
alter table public.user_progress enable row level security;
revoke all on public.profiles, public.user_progress from anon;
revoke all on public.profiles, public.user_progress from authenticated;
grant select on public.profiles to authenticated;
grant select,insert,update on public.user_progress to authenticated;
create policy "Read own profile" on public.profiles for select to authenticated using ((select auth.uid())=id);
create policy "Read own progress" on public.user_progress for select to authenticated using ((select auth.uid())=user_id);
create policy "Create own progress" on public.user_progress for insert to authenticated with check ((select auth.uid())=user_id);
create policy "Update own progress" on public.user_progress for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create or replace function public.lokabasa_create_profile() returns trigger language plpgsql security definer set search_path='' as $$
declare uname text;
begin
 uname := lower(split_part(new.email,'@',1));
 if new.email not like '%@users.lokabasa.invalid' or uname !~ '^[a-z][a-z0-9_]{2,19}$' then
  raise exception 'Username tidak valid';
 end if;
 insert into public.profiles(id,username) values(new.id,uname);
 return new;
end; $$;
revoke all on function public.lokabasa_create_profile() from public,anon,authenticated;
create trigger lokabasa_profile_on_signup after insert on auth.users for each row execute function public.lokabasa_create_profile();
create or replace function public.lokabasa_progress_version() returns trigger language plpgsql set search_path='' as $$
begin
 if TG_OP='INSERT' then new.revision:=1; else new.revision:=old.revision+1; end if;
 new.updated_at:=now(); return new;
end; $$;
revoke all on function public.lokabasa_progress_version() from public,anon,authenticated;
create trigger lokabasa_progress_version before insert or update on public.user_progress for each row execute function public.lokabasa_progress_version();
commit;
