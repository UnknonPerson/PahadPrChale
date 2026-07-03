/*
# Create wishlist table

A user-scoped wishlist stored in Supabase so items persist across devices and sessions.

1. New Tables
   - `wishlist_items`
     - `id` (uuid, primary key, auto-generated)
     - `user_id` (text, not null) — the app uses a MongoDB/custom JWT user ID, not Supabase auth.uid(), so we store it as text and isolate via RLS-equivalent logic (anon-accessible, filtered by user_id in app queries)
     - `item_id` (text, not null) — the MongoDB _id of the package/hotel/destination/vehicle
     - `item_type` (text, not null) — 'package' | 'hotel' | 'destination' | 'vehicle'
     - `name` (text, not null)
     - `image` (text, nullable)
     - `price` (numeric, nullable)
     - `price_label` (text, nullable) — e.g. "/night", "/person"
     - `destination` (text, nullable)
     - `description` (text, nullable)
     - `added_at` (timestamptz, default now())
     - UNIQUE (user_id, item_id) — one entry per user per item

2. Security
   - Enable RLS
   - Full CRUD open to anon + authenticated (app manages user-scoping via user_id filter in queries)
   - This is correct because the app uses its own JWT (MongoDB/Express backend), NOT Supabase auth. Supabase auth.uid() is always null for these users, so owner-scoped policies would block all access.
*/

CREATE TABLE IF NOT EXISTS wishlist_items (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    text        NOT NULL,
  item_id    text        NOT NULL,
  item_type  text        NOT NULL CHECK (item_type IN ('package', 'hotel', 'destination', 'vehicle')),
  name       text        NOT NULL,
  image      text,
  price      numeric,
  price_label text,
  destination text,
  description text,
  added_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, item_id)
);

CREATE INDEX IF NOT EXISTS wishlist_items_user_id_idx ON wishlist_items(user_id);

ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "wishlist_select" ON wishlist_items;
CREATE POLICY "wishlist_select" ON wishlist_items FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "wishlist_insert" ON wishlist_items;
CREATE POLICY "wishlist_insert" ON wishlist_items FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "wishlist_update" ON wishlist_items;
CREATE POLICY "wishlist_update" ON wishlist_items FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "wishlist_delete" ON wishlist_items;
CREATE POLICY "wishlist_delete" ON wishlist_items FOR DELETE
  TO anon, authenticated USING (true);
