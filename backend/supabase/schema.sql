-- ============================================================
-- ExpiryGuard — Schéma Supabase
-- Coller ce SQL dans l'éditeur SQL de ton projet Supabase
-- ============================================================

-- Extension UUID (activée par défaut sur Supabase)
create extension if not exists "uuid-ossp";

-- ---- Tenants (agences clientes) ----
create table if not exists tenants (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  email       text not null unique,
  created_at  timestamptz not null default now()
);

-- ---- Assets (domaines, SSL, cartes) ----
create type asset_type as enum ('domain', 'ssl', 'card');

create table if not exists assets (
  id           uuid primary key default uuid_generate_v4(),
  tenant_id    uuid not null references tenants(id) on delete cascade,
  type         asset_type not null,
  name         text not null,
  expiry_date  date not null,
  meta         jsonb not null default '{}',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Index pour accélérer les requêtes par tenant et par date
create index if not exists assets_tenant_id_idx on assets(tenant_id);
create index if not exists assets_expiry_date_idx on assets(expiry_date);

-- ---- Row Level Security (RLS) ----
-- Chaque agence ne voit que ses propres actifs.
alter table tenants enable row level security;
alter table assets enable row level security;

-- Politique : un utilisateur authentifié voit uniquement ses données.
-- (Le backend utilise la service key qui bypass RLS — c'est intentionnel)
create policy "Tenant can read own data"
  on tenants for select
  using (auth.uid() = id);

create policy "Tenant can read own assets"
  on assets for select
  using (auth.uid() = tenant_id);

create policy "Tenant can insert own assets"
  on assets for insert
  with check (auth.uid() = tenant_id);

create policy "Tenant can update own assets"
  on assets for update
  using (auth.uid() = tenant_id);

create policy "Tenant can delete own assets"
  on assets for delete
  using (auth.uid() = tenant_id);

-- ---- Données de démonstration ----
-- (optionnel — pour tester sans le frontend)
/*
insert into tenants (id, name, email) values
  ('11111111-0000-0000-0000-000000000001', 'Studio Nord', 'studio@nord.fr'),
  ('22222222-0000-0000-0000-000000000002', 'Agence Orbit', 'contact@orbit.fr');

insert into assets (tenant_id, type, name, expiry_date, meta) values
  ('11111111-0000-0000-0000-000000000001', 'domain', 'client-alpha.com',    current_date + 2,  '{"registrar":"Namecheap"}'),
  ('11111111-0000-0000-0000-000000000001', 'ssl',    'checkout.client-alpha.com', current_date + 5, '{"authority":"Let'\''s Encrypt"}'),
  ('22222222-0000-0000-0000-000000000002', 'card',   'AWS — Carte *4532',   current_date + 6,  '{"service":"AWS","last4":"4532"}');
*/
