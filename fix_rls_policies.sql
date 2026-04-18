/* 
  RUN THIS IN YOUR SUPABASE SQL EDITOR
  This script ensures that the 'messages' table is accessible to unauthenticated (anonymous) users.
*/

-- 1. Enable RLS (Make sure it's turned on)
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to avoid conflicts (if they exist)
DROP POLICY IF EXISTS "Kanal Terbuka: Semua bisa baca" ON messages;
DROP POLICY IF EXISTS "Kanal Terbuka: Semua bisa kirim" ON messages;
DROP POLICY IF EXISTS "Public Read Access" ON messages;
DROP POLICY IF EXISTS "Public Insert Access" ON messages;

-- 3. Create Policy for PUBLIC READ (SELECT)
CREATE POLICY "Public Read Access"
ON messages
FOR SELECT
TO anon
USING (true);

-- 4. Create Policy for PUBLIC INSERT (INSERT)
CREATE POLICY "Public Insert Access"
ON messages
FOR INSERT
TO anon
WITH CHECK (true);

-- 5. Final verification: Grant all to anon (sometimes needed for sequences)
GRANT ALL ON TABLE messages TO anon;
GRANT ALL ON TABLE messages TO postgres;
GRANT ALL ON TABLE messages TO authenticated;
GRANT ALL ON TABLE messages TO service_role;
