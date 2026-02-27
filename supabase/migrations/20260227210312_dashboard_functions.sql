-- Migration to replace static views with functions that support time ranges

-- 1. Function for Dashboard KPIs
CREATE OR REPLACE FUNCTION public.get_dashboard_stats(p_time_range text DEFAULT 'day')
RETURNS TABLE (
  avg_response_time numeric,
  active_conversations bigint,
  pending_suggestions bigint,
  ai_approval_rate numeric,
  messages_received bigint,
  clients_served bigint
) AS $$
DECLARE
  v_start_date timestamptz;
BEGIN
  IF p_time_range = 'week' THEN
    v_start_date := CURRENT_DATE - INTERVAL '7 days';
  ELSIF p_time_range = 'month' THEN
    v_start_date := CURRENT_DATE - INTERVAL '30 days';
  ELSE
    -- 'day'
    v_start_date := CURRENT_DATE;
  END IF;

  RETURN QUERY
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
        WHERE m1.created_at >= v_start_date
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
     WHERE sent_text IS NOT NULL AND created_at >= v_start_date
    ) AS ai_approval_rate,

    (SELECT COUNT(*) FROM public.messages WHERE sender != 'me' AND created_at >= v_start_date) AS messages_received,

    (SELECT COUNT(DISTINCT phone_number) FROM public.messages WHERE created_at >= v_start_date) AS clients_served;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 2. Function for Conversations per Day Chart
CREATE OR REPLACE FUNCTION public.get_chart_conversations_per_day(p_time_range text DEFAULT 'day')
RETURNS TABLE (
  date date,
  count bigint
) AS $$
DECLARE
  v_start_date date;
BEGIN
  IF p_time_range = 'month' THEN
    v_start_date := CURRENT_DATE - INTERVAL '30 days';
  ELSE
    -- For 'day' and 'week', we show 7 days of context
    v_start_date := CURRENT_DATE - INTERVAL '7 days';
  END IF;

  RETURN QUERY
  SELECT 
    m.created_at::date AS date,
    COUNT(DISTINCT m.phone_number) AS count
  FROM public.messages m
  WHERE m.created_at::date >= v_start_date
  GROUP BY m.created_at::date
  ORDER BY m.created_at::date ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 3. Function for AI Performance Chart
CREATE OR REPLACE FUNCTION public.get_chart_ai_performance(p_time_range text DEFAULT 'day')
RETURNS TABLE (
  date date,
  approved bigint,
  edited bigint
) AS $$
DECLARE
  v_start_date date;
BEGIN
  IF p_time_range = 'month' THEN
    v_start_date := CURRENT_DATE - INTERVAL '30 days';
  ELSE
    v_start_date := CURRENT_DATE - INTERVAL '7 days';
  END IF;

  RETURN QUERY
  SELECT 
    s.created_at::date AS date,
    COUNT(*) FILTER (WHERE s.was_edited = false) AS approved,
    COUNT(*) FILTER (WHERE s.was_edited = true) AS edited
  FROM public.suggestions s
  WHERE s.sent_text IS NOT NULL AND s.created_at::date >= v_start_date
  GROUP BY s.created_at::date
  ORDER BY s.created_at::date ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
