-- Fix Transactions RLS: Allow users to insert their own transactions
create policy "Users can insert own transactions" on transactions for insert with check (auth.uid() = user_id);

-- Fix: Allow Supabase Auth to create profiles (if not working correctly)
-- drop trigger if exists on_auth_user_created on auth.users;
-- The previous trigger is fine, but ensuring public has access to insert into profiles if triggered by system is good. 
-- Actually, the trigger runs as Security Definer, so it bypasses RLS. Coverage is fine.

-- Add Policy for Shipments if missing
-- create policy "Users can view own shipments" on shipments for select using (auth.uid() = user_id);
