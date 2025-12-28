-- 1. Create shipment_events table
create table if not exists public.shipment_events (
    id uuid default gen_random_uuid() primary key,
    shipment_id uuid references public.shipments(id) on delete cascade not null,
    status text not null,
    location text,
    description text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable RLS on shipment_events
alter table public.shipment_events enable row level security;

-- 3. Policies for shipment_events
create policy "Everyone can view shipment events" 
on public.shipment_events for select 
using (true);

create policy "Admins can insert shipment events" 
on public.shipment_events for insert 
with check (
    exists (
        select 1 from public.profiles 
        where id = auth.uid() and role = 'super_admin'
    )
);

create policy "Users can insert events for their own shipments"
on public.shipment_events for insert
with check (
    exists (
        select 1 from public.shipments 
        where id = shipment_id and user_id = auth.uid()
    )
);

-- 3b. Automatic Event Logging Trigger
create or replace function public.log_shipment_creation()
returns trigger as $$
begin
    insert into public.shipment_events (shipment_id, status, location, description)
    values (new.id, 'Shipment Created', coalesce(new.current_location, 'Origin'), 'Shipment registered in the system.');
    return new;
end;
$$ language plpgsql security definer;

drop trigger if exists tr_log_shipment_creation on public.shipments;
create trigger tr_log_shipment_creation
    after insert on public.shipments
    for each row execute procedure public.log_shipment_creation();

-- 3c. Automatic Status Update Logger
create or replace function public.log_shipment_update()
returns trigger as $$
begin
    if (old.status is distinct from new.status or old.current_location is distinct from new.current_location) then
        insert into public.shipment_events (shipment_id, status, location, description)
        values (
            new.id, 
            new.status, 
            coalesce(new.current_location, 'In Transit'), 
            'Shipment status updated to ' || new.status || ' at ' || coalesce(new.current_location, 'location')
        );
    end if;
    return new;
end;
$$ language plpgsql security definer;

drop trigger if exists tr_log_shipment_update on public.shipments;
create trigger tr_log_shipment_update
    after update on public.shipments
    for each row execute procedure public.log_shipment_update();

-- Drop previous versions to avoid overloading ambiguity in PostgREST
drop function if exists public.add_wallet_funds(numeric, text);
drop function if exists public.add_wallet_funds(numeric, text, uuid);

-- 4. Create secure wallet funding function (RPC)
create or replace function public.add_wallet_funds(
    amount numeric, 
    reference_id text, 
    user_id uuid default null
)
returns void
language plpgsql
security definer -- Runs with elevated privileges
as $$
declare
    target_user_id uuid;
begin
    -- Determine which user to fund: passed user_id or current authenticated user
    target_user_id := coalesce(add_wallet_funds.user_id, auth.uid());

    if target_user_id is null then
        raise exception 'User identification failed. Please login and try again.';
    end if;

    -- 1. Update the user's balance
    update public.profiles p
    set balance = coalesce(p.balance, 0) + add_wallet_funds.amount
    where p.id = target_user_id;

    -- 2. Create a transaction record
    insert into public.transactions (user_id, amount, type, status, method, description)
    values (
        target_user_id, 
        add_wallet_funds.amount, 
        'deposit', 
        'completed', 
        'card', 
        'Wallet funding via Paystack: ' || coalesce(add_wallet_funds.reference_id, 'manual_ref')
    );
end;
$$;

-- 5. Create secure shipment payment function (RPC)
create or replace function public.pay_for_shipment(shipment_cost numeric, tracking_id text)
returns void
language plpgsql
security definer
as $$
declare
    current_bal numeric;
begin
    -- 1. Get current balance
    select balance into current_bal from public.profiles where id = auth.uid();

    -- 2. Check if enough funds
    if current_bal < shipment_cost then
        raise exception 'Insufficient funds';
    end if;

    -- 3. Deduct funds
    update public.profiles
    set balance = balance - shipment_cost
    where id = auth.uid();

    -- 4. Log transaction
    insert into public.transactions (user_id, amount, type, status, method, description)
    values (auth.uid(), shipment_cost, 'payment', 'completed', 'wallet', 'Payment for shipment ' || tracking_id);
end;
$$;

-- 6. Lock down profiles table balance column
-- Note: Supabase RLS doesn't easily support column-level constraints for UPDATE without splitting rows,
-- but we can use a TRIGGER to prevent non-admins from changing their own balance directly.

create or replace function public.protect_user_balance()
returns trigger
language plpgsql
security definer
as $$
begin
    -- Bypass if the update is coming from a SECURITY DEFINER function (which runs as the owner/postgres)
    -- This allows our pay_for_shipment and add_wallet_funds RPCs to work.
    if (current_user = 'postgres') then
        return new;
    end if;

    -- If the role is not super_admin and balance is being changed
    if (select role from public.profiles where id = auth.uid()) != 'super_admin' then
        if (new.balance != old.balance) then
            raise exception 'Direct balance updates are not allowed. Use the provided payment methods.';
        end if;
    end if;
    return new;
end;
$$;

-- Apply trigger to profiles
drop trigger if exists ensure_balance_security on public.profiles;
create trigger ensure_balance_security
before update on public.profiles
for each row
execute function public.protect_user_balance();
