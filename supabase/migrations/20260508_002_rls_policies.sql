-- Unilubi Kids — Row Level Security policies

-- Helper: is the current request from an admin? (security definer to avoid
-- recursive policy lookups when reading from profiles)
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and is_admin = true
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;

-- ──────────────────────────────────────────────────────────────────────────────
-- Enable RLS
-- ──────────────────────────────────────────────────────────────────────────────

alter table public.categories enable row level security;
alter table public.audiences  enable row level security;
alter table public.products   enable row level security;
alter table public.profiles   enable row level security;
alter table public.orders     enable row level security;
alter table public.wishlists  enable row level security;
alter table public.reviews    enable row level security;

-- ──────────────────────────────────────────────────────────────────────────────
-- Categories & audiences: public read, admin write
-- ──────────────────────────────────────────────────────────────────────────────

create policy "categories are public" on public.categories
  for select using (true);

create policy "categories admin write" on public.categories
  for all using (public.is_admin()) with check (public.is_admin());

create policy "audiences are public" on public.audiences
  for select using (true);

create policy "audiences admin write" on public.audiences
  for all using (public.is_admin()) with check (public.is_admin());

-- ──────────────────────────────────────────────────────────────────────────────
-- Products: public read (active), admin write
-- ──────────────────────────────────────────────────────────────────────────────

create policy "active products are public" on public.products
  for select using (active = true or public.is_admin());

create policy "products admin write" on public.products
  for all using (public.is_admin()) with check (public.is_admin());

-- ──────────────────────────────────────────────────────────────────────────────
-- Profiles: own row read/update, admins can read all
-- ──────────────────────────────────────────────────────────────────────────────

create policy "own profile read" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

create policy "own profile update" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "own profile insert" on public.profiles
  for insert with check (auth.uid() = id);

-- ──────────────────────────────────────────────────────────────────────────────
-- Orders: read own (or by guest_email match via API), admin reads all,
-- inserts performed via service role from API (no public insert)
-- ──────────────────────────────────────────────────────────────────────────────

create policy "own orders read" on public.orders
  for select using (
    (user_id is not null and user_id = auth.uid())
    or public.is_admin()
  );

create policy "orders admin write" on public.orders
  for all using (public.is_admin()) with check (public.is_admin());

-- ──────────────────────────────────────────────────────────────────────────────
-- Wishlists: own only
-- ──────────────────────────────────────────────────────────────────────────────

create policy "own wishlist read"   on public.wishlists for select using (auth.uid() = user_id);
create policy "own wishlist insert" on public.wishlists for insert with check (auth.uid() = user_id);
create policy "own wishlist delete" on public.wishlists for delete using (auth.uid() = user_id);

-- ──────────────────────────────────────────────────────────────────────────────
-- Reviews: public read, authenticated insert/update/delete own
-- ──────────────────────────────────────────────────────────────────────────────

create policy "reviews are public" on public.reviews
  for select using (true);

create policy "own review insert" on public.reviews
  for insert with check (auth.uid() = user_id);

create policy "own review update" on public.reviews
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own review delete" on public.reviews
  for delete using (auth.uid() = user_id or public.is_admin());
