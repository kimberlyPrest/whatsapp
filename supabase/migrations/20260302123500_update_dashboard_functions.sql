-- 1. Helper Function to calculate business seconds
CREATE OR REPLACE FUNCTION public.calculate_business_seconds(start_ts timestamptz, end_ts timestamptz)
RETURNS numeric
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
    total_seconds numeric := 0;
    current_day date;
    end_day date;
    day_start timestamptz;
    day_end timestamptz;
BEGIN
    IF start_ts >= end_ts THEN
        RETURN 0;
    END IF;

    current_day := (start_ts AT TIME ZONE 'America/Sao_Paulo')::date;
    end_day := (end_ts AT TIME ZONE 'America/Sao_Paulo')::date;

    WHILE current_day <= end_day LOOP
        IF EXTRACT(ISODOW FROM current_day) < 6 THEN
            day_start := GREATEST(start_ts, ((current_day + time '09:00:00') AT TIME ZONE 'America/Sao_Paulo'));
            day_end := LEAST(end_ts, ((current_day + time '18:00:00') AT TIME ZONE 'America/Sao_Paulo'));
            
            IF day_start < day_end THEN
                total_seconds := total_seconds + EXTRACT(EPOCH FROM (day_end - day_start));
            END IF;
        END IF;

        current_day := current_day + 1;
    END LOOP;

    RETURN total_seconds;
END;
$$;

-- 2. Drop old functions taking 'text'
DROP FUNCTION IF EXISTS public.get_dashboard_stats(text);
DROP FUNCTION IF EXISTS public.get_chart_conversations_per_day(text);
DROP FUNCTION IF EXISTS public.get_chart_ai_performance(text);

-- 3. Create updated get_dashboard_stats
CREATE OR REPLACE FUNCTION public.get_dashboard_stats(p_start_date timestamptz, p_end_date timestamptz)
RETURNS TABLE (
  avg_response_time numeric,
  active_conversations bigint,
  pending_suggestions bigint,
  ai_approval_rate numeric,
  messages_received bigint,
  clients_served bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (
      SELECT COALESCE(AVG(public.calculate_business_seconds(incoming_time, reply_time)), 0)::numeric
      FROM (
        SELECT 
          m1.created_at AS incoming_time,
          MIN(m2.created_at) AS reply_time
        FROM public.messages m1
        JOIN public.messages m2 
          ON m1.phone_number = m2.phone_number 
          AND m2.sender = 'me' 
          AND m2.created_at > m1.created_at
        WHERE m1.sender != 'me' 
          AND m1.created_at >= p_start_date
          AND m1.created_at <= p_end_date
        GROUP BY m1.id, m1.created_at
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
     WHERE sent_text IS NOT NULL 
       AND created_at >= p_start_date 
       AND created_at <= p_end_date
    ) AS ai_approval_rate,

    (SELECT COUNT(*) FROM public.messages 
     WHERE sender != 'me' 
       AND created_at >= p_start_date 
       AND created_at <= p_end_date
    ) AS messages_received,

    (SELECT COUNT(DISTINCT phone_number) FROM public.messages 
     WHERE created_at >= p_start_date 
       AND created_at <= p_end_date
    ) AS clients_served;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 4. Create updated get_chart_conversations_per_day
CREATE OR REPLACE FUNCTION public.get_chart_conversations_per_day(p_start_date timestamptz, p_end_date timestamptz)
RETURNS TABLE (
  date date,
  count bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (m.created_at AT TIME ZONE 'America/Sao_Paulo')::date AS date,
    COUNT(DISTINCT m.phone_number) AS count
  FROM public.messages m
  WHERE m.created_at >= p_start_date
    AND m.created_at <= p_end_date
  GROUP BY (m.created_at AT TIME ZONE 'America/Sao_Paulo')::date
  ORDER BY (m.created_at AT TIME ZONE 'America/Sao_Paulo')::date ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 5. Create updated get_chart_ai_performance
CREATE OR REPLACE FUNCTION public.get_chart_ai_performance(p_start_date timestamptz, p_end_date timestamptz)
RETURNS TABLE (
  date date,
  approved bigint,
  edited bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (s.created_at AT TIME ZONE 'America/Sao_Paulo')::date AS date,
    COUNT(*) FILTER (WHERE s.was_edited = false) AS approved,
    COUNT(*) FILTER (WHERE s.was_edited = true) AS edited
  FROM public.suggestions s
  WHERE s.sent_text IS NOT NULL 
    AND s.created_at >= p_start_date 
    AND s.created_at <= p_end_date
  GROUP BY (s.created_at AT TIME ZONE 'America/Sao_Paulo')::date
  ORDER BY (s.created_at AT TIME ZONE 'America/Sao_Paulo')::date ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
