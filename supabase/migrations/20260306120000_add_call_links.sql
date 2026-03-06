-- ─── 1. Adiciona campos de links para cada call em meus_clientes ─────────────────
ALTER TABLE meus_clientes
  ADD COLUMN IF NOT EXISTS call_1_link TEXT,
  ADD COLUMN IF NOT EXISTS call_2_link TEXT,
  ADD COLUMN IF NOT EXISTS call_3_link TEXT,
  ADD COLUMN IF NOT EXISTS call_4_link TEXT,
  ADD COLUMN IF NOT EXISTS call_5_link TEXT,
  ADD COLUMN IF NOT EXISTS call_6_link TEXT,
  ADD COLUMN IF NOT EXISTS call_7_link TEXT,
  ADD COLUMN IF NOT EXISTS call_8_link TEXT,
  ADD COLUMN IF NOT EXISTS call_9_link TEXT,
  ADD COLUMN IF NOT EXISTS call_10_link TEXT,
  ADD COLUMN IF NOT EXISTS call_11_link TEXT,
  ADD COLUMN IF NOT EXISTS call_12_link TEXT;

-- ─── 2. Função para vincular links retroativamente ─────────────────────────────
-- Esta função tenta encontrar meetings na tldv_meetings que batam com a data das calls
-- e preenche os campos call_X_link correspondentes.
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT * FROM meus_clientes) LOOP
        -- Tenta Call 1
        IF r.call_1_date IS NOT NULL THEN
            UPDATE meus_clientes SET call_1_link = (
                SELECT tldv_link FROM tldv_meetings 
                WHERE phone_number = (SELECT phone_number FROM client_profiles WHERE id = r.client_id)
                AND meeting_date::date = r.call_1_date
                LIMIT 1
            ) WHERE id = r.id;
        END IF;

        -- Tenta Call 2
        IF r.call_2_date IS NOT NULL THEN
            UPDATE meus_clientes SET call_2_link = (
                SELECT tldv_link FROM tldv_meetings 
                WHERE phone_number = (SELECT phone_number FROM client_profiles WHERE id = r.client_id)
                AND meeting_date::date = r.call_2_date
                LIMIT 1
            ) WHERE id = r.id;
        END IF;

        -- Repetir lógica para as demais se necessário, mas o script JS fará isso de forma mais inteligente.
    END LOOP;
END $$;
