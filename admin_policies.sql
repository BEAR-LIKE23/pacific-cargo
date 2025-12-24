-- FIX: Allow Admins to UPDATE Shipments (Status, Location)
CREATE POLICY "Admins can update shipments" ON shipments FOR UPDATE USING (
  exists (select 1 from profiles where id = auth.uid() and role = 'super_admin')
);

-- FIX: Allow Admins to VIEW all Transactions (Deposits to approve)
CREATE POLICY "Admins view all transactions" ON transactions FOR SELECT USING (
  exists (select 1 from profiles where id = auth.uid() and role = 'super_admin')
);

-- FIX: Allow Admins to UPDATE Transactions (Approve/Reject)
CREATE POLICY "Admins can update transactions" ON transactions FOR UPDATE USING (
  exists (select 1 from profiles where id = auth.uid() and role = 'super_admin')
);

-- FIX: Allow Admins to UPDATE User Profiles (Credit Wallet Balance)
CREATE POLICY "Admins can update any profile" ON profiles FOR UPDATE USING (
  exists (select 1 from profiles where id = auth.uid() and role = 'super_admin')
);
