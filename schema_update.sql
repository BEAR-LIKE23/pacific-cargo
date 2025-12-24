
-- Run this to add payment fields to shipments

ALTER TABLE shipments ADD COLUMN IF NOT EXISTS payment_receipt text;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'Unpaid'; -- Unpaid, Pending Confirmation, Paid

-- Fix Transactions RLS: Allow users to insert their own transactions
create policy "Users can insert own transactions" on transactions for insert with check (auth.uid() = user_id);
