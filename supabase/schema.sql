-- Run once in a new Supabase project. No products, payments or members are fabricated.
-- Login is entirely server-side (own members/auth_codes/sessions tables); the browser never
-- talks to Postgres directly and no Supabase Auth user table or JWT is involved.
create table public.members (id uuid primary key default gen_random_uuid(), email text unique not null, created_at timestamptz not null default now());
create table public.auth_codes (email text primary key, code_hash text not null, expires_at timestamptz not null, attempts integer not null default 0, created_at timestamptz not null default now());
create table public.sessions (
 id uuid primary key default gen_random_uuid(), member_id uuid not null references public.members(id) on delete cascade,
 token_hash text unique not null, expires_at timestamptz not null, created_at timestamptz not null default now()
);
create index sessions_member on public.sessions(member_id);
create table public.admins (user_id uuid primary key references public.members(id) on delete cascade);
create table public.member_consents (user_id uuid primary key references public.members(id), version text not null, accepted_at timestamptz not null);
create table public.products (
 id uuid primary key default gen_random_uuid(), name text not null, category text not null,
 description text not null default '', image_url text, price numeric(10,2), member_price numeric(10,2),
 age text not null default 'Consultar edad recomendada', stock integer,
 published boolean not null default false, featured boolean not null default false,
 check (price is null or price > 0), check (member_price is null or (price is not null and member_price > 0 and member_price <= price)),
 check (stock is null or stock >= 0)
);
create table public.campaigns (
 id uuid primary key default gen_random_uuid(), title text not null, description text not null,
 conditions text not null, starts_at timestamptz not null, ends_at timestamptz not null,
 published boolean not null default false, check (ends_at > starts_at)
);
create table public.subscriptions (
 id uuid primary key, user_id uuid not null references public.members(id),
 mp_id text unique, status text not null default 'creating', init_point text,
 next_payment_date timestamptz, provider_updated_at timestamptz,
 created_at timestamptz not null default now(),
 check (status in ('creating','pending','authorized','paused','cancelled'))
);
create unique index one_open_subscription on public.subscriptions(user_id) where status <> 'cancelled';
create table public.payments (
 id text primary key, subscription_id uuid not null references public.subscriptions(id),
 user_id uuid not null references public.members(id), status text not null,
 amount numeric(10,2) not null, paid_at timestamptz not null, period_end timestamptz not null,
 updated_at timestamptz not null
);
create index member_payments on public.payments(user_id,period_end desc);
create table public.orders (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references public.members(id),
 description text not null, total numeric(10,2) not null check (total >= 0),
 status text not null check (status in ('confirmado','preparando','enviado','entregado','cancelado')),
 created_at timestamptz not null default now()
);

alter table public.members enable row level security;
alter table public.auth_codes enable row level security;
alter table public.sessions enable row level security;
alter table public.admins enable row level security;
alter table public.member_consents enable row level security;
alter table public.products enable row level security;
alter table public.campaigns enable row level security;
alter table public.subscriptions enable row level security;
alter table public.payments enable row level security;
alter table public.orders enable row level security;
revoke all on public.members, public.auth_codes, public.sessions, public.admins, public.member_consents, public.products, public.campaigns, public.subscriptions, public.payments, public.orders from anon, authenticated;
grant select on public.products, public.campaigns to anon, authenticated;
create policy published_products on public.products for select to anon,authenticated using (published);
create policy current_campaigns on public.campaigns for select to anon,authenticated using (published and starts_at <= now() and ends_at >= now());
grant all on public.members, public.auth_codes, public.sessions, public.admins, public.member_consents, public.products, public.campaigns, public.subscriptions, public.payments, public.orders to service_role;

-- Atomic reservation prevents simultaneous checkout requests from creating two subscriptions.
create function public.reserve_subscription(p_id uuid, p_user uuid) returns setof public.subscriptions
language plpgsql security definer set search_path = public as $$
begin
 perform pg_advisory_xact_lock(hashtextextended(p_user::text,0));
 if exists(select 1 from public.payments where user_id=p_user and status='approved' and period_end>now()) then
   return query select * from public.subscriptions where user_id=p_user order by created_at desc limit 1;
   return;
 end if;
 if not exists(select 1 from public.subscriptions where user_id=p_user and status<>'cancelled') then
   insert into public.subscriptions(id,user_id) values(p_id,p_user);
 end if;
 return query select * from public.subscriptions where user_id=p_user and status<>'cancelled' order by created_at desc limit 1;
end $$;

-- Each payment has one row. Old/out-of-order callbacks cannot undo a newer refund or status.
create function public.record_payment(p_payment jsonb) returns void
language sql security definer set search_path = public as $$
 insert into public.payments(id,subscription_id,user_id,status,amount,paid_at,period_end,updated_at)
 values(p_payment->>'id',(p_payment->>'subscription_id')::uuid,(p_payment->>'user_id')::uuid,
 p_payment->>'status',(p_payment->>'amount')::numeric,(p_payment->>'paid_at')::timestamptz,
 (p_payment->>'period_end')::timestamptz,(p_payment->>'updated_at')::timestamptz)
 on conflict(id) do update set status=excluded.status,amount=excluded.amount,
 paid_at=excluded.paid_at,period_end=excluded.period_end,updated_at=excluded.updated_at
 where excluded.updated_at >= payments.updated_at
 and excluded.user_id=payments.user_id and excluded.subscription_id=payments.subscription_id;
$$;
-- Atomic check+increment: concurrent guesses can't bypass the attempt limit, since Postgres
-- serializes concurrent UPDATEs to the same row instead of racing on a read-then-write from the app.
create function public.verify_auth_code(p_email text, p_code_hash text) returns boolean
language plpgsql security definer set search_path = public as $$
declare matched boolean;
begin
 update public.auth_codes set attempts = attempts + 1
 where email = p_email and expires_at > now() and attempts < 5
 returning (code_hash = p_code_hash) into matched;
 if matched then delete from public.auth_codes where email = p_email; end if;
 return coalesce(matched, false);
end $$;

revoke all on function public.reserve_subscription(uuid,uuid), public.record_payment(jsonb), public.verify_auth_code(text,text) from public,anon,authenticated;
grant execute on function public.reserve_subscription(uuid,uuid), public.record_payment(jsonb), public.verify_auth_code(text,text) to service_role;

-- After logging in once through the app with your own email, obtain your UUID with:
-- select id from public.members where email = 'you@example.com';
-- insert into public.admins(user_id) values ('YOUR-MEMBER-UUID');
-- Do not grant administrative roles through user-editable metadata or frontend state.

-- Product images are public; only the authenticated server administrator can upload.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('catalog','catalog',true,2000000,array['image/jpeg','image/png','image/webp']);
