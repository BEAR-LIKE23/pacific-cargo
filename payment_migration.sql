
-- Rename btc_address to usdt_address in app_settings
ALTER TABLE app_settings RENAME COLUMN btc_address TO usdt_address;

-- Add receipt_url to transactions
ALTER TABLE transactions ADD COLUMN receipt_url TEXT;

-- Verify/Reinforce Storage Policy for receipts
-- (Assuming storage_setup.sql was already run manually or via CLI)
-- If not, this ensures the transactions table is ready for the URLs.
