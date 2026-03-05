-- =============================================================================
-- Migration: Setup pg_cron para processamento automático de sugestões de IA
--
-- Esta migration substitui a dependência do Workflow 2 do n8n.
-- O cron roda a cada minuto e chama a edge function `processar-sugestao`,
-- que verifica conversas com debounce de 3 minutos e gera sugestões de IA.
--
-- ANTES DE EXECUTAR:
--   1. Ative as extensões no painel Supabase: Database → Extensions:
--      - pg_cron
--      - pg_net
--   2. Copie a SERVICE_ROLE_KEY do painel Supabase: Settings → API
--   3. Substitua 'SUPABASE_SERVICE_ROLE_KEY_AQUI' abaixo pela chave real
--   4. Confirme que a URL do projeto está correta (lasmxppjkfpypotnweyj)
-- =============================================================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Remove cron job antigo se existir (para re-execuções seguras)
SELECT cron.unschedule('processar-sugestoes-pendentes') WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'processar-sugestoes-pendentes'
);

-- Agenda processamento de sugestões a cada minuto
SELECT cron.schedule(
  'processar-sugestoes-pendentes',
  '* * * * *',
  $$
  SELECT
    net.http_post(
      url        := 'https://lasmxppjkfpypotnweyj.supabase.co/functions/v1/processar-sugestao',
      headers    := jsonb_build_object(
                      'Content-Type',  'application/json',
                      'Authorization', 'Bearer SUPABASE_SERVICE_ROLE_KEY_AQUI'
                    ),
      body       := '{"scheduled": true}'::jsonb,
      timeout_ms := 55000
    ) AS request_id;
  $$
);

-- Verifica se o cron foi criado
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'processar-sugestoes-pendentes') THEN
    RAISE NOTICE 'Cron job "processar-sugestoes-pendentes" criado com sucesso.';
  ELSE
    RAISE WARNING 'FALHA ao criar cron job. Verifique se pg_cron está habilitado.';
  END IF;
END;
$$;
