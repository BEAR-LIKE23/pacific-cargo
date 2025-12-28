-- 1. Drop the policy if it exists to avoid conflicts
drop policy if exists "Admins can insert settings" on app_settings;

-- 2. Re-create the INSERT policy
create policy "Admins can insert settings" on app_settings for insert with check (
  exists (select 1 from profiles where id = auth.uid() and role = 'super_admin')
);

-- 3. Ensure there is at least one row (if table is empty)
insert into app_settings (bank_name, account_number, account_name, btc_address)
select 'Pacific Bank', '1234567890', 'Pacific Cargo Logistics', 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
where not exists (select 1 from app_settings);

-- 4. Verify your own role (Optional: View output to confirm you are super_admin)
select id, email, role from profiles where id = auth.uid();
