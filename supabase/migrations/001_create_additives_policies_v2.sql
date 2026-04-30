DROP POLICY IF EXISTS "Additives are viewable by everyone" ON additives;
DROP POLICY IF EXISTS "Service role can manage additives" ON additives;
CREATE POLICY "Additives are viewable by everyone v2" ON additives FOR SELECT USING (true);
CREATE POLICY "Service role can manage additives v2" ON additives FOR ALL USING (auth.role() = 'service_role');
