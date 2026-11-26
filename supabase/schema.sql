-- Esquema de referencia para levantar el proyecto en un Supabase nuevo.
-- Ejecutar en el SQL Editor de Supabase.

create table if not exists public.urls (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  original_url text not null,
  short_url text not null unique,
  custom_url text unique,
  qr text not null
);

create table if not exists public.clicks (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  url_id uuid not null references public.urls (id) on delete cascade,
  city text,
  country text,
  device text
);

create index if not exists clicks_url_id_idx on public.clicks (url_id);

-- Row Level Security ---------------------------------------------------------
alter table public.urls enable row level security;
alter table public.clicks enable row level security;

-- Cualquiera puede resolver un link corto (necesario para redirigir sin sesión).
create policy "urls: lectura pública" on public.urls
  for select using (true);

-- Solo el dueño crea, edita o borra sus links.
create policy "urls: el dueño inserta" on public.urls
  for insert with check (auth.uid() = user_id);
create policy "urls: el dueño actualiza" on public.urls
  for update using (auth.uid() = user_id);
create policy "urls: el dueño borra" on public.urls
  for delete using (auth.uid() = user_id);

-- Cualquier visitante registra un click.
create policy "clicks: inserción pública" on public.clicks
  for insert with check (true);

-- Solo el dueño del link ve sus estadísticas.
create policy "clicks: lectura del dueño" on public.clicks
  for select using (
    exists (select 1 from public.urls u where u.id = url_id and u.user_id = auth.uid())
  );

-- Storage: crear dos buckets públicos desde el panel de Supabase:
--   qrs          -> imágenes de los códigos QR
--   profile_pic  -> fotos de perfil
