-- Migração Completa para normalizar a tabela conversations e links com client_profiles

-- 1. Remover Foreign Keys que dependem do phone_number de conversations
ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_phone_number_fkey;
ALTER TABLE suggestions DROP CONSTRAINT IF EXISTS suggestions_phone_number_fkey;
ALTER TABLE conversation_embeddings DROP CONSTRAINT IF EXISTS conversation_embeddings_phone_number_fkey;

-- 2. Modificar tabela conversations para ter um ID UUID como Primary Key
ALTER TABLE conversations DROP CONSTRAINT IF EXISTS conversations_pkey CASCADE;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid();
ALTER TABLE conversations ADD CONSTRAINT conversations_pkey PRIMARY KEY (id);

-- O phone_number ainda precisa ser único para podermos fazer upsert por ele (ex: webhook)
ALTER TABLE conversations ADD CONSTRAINT conversations_phone_number_key UNIQUE (phone_number);

-- 3. Linkar conversations com client_profiles
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES client_profiles(id) ON DELETE SET NULL;
UPDATE conversations c SET client_id = cp.id FROM client_profiles cp WHERE c.phone_number = cp.phone_number AND c.client_id IS NULL;

-- 4. Adicionar conversation_id nas tabelas filhas e popular com o novo ID
-- messages
ALTER TABLE messages ADD COLUMN IF NOT EXISTS conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE;
UPDATE messages m SET conversation_id = c.id FROM conversations c WHERE m.phone_number = c.phone_number AND m.conversation_id IS NULL;

-- suggestions
ALTER TABLE suggestions ADD COLUMN IF NOT EXISTS conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE;
UPDATE suggestions s SET conversation_id = c.id FROM conversations c WHERE s.phone_number = c.phone_number AND s.conversation_id IS NULL;

-- conversation_embeddings
ALTER TABLE conversation_embeddings ADD COLUMN IF NOT EXISTS conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE;
UPDATE conversation_embeddings ce SET conversation_id = c.id FROM conversations c WHERE ce.phone_number = c.phone_number AND ce.conversation_id IS NULL;

-- 5. Adicionar client_id em tldv_meetings para uniformidade
ALTER TABLE tldv_meetings ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES client_profiles(id) ON DELETE CASCADE;
UPDATE tldv_meetings t SET client_id = cp.id FROM client_profiles cp WHERE t.phone_number = cp.phone_number AND t.client_id IS NULL;

-- =========================================================================
-- IMPORTANTE:
-- As colunas phone_number antigas (em messages, suggestions, tldv_meetings)
-- não foram apagadas ainda para não quebrar dependências imediatamente.
-- Apenas quando todo o código for refatorado, faremos a Fase 3 (Drop + Index)
