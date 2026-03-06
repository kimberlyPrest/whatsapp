-- Criação de Índices B-Tree para alta performance em buscas e joins

-- 1. Tabelas Principais
-- Garantir índice no phone_number que é muito buscado
CREATE INDEX IF NOT EXISTS idx_client_profiles_phone ON client_profiles(phone_number);
CREATE INDEX IF NOT EXISTS idx_conversations_phone ON conversations(phone_number);

-- 2. Foreign Keys (UUIDs) que acabamos de criar nas Fases anteriores
CREATE INDEX IF NOT EXISTS idx_conversations_client_id ON conversations(client_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_suggestions_conversation_id ON suggestions(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversation_embeddings_conversation_id ON conversation_embeddings(conversation_id);
CREATE INDEX IF NOT EXISTS idx_tldv_meetings_client_id ON tldv_meetings(client_id);
CREATE INDEX IF NOT EXISTS idx_meus_clientes_client_id ON meus_clientes(client_id);

-- 3. Índices Baseados em Uso Constante no Frontend
-- Dashboard Kanban utiliza etapa_negocio 
CREATE INDEX IF NOT EXISTS idx_meus_clientes_etapa ON meus_clientes(etapa_negocio);

-- Busca de mensagens por data e remetente
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message_at ON conversations(last_message_at DESC);

-- Ordenação de reuniões
CREATE INDEX IF NOT EXISTS idx_tldv_meetings_date ON tldv_meetings(meeting_date DESC);
