-- Renovar o watch do Google Calendar a cada 6 dias (expira em 7)
select cron.schedule(
  'renew-calendar-watch',
  '0 9 */6 * *',
  $$
  select net.http_post(
    url := 'https://lasmxppjkfpypotnweyj.supabase.co/functions/v1/calendar-webhook?setup=1',
    headers := jsonb_build_object(
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxhc214cHBqa2ZweXBvdG53ZXlqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTAxMTY2MiwiZXhwIjoyMDg2NTg3NjYyfQ.n59b02WdhrYIHtHeWvDkH5rwlEVzWc3cI3FVqmXWKrc',
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb
  )
  $$
);
