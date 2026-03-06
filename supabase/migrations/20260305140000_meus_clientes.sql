-- ─── 1. Adiciona coluna "propriedade" em client_profiles ─────────────────────
-- true  = cliente meu (aparece em meus_clientes)
-- false = não é meu cliente (padrão)
ALTER TABLE client_profiles
  ADD COLUMN IF NOT EXISTS propriedade BOOLEAN NOT NULL DEFAULT FALSE;

-- ─── 2. Cria tabela meus_clientes ─────────────────────────────────────────────
-- Uma linha por cliente que é "minha propriedade".
-- Referencia client_profiles pelo id (UUID) — chave mais robusta que phone_number.
CREATE TABLE IF NOT EXISTS meus_clientes (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id        UUID UNIQUE NOT NULL
                   REFERENCES client_profiles(id) ON DELETE CASCADE,

  tldv_link        TEXT,        -- link TL.DV mais recente (migrado de client_profiles)
  etapa_negocio    TEXT,        -- ex: "2ª Reunião Agendada", "Form preenchido", etc.

  -- Datas das calls 1–12
  call_1_date      DATE,
  call_2_date      DATE,
  call_3_date      DATE,
  call_4_date      DATE,
  call_5_date      DATE,
  call_6_date      DATE,
  call_7_date      DATE,
  call_8_date      DATE,
  call_9_date      DATE,
  call_10_date     DATE,
  call_11_date     DATE,
  call_12_date     DATE,

  -- Notas CSAT 1–12 (0.0 – 10.0)
  csat_1           NUMERIC,
  csat_2           NUMERIC,
  csat_3           NUMERIC,
  csat_4           NUMERIC,
  csat_5           NUMERIC,
  csat_6           NUMERIC,
  csat_7           NUMERIC,
  csat_8           NUMERIC,
  csat_9           NUMERIC,
  csat_10          NUMERIC,
  csat_11          NUMERIC,
  csat_12          NUMERIC,

  -- Comentários CSAT 1–12
  csat_comment_1   TEXT,
  csat_comment_2   TEXT,
  csat_comment_3   TEXT,
  csat_comment_4   TEXT,
  csat_comment_5   TEXT,
  csat_comment_6   TEXT,
  csat_comment_7   TEXT,
  csat_comment_8   TEXT,
  csat_comment_9   TEXT,
  csat_comment_10  TEXT,
  csat_comment_11  TEXT,
  csat_comment_12  TEXT,

  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE meus_clientes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auth users full access" ON meus_clientes
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ─── 3. Migra tldv_link de client_profiles → meus_clientes ───────────────────
INSERT INTO meus_clientes (client_id, tldv_link)
SELECT id, tldv_link
FROM   client_profiles
WHERE  tldv_link IS NOT NULL
ON CONFLICT (client_id) DO UPDATE
  SET tldv_link = EXCLUDED.tldv_link;

-- ─── 4. Remove tldv_link de client_profiles ───────────────────────────────────
ALTER TABLE client_profiles DROP COLUMN IF EXISTS tldv_link;
