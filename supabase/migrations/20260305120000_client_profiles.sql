-- Tabela de perfis de clientes (CRM leve)
CREATE TABLE IF NOT EXISTS client_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number TEXT UNIQUE NOT NULL,
  contact_name TEXT,
  email TEXT,
  tipos TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  tldv_link TEXT,
  observations TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE client_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auth users full access" ON client_profiles
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Tabela de reuniões TL.DV
CREATE TABLE IF NOT EXISTS tldv_meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number TEXT REFERENCES client_profiles(phone_number) ON DELETE SET NULL,
  meeting_title TEXT,
  tldv_link TEXT NOT NULL,
  transcript TEXT,
  summary TEXT,
  participant_emails TEXT[] DEFAULT '{}',
  meeting_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE tldv_meetings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auth users full access" ON tldv_meetings
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Trigger: auto-criar/atualizar perfil quando nova conversa chega
CREATE OR REPLACE FUNCTION auto_create_client_profile()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO client_profiles (phone_number, contact_name)
  VALUES (split_part(NEW.phone_number, '@', 1), NEW.contact_name)
  ON CONFLICT (phone_number) DO UPDATE
    SET contact_name = COALESCE(client_profiles.contact_name, EXCLUDED.contact_name),
        updated_at = NOW()
  WHERE client_profiles.contact_name IS NULL;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_auto_client_profile
AFTER INSERT OR UPDATE OF phone_number, contact_name ON conversations
FOR EACH ROW EXECUTE FUNCTION auto_create_client_profile();

-- Popula client_profiles com conversas existentes
INSERT INTO client_profiles (phone_number, contact_name)
SELECT DISTINCT
  split_part(phone_number, '@', 1) AS phone_number,
  contact_name
FROM conversations
WHERE phone_number IS NOT NULL
ON CONFLICT (phone_number) DO UPDATE
  SET contact_name = COALESCE(client_profiles.contact_name, EXCLUDED.contact_name);
