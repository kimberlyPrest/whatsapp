ALTER TABLE public.client_profiles ADD COLUMN IF NOT EXISTS tldv_link TEXT;

CREATE OR REPLACE FUNCTION public.match_tldv_to_client(p_tldv_meeting_id uuid, p_participant_emails text[])
 RETURNS uuid
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$ 
DECLARE 
  v_client_id uuid; 
  v_phone_number text;
  v_email text; 
  v_tldv_link text;
BEGIN 
  FOREACH v_email IN ARRAY p_participant_emails LOOP 
    -- Procura case-insensitive no email principal ou emails alternativos, sem filtrar por propriedade
    SELECT id, phone_number INTO v_client_id, v_phone_number
    FROM public.client_profiles 
    WHERE LOWER(email) = LOWER(v_email) 
       OR LOWER(v_email) = ANY(SELECT LOWER(e) FROM unnest(COALESCE(emails_alternativos, '{}'::text[])) e)
    LIMIT 1; 

    IF v_client_id IS NOT NULL THEN 
      SELECT tldv_link INTO v_tldv_link FROM public.tldv_meetings WHERE id = p_tldv_meeting_id;
      
      -- Atualiza tldv_meetings com o ID, telefone e status
      UPDATE public.tldv_meetings 
      SET client_id = v_client_id, 
          phone_number = v_phone_number,
          match_status = 'matched', 
          matched_email = v_email 
      WHERE id = p_tldv_meeting_id; 
      
      -- Atualiza o tldv_link no perfil do cliente
      UPDATE public.client_profiles
      SET tldv_link = v_tldv_link, updated_at = NOW()
      WHERE id = v_client_id;
      
      RETURN v_client_id; 
    END IF; 
  END LOOP; 

  -- Se não encontrar nenhum match
  UPDATE public.tldv_meetings 
  SET match_status = 'pending_review', client_id = NULL, phone_number = NULL, matched_email = NULL 
  WHERE id = p_tldv_meeting_id; 
  
  RETURN NULL; 
END; 
$function$;

-- Sincronização retroativa de todas as reuniões pendentes ou sem client_id
DO $$
DECLARE
  v_meeting RECORD;
BEGIN
  FOR v_meeting IN 
    SELECT id, participant_emails 
    FROM public.tldv_meetings 
    WHERE client_id IS NULL OR match_status = 'pending_review' OR match_status IS NULL
  LOOP
    IF v_meeting.participant_emails IS NOT NULL AND array_length(v_meeting.participant_emails, 1) > 0 THEN
      PERFORM public.match_tldv_to_client(v_meeting.id, v_meeting.participant_emails);
    END IF;
  END LOOP;
END;
$$;
