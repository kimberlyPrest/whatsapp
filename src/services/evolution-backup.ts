import { supabase } from '@/lib/supabase/client'

export interface FetchEvolutionMessagesParams {
  page: number
  limit: number
}

export const fetchEvolutionMessages = async (
  params: FetchEvolutionMessagesParams,
) => {
  const { data, error } = await supabase.functions.invoke('evolution-backup', {
    body: params,
  })

  if (error) {
    console.error('Error invoking evolution-backup edge function:', error)
    throw error
  }

  return data
}
