-- Create a new storage bucket for receipts
insert into storage.buckets (id, name, public)
values ('receipts', 'receipts', true);

-- Policy: Allow authenticated users to upload receipts
create policy "Authenticated users can upload receipts"
  on storage.objects for insert
  with check (
    bucket_id = 'receipts' 
    and auth.role() = 'authenticated'
  );

-- Policy: Allow public to view receipts (needed for Admin viewing)
create policy "Public can view receipts"
  on storage.objects for select
  using ( bucket_id = 'receipts' );
