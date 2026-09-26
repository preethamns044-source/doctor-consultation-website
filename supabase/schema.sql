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
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'rejected', 'cancelled', 'completed')),
  created_at timestamptz not null default now(),
  doctor_id uuid REFERENCES public.admin_users(id) NULL
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

-- 4. SECURITY DEFINER function to assign doctor_id for new appointments (single doctor scenario)
create or replace function public.assign_doctor_id()
returns uuid as $$
declare
  doc_id uuid;
begin
  select id into doc_id from public.admin_users limit 1; -- assumes a single doctor
  return doc_id;
end;
$$ language plpgsql security definer set search_path = public;

-- 5. BEFORE INSERT trigger to set doctor_id automatically when missing
create or replace function public.set_doctor_id_trigger()
returns trigger as $$
begin
  if new.doctor_id is null then
    new.doctor_id := public.assign_doctor_id();
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists set_doctor_id_on_appointments on public.appointments;
create trigger set_doctor_id_on_appointments
  before insert on public.appointments
  for each row execute function public.set_doctor_id_trigger();

-- 6. New SELECT policy: admins can read their own appointments and unassigned ones
create policy "Allow admins to select own and unassigned appointments"
  on public.appointments
  for select
  to authenticated
  using (public.is_admin() AND (doctor_id = auth.uid() OR doctor_id IS NULL));

-- 7. New UPDATE policy: admins can update only their own appointments
create policy "Allow admins to update own appointments"
  on public.appointments
  for update
  to authenticated
  using (public.is_admin() AND doctor_id = auth.uid())
  with check (public.is_admin() AND doctor_id = auth.uid());
