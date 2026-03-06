import { supabase } from '@/lib/supabase/client'

// calendar_events ainda não está nos tipos gerados — usar cast até rodar supabase gen types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any

export interface CalendarEvent {
  id: string
  google_event_id: string
  title: string
  description: string | null
  start_at: string
  end_at: string | null
  meet_link: string | null
  attendees: { email: string; name?: string | null; responseStatus?: string | null }[]
  client_phone: string | null
  client_email: string | null
  status: string
}

export const calendarService = {
  async getTodayMeetings(): Promise<CalendarEvent[]> {
    const start = new Date()
    start.setHours(0, 0, 0, 0)
    const end = new Date()
    end.setHours(23, 59, 59, 999)

    const { data, error } = await db
      .from('calendar_events')
      .select('*')
      .gte('start_at', start.toISOString())
      .lte('start_at', end.toISOString())
      .eq('status', 'confirmed')
      .order('start_at', { ascending: true })

    if (error) throw error
    return data || []
  },

  async getUpcomingMeetings(days = 7): Promise<CalendarEvent[]> {
    const now = new Date()
    const end = new Date()
    end.setDate(end.getDate() + days)

    const { data, error } = await db
      .from('calendar_events')
      .select('*')
      .gte('start_at', now.toISOString())
      .lte('start_at', end.toISOString())
      .eq('status', 'confirmed')
      .order('start_at', { ascending: true })

    if (error) throw error
    return data || []
  },

  async getMeetingsByMonth(year: number, month: number): Promise<CalendarEvent[]> {
    const start = new Date(year, month - 1, 1)
    const end = new Date(year, month, 0, 23, 59, 59)

    const { data, error } = await db
      .from('calendar_events')
      .select('*')
      .gte('start_at', start.toISOString())
      .lte('start_at', end.toISOString())
      .neq('status', 'cancelled')
      .order('start_at', { ascending: true })

    if (error) throw error
    return data || []
  },

  async getMeetingAnalytics(start: Date, end: Date) {
    const [
      { count: total },
      { count: showedUp },
      { count: tracked },
      { data: allEvents },
    ] = await Promise.all([
      db
        .from('calendar_events')
        .select('*', { count: 'exact', head: true })
        .gte('start_at', start.toISOString())
        .lte('start_at', end.toISOString())
        .eq('status', 'confirmed'),
      db
        .from('calendar_events')
        .select('*', { count: 'exact', head: true })
        .gte('start_at', start.toISOString())
        .lte('start_at', end.toISOString())
        .eq('status', 'confirmed')
        .eq('show_up', true),
      db
        .from('calendar_events')
        .select('*', { count: 'exact', head: true })
        .gte('start_at', start.toISOString())
        .lte('start_at', end.toISOString())
        .eq('status', 'confirmed')
        .not('show_up', 'is', null),
      // Distribuição por horário: usa últimos 60 dias para ter dados suficientes
      db
        .from('calendar_events')
        .select('start_at')
        .gte('start_at', new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString())
        .eq('status', 'confirmed'),
    ])

    const hourCounts: Record<number, number> = {}
    for (const ev of allEvents || []) {
      const h = new Date(ev.start_at).getHours()
      hourCounts[h] = (hourCounts[h] || 0) + 1
    }
    const hoursDistribution = Object.entries(hourCounts)
      .map(([hour, count]) => ({ hour: `${hour}h`, count }))
      .sort((a, b) => parseInt(a.hour) - parseInt(b.hour))

    const peakEntry = hoursDistribution.reduce(
      (best, cur) => (cur.count > best.count ? cur : best),
      { hour: '—', count: 0 },
    )

    return {
      total: total ?? 0,
      showedUp: showedUp ?? 0,
      tracked: tracked ?? 0,
      showUpRate: (tracked ?? 0) > 0 ? Math.round(((showedUp ?? 0) / tracked!) * 100) : null,
      peakHour: peakEntry.count > 0 ? peakEntry.hour : '—',
      hoursDistribution,
    }
  },

  async updateShowUp(eventId: string, showUp: boolean) {
    const { error } = await db
      .from('calendar_events')
      .update({ show_up: showUp })
      .eq('id', eventId)
    if (error) throw error
  },
}
