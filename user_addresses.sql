
-- 5. USER ADDRESSES (Address Book)
create table if not exists public.user_addresses (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    label text not null, -- e.g. 'Home', 'Office', 'Receiver A'
    full_name text not null,
    address text not null,
    phone text not null,
    email text,
    created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.user_addresses enable row level security;

-- Policies
create policy "Users can manage their own addresses"
    on public.user_addresses
    for all
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);
