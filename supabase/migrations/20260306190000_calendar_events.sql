-- Tabela de eventos do Google Calendar
CREATE TABLE IF NOT EXISTS calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  google_event_id TEXT UNIQUE NOT NULL,
  title TEXT,
  description TEXT,
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ,
  meet_link TEXT,
  attendees JSONB DEFAULT '[]',
  client_phone TEXT,
  client_email TEXT,
  status TEXT DEFAULT 'confirmed',
  synced_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_calendar_events_start ON calendar_events(start_at);
CREATE INDEX IF NOT EXISTS idx_calendar_events_client ON calendar_events(client_phone);

ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth users full access" ON calendar_events
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Campos novos em client_profiles
ALTER TABLE client_profiles ADD COLUMN IF NOT EXISTS next_meeting_at TIMESTAMPTZ;
ALTER TABLE client_profiles ADD COLUMN IF NOT EXISTS next_meeting_link TEXT;
ALTER TABLE client_profiles ADD COLUMN IF NOT EXISTS emails_alternativos TEXT[] DEFAULT '{}';

-- Cron: sync a cada 15 minutos
SELECT cron.schedule(
  'sync-google-calendar',
  '*/15 * * * *',
  $$
  SELECT net.http_post(
    url := (SELECT value FROM vault.decrypted_secrets WHERE name = 'SUPABASE_URL') || '/functions/v1/sync-calendar',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || (SELECT value FROM vault.decrypted_secrets WHERE name = 'SUPABASE_SERVICE_ROLE_KEY'),
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb
  )
  $$
);
