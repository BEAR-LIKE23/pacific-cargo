-- 1. Create Notification Logs table
create table if not exists public.notification_logs (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles(id),
    type text not null, -- 'booking', 'status_update', 'deposit'
    recipient_email text not null,
    subject text,
    status text default 'pending', -- pending, sent, failed
    payload jsonb,
    error_message text,
    created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.notification_logs enable row level security;

create policy "Admins can view notification logs" on public.notification_logs
    for select using (exists (select 1 from public.profiles where id = auth.uid() and role = 'super_admin'));

create policy "Admins can insert notification logs" on public.notification_logs
    for insert with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'super_admin'));

-- 1b. Create Dashboard Notifications table (for in-app alerts)
create table if not exists public.notifications (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles(id) on delete cascade,
    title text not null,
    message text not null,
    is_read boolean default false,
    type text default 'info',
    created_at timestamp with time zone default now()
);

alter table public.notifications enable row level security;

create policy "Users can view their own notifications" on public.notifications
    for select using (auth.uid() = user_id);

create policy "Users can update their own notifications" on public.notifications
    for update using (auth.uid() = user_id);

create policy "Admins can insert notifications" on public.notifications
    for insert with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'super_admin'));

-- 2. Trigger for Shipment Booking
create or replace function public.on_booking_notification()
returns trigger as $$
begin
    insert into public.notification_logs (user_id, type, recipient_email, subject, payload)
    values (
        new.user_id, 
        'booking', 
        new.sender_email, 
        'Shipment Registered: ' || new.tracking_code,
        jsonb_build_object('tracking_code', new.tracking_code, 'status', new.status)
    );
    return new;
end;
$$ language plpgsql security definer;

create trigger tr_on_shipment_created
    after insert on public.shipments
    for each row execute procedure public.on_booking_notification();

-- 3. Trigger for Status Updates
create or replace function public.on_status_change_notification()
returns trigger as $$
begin
    if (old.status IS DISTINCT FROM new.status) then
        insert into public.notification_logs (user_id, type, recipient_email, subject, payload)
        values (
            new.user_id, 
            'status_update', 
            new.receiver_email, -- Send to receiver as well? Or based on user_id profile
            'Shipment Status Updated: ' || new.tracking_code,
            jsonb_build_object('tracking_code', new.tracking_code, 'old_status', old.status, 'new_status', new.status, 'location', new.current_location)
        );
    end if;
    return new;
end;
$$ language plpgsql security definer;

create trigger tr_on_shipment_status_change
    after update on public.shipments
    for each row execute procedure public.on_status_change_notification();

-- 4. Trigger for Deposit Approvals
create or replace function public.on_deposit_approved_notification()
returns trigger as $$
begin
    if (old.status = 'pending' and new.status = 'completed' and new.type = 'deposit') then
        insert into public.notification_logs (user_id, type, recipient_email, subject, payload)
        select 
            new.user_id, 
            'deposit', 
            p.email, 
            'Deposit Confirmed',
            jsonb_build_object('amount', new.amount, 'method', new.method)
        from public.profiles p where p.id = new.user_id;
    end if;
    return new;
end;
$$ language plpgsql security definer;

create trigger tr_on_deposit_approved
    after update on public.transactions
    for each row execute procedure public.on_deposit_approved_notification();
