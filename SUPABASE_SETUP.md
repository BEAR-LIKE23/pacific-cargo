# Supabase Setup Guide

## 1. Run the Database Schema
1.  Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2.  Select your project.
3.  Click on **SQL Editor** (left sidebar).
4.  Click **New Query**.
5.  Copy and paste everything from the file `supabase_schema.sql` in this project.
6.  Click **Run** (bottom right).

> **Note:** If you already created the tables and are getting "column not found" errors, run the content of `schema_update.sql` instead to add the missing columns.

## 2. Create an Admin Account
There is no public "Admin Sign Up" page for security reasons. To make an account an Admin:

1.  **Register** a new account normally on your website: [http://localhost:5173/register](http://localhost:5173/register).
2.  Go to your **Supabase Dashboard** -> **Table Editor** -> `profiles` table.
3.  Find your user row.
4.  Change the `role` column from `user` to `super_admin`.
5.  Click **Save**.
6.  Now you can login at [http://localhost:5173/admin/login](http://localhost:5173/admin/login).
