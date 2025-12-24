
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES (Extends Auth)
create table profiles (
  id uuid references auth.users(id) on delete cascade not null primary key,
  email text,
  full_name text,
  role text default 'user', -- 'user' or 'admin'
  balance decimal(12,2) default 0.00,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table profiles enable row level security;

-- Policies for Profiles
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

-- 2. APP SETTINGS (Admin Configuration)
create table app_settings (
  id uuid default uuid_generate_v4() primary key,
  bank_name text,
  account_number text,
  account_name text,
  btc_address text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Insert default settings row (only one row needed)
insert into app_settings (bank_name, account_number, account_name, btc_address)
values ('Pacific Bank', '1234567890', 'Pacific Cargo Logistics', 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh');

alter table app_settings enable row level security;
create policy "Settings are viewable by everyone" on app_settings for select using (true);
create policy "Only admins can update settings" on app_settings for update using (
  exists (select 1 from profiles where id = auth.uid() and role = 'super_admin')
);

-- 3. SHIPMENTS
create table shipments (
  id uuid default uuid_generate_v4() primary key,
  tracking_code text unique not null,
  user_id uuid references profiles(id), -- Owner of shipment
  sender_name text,
  sender_address text,
  sender_contact text,
  sender_email text,
  receiver_name text,
  receiver_address text,
  receiver_email text,
  receiver_contact text,
  status text default 'Pending', -- Pending, In Transit, On Hold, Delivered
  current_location text,
  carrier text,
  reference_number text,
  weight text,
  quantity text,
  shipment_mode text,
  destination text,
  payment_mode text,
  dispatch_date date,
  delivery_time text,
  package_description text,
  estimated_delivery date,
  package_type text, -- Document, Parcel, Pallet
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table shipments enable row level security;
create policy "Users view their own shipments" on shipments for select using (auth.uid() = user_id);
create policy "Users can create their own shipments" on shipments for insert with check (auth.uid() = user_id);
create policy "Admins view all shipments" on shipments for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'super_admin')
);
-- Allow anyone to track if they have the code (Public Tracking Page)
create policy "Public tracking by code" on shipments for select using (true);

-- 4. TRANSACTIONS (Wallet History)
create table transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id),
  amount decimal(12,2) not null,
  type text, -- 'deposit', 'payment'
  status text default 'pending', -- pending, completed, failed
  method text, -- 'crypto', 'bank', 'card'
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table transactions enable row level security;
create policy "Users view own transactions" on transactions for select using (auth.uid() = user_id);

-- FUNCTION: Handle New User Signup (Trigger)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'user');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
