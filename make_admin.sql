-- Instructions:
-- 1. Sign up a new user via the website's Register page (e.g., admin@pacificcargo.com).
-- 2. Run the following command in the Supabase SQL Editor, replacing the email with the one you just created.

UPDATE public.profiles
SET role = 'super_admin'
WHERE email = 'admin@pacificcargo.com'; -- Replace with your actual email
