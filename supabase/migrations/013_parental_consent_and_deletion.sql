-- Migration: Add parental consent field and account deletion support
-- Date: 2026-05-25

-- Add parental consent column
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS parental_consent BOOLEAN DEFAULT false;

-- Note: The account deletion API removes rows from user_profiles and food_logs.
-- No additional schema changes needed for deletion.

-- Add deletion_requested_at for tracking deletion requests
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS deletion_requested_at TIMESTAMPTZ;

-- Add notifications column for in-app notification system
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS notifications JSONB DEFAULT '[]'::jsonb;

SELECT 'Migration 013 complete: parental_consent, deletion, and notification columns added' as status;
