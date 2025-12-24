-- Run this to store shipment cost
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS cost decimal(12,2) DEFAULT 0.00;
