CREATE OR REPLACE VIEW public.dashboard_kpis AS
SELECT
  (
    SELECT COALESCE(EXTRACT(EPOCH FROM AVG(diff)), 0)::numeric
    FROM (
      SELECT 
        m2.created_at - m1.created_at AS diff
      FROM public.messages m1
      JOIN public.messages m2 ON m1.phone_number = m2.phone_number 
        AND m2.sender = 'me' 
        AND m1.sender != 'me' 
        AND m2.created_at > m1.created_at
        AND m2.created_at <= m1.created_at + INTERVAL '1 hour'
      WHERE m1.created_at >= CURRENT_DATE - INTERVAL '7 days'
    ) sub
  ) AS avg_response_time,
  
  (SELECT COUNT(*) FROM public.conversations WHERE manually_closed = false) AS active_conversations,
  
  (SELECT COUNT(*) FROM public.suggestions WHERE approved_at IS NULL) AS pending_suggestions,
  
  (SELECT 
     COALESCE(
       (COUNT(*) FILTER (WHERE was_edited = false)::numeric / NULLIF(COUNT(*), 0)) * 100, 
       0
     )
   FROM public.suggestions 
   WHERE sent_text IS NOT NULL AND created_at >= CURRENT_DATE - INTERVAL '7 days'
  ) AS ai_approval_rate,

  (SELECT COUNT(*) FROM public.messages WHERE sender != 'me' AND created_at >= CURRENT_DATE) AS messages_today,

  (SELECT COUNT(DISTINCT phone_number) FROM public.messages WHERE created_at >= CURRENT_DATE) AS rules_today;
