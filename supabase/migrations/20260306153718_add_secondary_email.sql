-- Adiciona a coluna emails_alternativos à tabela client_profiles, caso não exista
ALTER TABLE public.client_profiles
ADD COLUMN IF NOT EXISTS emails_alternativos TEXT[] DEFAULT '{}';
