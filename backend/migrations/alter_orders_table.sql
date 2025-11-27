-- Add missing columns to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS phone VARCHAR(50) AFTER customer_name;

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS delivery_type VARCHAR(50) AFTER city;

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS event_type VARCHAR(100) AFTER event_board_id;

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS guests_count INT AFTER event_type;
