-- NutriScan: Database functions for crowdsourcing
-- Run this in Supabase SQL Editor

-- Function to increment user's contribution count
CREATE OR REPLACE FUNCTION increment_contributions(user_uuid UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE user_profiles
  SET 
    contributions_count = COALESCE(contributions_count, 0) + 1,
    total_impact = COALESCE(total_impact, 0) + 1
  WHERE user_id = user_uuid;
  
  -- If no profile exists, create one
  IF NOT FOUND THEN
    INSERT INTO user_profiles (user_id, contributions_count, total_impact)
    VALUES (user_uuid, 1, 1);
  END IF;
END;
$$;

-- Function to increment validation counts on products
CREATE OR REPLACE FUNCTION increment_validation(product_uuid UUID, vote_type TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF vote_type = 'approve' THEN
    UPDATE community_products
    SET 
      validation_count = COALESCE(validation_count, 0) + 1,
      approval_count = COALESCE(approval_count, 0) + 1
    WHERE id = product_uuid;
  ELSIF vote_type = 'reject' THEN
    UPDATE community_products
    SET 
      validation_count = COALESCE(validation_count, 0) + 1,
      rejection_count = COALESCE(rejection_count, 0) + 1
    WHERE id = product_uuid;
  END IF;
END;
$$;

-- Function to increment validated count for user
CREATE OR REPLACE FUNCTION increment_validated(user_uuid UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE user_profiles
  SET validated_count = COALESCE(validated_count, 0) + 1
  WHERE user_id = user_uuid;
END;
$$;

SELECT 'Database functions ready!' as status;