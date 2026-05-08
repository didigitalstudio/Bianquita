-- Unilubi Kids — Initial schema
-- Tables: categories, audiences, products, profiles, orders, wishlists, reviews

create extension if not exists pgcrypto;

-- ──────────────────────────────────────────────────────────────────────────────
-- Catalog reference tables
-- ──────────────────────────────────────────────────────────────────────────────

create table public.categories (
  id          text primary key,
  label       text not null,
  icon        text,
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);

create table public.audiences (
  id          text primary key,
  label       text not null,
  range       text,
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);

-- ──────────────────────────────────────────────────────────────────────────────
-- Products
-- ──────────────────────────────────────────────────────────────────────────────

create table public.products (
  id           text primary key,
  slug         text not null unique,
  name         text not null,
  category_id  text not null references public.categories(id) on update cascade on delete restrict,
  audience_id  text not null references public.audiences(id)  on update cascade on delete restrict,
  price        int  not null check (price >= 0),
  compare_at   int  null check (compare_at is null or compare_at >= 0),
  description  text not null default '',
  materials    text not null default '',
  care         text not null default '',
  tags         text[] not null default '{}',
  colors       text[] not null default '{}',
  stock        jsonb not null default '{}'::jsonb,
  img          text not null default '',
  images       text[] not null default '{}',
  active       boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index products_category_idx on public.products (category_id);
create index products_audience_idx on public.products (audience_id);
create index products_active_idx   on public.products (active);
create index products_tags_gin     on public.products using gin (tags);

-- ──────────────────────────────────────────────────────────────────────────────
-- Profiles (one row per auth.users)
-- ──────────────────────────────────────────────────────────────────────────────

create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text,
  email       text,
  phone       text,
  dni         text,
  addresses   jsonb not null default '[]'::jsonb,
  is_admin    boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index profiles_is_admin_idx on public.profiles (is_admin) where is_admin = true;

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ──────────────────────────────────────────────────────────────────────────────
-- Orders
-- ──────────────────────────────────────────────────────────────────────────────

create type public.order_status as enum (
  'pendiente-pago',
  'preparando',
  'enviado',
  'entregado',
  'cancelado'
);

create type public.payment_status as enum (
  'pending',
  'approved',
  'rejected',
  'in_process',
  'cancelled'
);

create table public.orders (
  id                uuid primary key default gen_random_uuid(),
  order_number      text not null unique,
  user_id           uuid null references auth.users(id) on delete set null,
  customer_name     text not null,
  customer_email    text not null,
  customer_phone    text,
  customer_dni      text,
  items             jsonb not null,
  shipping_method   text not null,
  shipping_address  jsonb not null default '{}'::jsonb,
  shipping_cost     int not null default 0,
  subtotal          int not null,
  total             int not null,
  payment_method    text not null,
  payment_status    public.payment_status not null default 'pending',
  payment_id        text,
  status            public.order_status not null default 'pendiente-pago',
  notes             text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index orders_user_idx       on public.orders (user_id);
create index orders_email_idx      on public.orders (customer_email);
create index orders_status_idx     on public.orders (status);
create index orders_created_idx    on public.orders (created_at desc);

-- ──────────────────────────────────────────────────────────────────────────────
-- Wishlists
-- ──────────────────────────────────────────────────────────────────────────────

create table public.wishlists (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  product_id  text not null references public.products(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique (user_id, product_id)
);

create index wishlists_user_idx on public.wishlists (user_id);

-- ──────────────────────────────────────────────────────────────────────────────
-- Reviews
-- ──────────────────────────────────────────────────────────────────────────────

create table public.reviews (
  id          uuid primary key default gen_random_uuid(),
  product_id  text not null references public.products(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  rating      int not null check (rating between 1 and 5),
  title       text,
  body        text,
  created_at  timestamptz not null default now(),
  unique (product_id, user_id)
);

create index reviews_product_idx on public.reviews (product_id);

-- ──────────────────────────────────────────────────────────────────────────────
-- updated_at triggers
-- ──────────────────────────────────────────────────────────────────────────────

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_updated_at  before update on public.products  for each row execute function public.set_updated_at();
create trigger profiles_updated_at  before update on public.profiles  for each row execute function public.set_updated_at();
create trigger orders_updated_at    before update on public.orders    for each row execute function public.set_updated_at();
