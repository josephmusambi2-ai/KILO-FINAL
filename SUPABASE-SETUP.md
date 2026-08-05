# Supabase Setup — Kilo Auto Spares

Run these steps once to connect your shop to Supabase.
After that, all changes in admin.html save instantly — no download or GitHub push needed.

---

## 1. Create the database tables

Open your Supabase project → **SQL Editor** → **New query**, paste the SQL
below, and click **Run**.

```sql
-- ── Products ──────────────────────────────────────────────────────────────
create table if not exists products (
  id          text        primary key,
  name        text        not null,
  brand       text        not null default 'Universal',
  category    text        not null,
  price       numeric     not null default 0,
  stock       integer     not null default 0,
  fitment     text        not null default '',
  description text        not null default '',
  image_url   text,
  created_at  timestamptz not null default now()
);

-- ── Brands ────────────────────────────────────────────────────────────────
create table if not exists brands (
  name       text    primary key,
  sort_order integer not null default 0
);

-- ── Categories ────────────────────────────────────────────────────────────
create table if not exists categories (
  name       text    primary key,
  sort_order integer not null default 0
);

-- ── Row Level Security ────────────────────────────────────────────────────
-- Enable RLS on all three tables
alter table products   enable row level security;
alter table brands     enable row level security;
alter table categories enable row level security;

-- Anyone can read (customers browsing the shop)
create policy "Public read products"   on products   for select using (true);
create policy "Public read brands"     on brands     for select using (true);
create policy "Public read categories" on categories for select using (true);

-- Anyone can write — the admin page is protected by the password in config.js.
-- If you need stricter security later, replace these with auth-based policies.
create policy "Anon write products"   on products   for all using (true) with check (true);
create policy "Anon write brands"     on brands     for all using (true) with check (true);
create policy "Anon write categories" on categories for all using (true) with check (true);
```

---

## 2. Create the Storage bucket for product photos

1. In your Supabase project go to **Storage** → **New bucket**
2. Name it exactly: `product-images`
3. Tick **Public bucket** (so photos load without authentication)
4. Click **Save**

Then add a Storage policy so anyone can upload:

Go to **Storage → product-images → Policies → New policy** and paste:

```sql
-- Allow anyone to upload to product-images
create policy "Anon upload product images"
  on storage.objects for insert
  with check (bucket_id = 'product-images');

-- Allow anyone to update / replace images
create policy "Anon update product images"
  on storage.objects for update
  using (bucket_id = 'product-images');
```

Or simply set the bucket to **Public** — that covers reads, and your admin
password gates who actually gets to admin.html to upload.

---

## 3. Seed the starter catalog (first time only)

Open `admin.html` in your browser, log in, and click **Seed starter catalog**
in the yellow banner at the top. This loads all the default parts, brands,
and categories into Supabase.

After that the banner changes to:
> **Changes save to Supabase instantly** — live for every visitor the moment you click Save.

---

## 4. Done — how it works now

| What                      | Where it lives     | When it goes live       |
|---------------------------|--------------------|-------------------------|
| Products, brands, categories | Supabase database | Instantly on Save       |
| Product photos            | Supabase Storage   | Instantly on Save       |
| Shop config (name, phone, WhatsApp) | `config.js` | After GitHub push  |
| Customer cart             | Shopper's browser  | n/a                     |

**Tip:** `config.js` still controls your shop name, phone number, WhatsApp
number, currency, and admin password. Edit that file and push to GitHub
whenever those details change.

---

## Troubleshooting

**"Could not reach Supabase"** — Check that `SUPABASE_URL` and `SUPABASE_KEY`
in `supabase-config.js` are correct (Project Settings → API in your dashboard).

**Photos not showing** — Make sure the `product-images` bucket exists and is
set to Public. Check the browser console for Storage errors.

**Parts not appearing on the shop page** — Open the browser console (F12)
and look for Supabase error messages. The most common cause is a missing RLS
policy — re-run the SQL from Step 1.
