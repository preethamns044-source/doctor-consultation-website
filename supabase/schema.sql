-- ==============================================================================
-- Supabase Schema: Appointments
-- ==============================================================================

-- 1. Create the appointments table
create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  request_id text unique,
  patient_name text not null,
  phone text not null,
  email text not null,
  consultation_type text not null check (consultation_type in ('in-clinic', 'telehealth')),
  preferred_date date,
  preferred_time text,
  reason text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at timestamptz not null default now()
);

-- 2. Enable Row Level Security (RLS)
alter table appointments enable row level security;

-- 3. Policy: Allow anonymous and authenticated visitors to INSERT appointments only
create policy "Allow public insert to appointments"
on appointments
for insert
to anon, authenticated
with check (true);

-- RLS Enforcement Note:
-- With RLS enabled and no policies defined for SELECT, UPDATE, or DELETE,
-- public/client access (via 'anon' and 'authenticated' roles) is completely blocked
-- from reading, modifying, or deleting records.
-- Only the Supabase Dashboard and backend functions using the service_role key have full access.
