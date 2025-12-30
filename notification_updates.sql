
-- 1. Extend Notification Logs for Multi-channel support
alter table public.notification_logs 
add column if not exists channel text default 'email'; -- 'email', 'sms', 'push'

-- 2. Add Phone Number support if missing in profiles (checking schema first)
-- Actually, profiles usually has limited fields, let's check profile schema.
-- Assuming profiles has email, full_name. Let's add phone if helpful.

-- 3. Mock SMS Sending Trigger
create or replace function public.log_sms_notification()
returns trigger as $$
begin
    -- If it's a critical status change, we might want to log an SMS as well
    if (new.type = 'status_update') then
        insert into public.notification_logs (user_id, type, recipient_email, subject, payload, channel)
        values (
            new.user_id, 
            'sms_alert', 
            new.recipient_email, 
            'SMS Alert Requested',
            new.payload || jsonb_build_object('channel', 'sms', 'message', 'Pacific Cargo: Your shipment ' || (new.payload->>'tracking_code') || ' is now ' || (new.payload->>'new_status')),
            'sms'
        );
    end if;
    return new;
end;
$$ language plpgsql security definer;

-- Trigger to create SMS log whenever an email status update is logged
create trigger tr_create_sms_on_status_update
    after insert on public.notification_logs
    for each row 
    when (new.type = 'status_update')
    execute procedure public.log_sms_notification();
