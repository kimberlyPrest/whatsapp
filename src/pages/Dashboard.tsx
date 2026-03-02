import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from 'recharts'
import {
  Users,
  MessageSquare,
  Zap,
  CheckCircle2,
  Clock,
  UserCheck,
  Calendar as CalendarIcon,
} from 'lucide-react'
import { whatsappService } from '@/lib/services/whatsapp'
import { useToast } from '@/hooks/use-toast'

function Trend({
  current,
  previous,
  inverse = false,
}: {
  current?: number
  previous?: number
  inverse?: boolean
}) {
  if (
    previous === undefined ||
    current === undefined ||
    isNaN(current) ||
    isNaN(previous)
  ) {
    return <span className="text-xs text-gray-400 font-medium ml-2">—</span>
  }

  if (previous === 0) {
    if (current > 0)
      return (
        <span className="text-xs text-emerald-600 font-medium ml-2">
          ↑ 100%
        </span>
      )
    return <span className="text-xs text-gray-400 font-medium ml-2">—</span>
  }

  const diff = current - previous
  const percent = (diff / previous) * 100
  const isPositive = diff > 0
  const isGood = inverse ? !isPositive : isPositive

  if (percent === 0)
    return <span className="text-xs text-gray-400 font-medium ml-2">—</span>

  return (
    <span
      className={cn(
        'text-xs font-medium ml-2',
        isGood ? 'text-emerald-600' : 'text-rose-600',
      )}
    >
      {isPositive ? '↑' : '↓'} {Math.abs(percent).toFixed(1)}%
    </span>
  )
}

export default function Dashboard() {
  const [date, setDate] = useState<{ from: Date; to?: Date }>(() => {
    const to = new Date()
    const from = new Date()
    from.setDate(from.getDate() - 7)
    return { from, to }
  })

  const [stats, setStats] = useState<any>(null)
  const [prevStats, setPrevStats] = useState<any>(null)
  const [convPerDay, setConvPerDay] = useState<any[]>([])
  const [aiPerf, setAiPerf] = useState<any[]>([])
  const [statusDist, setStatusDist] = useState<any[]>([])
  const [topRules, setTopRules] = useState<any[]>([])
  const [lastConvs, setLastConvs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isFetching, setIsFetching] = useState(false)

  const { toast } = useToast()
  const navigate = useNavigate()

  const getPreviousPeriod = (from: Date, to: Date) => {
    const timeDiff = to.getTime() - from.getTime()
    const daysDiff = Math.max(1, Math.ceil(timeDiff / (1000 * 60 * 60 * 24)))

    const prevTo = new Date(from)
    prevTo.setSeconds(prevTo.getSeconds() - 1)

    const prevFrom = new Date(prevTo)
    prevFrom.setDate(prevFrom.getDate() - daysDiff)

    return { prevFrom, prevTo }
  }

  useEffect(() => {
    async function loadData() {
      if (!date?.from) return

      setIsFetching(true)
      try {
        const start = new Date(date.from)
        start.setHours(0, 0, 0, 0)

        const end = new Date(date.to || date.from)
        end.setHours(23, 59, 59, 999)

        const { prevFrom, prevTo } = getPreviousPeriod(start, end)

        const [kpis, prevKpis, perDay, perf, dist, rules, convs] =
          await Promise.all([
            whatsappService.getDashboardStats(start, end),
            whatsappService.getDashboardStats(prevFrom, prevTo),
            whatsappService.getConversationsPerDay(start, end),
            whatsappService.getAIPerformance(start, end),
            whatsappService.getStatusDistribution(),
            whatsappService.getTopRules(),
            whatsappService.getLastUpdatedConversations(),
          ])

        setStats(kpis)
        setPrevStats(prevKpis)
        setConvPerDay(perDay)
        setAiPerf(perf)
        setStatusDist(dist)
        setTopRules(rules)
        setLastConvs(convs)
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: 'Erro ao carregar dados do dashboard',
        })
      } finally {
        setLoading(false)
        setIsFetching(false)
      }
    }

    loadData()
  }, [date])

  const formatTime = (seconds: number) => {
    if (!seconds) return '0s'
    if (seconds < 60) return `${Math.round(seconds)}s`
    if (seconds < 3600) {
      const mins = Math.floor(seconds / 60)
      const secs = Math.round(seconds % 60)
      return `${mins}m ${secs}s`
    }
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${mins}m`
  }

  const formatDate = (d: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(d)
  }

  const COLORS = ['#25D366', '#3B82F6', '#EF4444', '#FBBF24', '#6B7280']

  if (loading) {
    return <div className="p-8">Carregando dashboard...</div>
  }

  return (
    <div className="p-4 md:p-8 space-y-8 bg-[#F8FAFC] min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-[#111B21]">
            Dashboard Analytics
          </h1>
          <p className="text-gray-500">
            Acompanhe a performance do seu atendimento inteligente.
          </p>
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full md:w-[300px] justify-start text-left font-normal bg-white',
                !date && 'text-muted-foreground',
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  `${formatDate(date.from)} - ${formatDate(date.to)}`
                ) : (
                  formatDate(date.from)
                )
              ) : (
                <span>Selecione um período</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={{ from: date?.from, to: date?.to }}
              onSelect={(range: any) => {
                if (range) {
                  setDate({ from: range.from, to: range.to })
                }
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div
        className={cn(
          'space-y-8 transition-opacity duration-200',
          isFetching && 'opacity-60 pointer-events-none',
        )}
      >
        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <Card className="border-l-4 border-l-[#25D366]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Conversas Ativas
              </CardTitle>
              <Users className="h-4 w-4 text-[#25D366]" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline">
                <div className="text-2xl font-bold">
                  {stats?.active_conversations || 0}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#EF4444]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Sugestões Pendentes
              </CardTitle>
              <Zap className="h-4 w-4 text-[#EF4444]" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline">
                <div className="text-2xl font-bold">
                  {stats?.pending_suggestions || 0}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#3B82F6]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tempo Médio Resposta
              </CardTitle>
              <Clock className="h-4 w-4 text-[#3B82F6]" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline">
                <div className="text-2xl font-bold">
                  {formatTime(stats?.avg_response_time || 0)}
                </div>
                <Trend
                  current={Number(stats?.avg_response_time || 0)}
                  previous={Number(prevStats?.avg_response_time || 0)}
                  inverse={true}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#FBBF24]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Aprovação IA
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-[#FBBF24]" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline">
                <div className="text-2xl font-bold">
                  {Math.round(stats?.ai_approval_rate || 0)}%
                </div>
                <Trend
                  current={Number(stats?.ai_approval_rate || 0)}
                  previous={Number(prevStats?.ai_approval_rate || 0)}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#111B21]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Mensagens Recebidas
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-[#111B21]" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline">
                <div className="text-2xl font-bold">
                  {stats?.messages_received || 0}
                </div>
                <Trend
                  current={Number(stats?.messages_received || 0)}
                  previous={Number(prevStats?.messages_received || 0)}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#7C3AED]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Clientes Atendidos
              </CardTitle>
              <UserCheck className="h-4 w-4 text-[#7C3AED]" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline">
                <div className="text-2xl font-bold">
                  {stats?.clients_served || 0}
                </div>
                <Trend
                  current={Number(stats?.clients_served || 0)}
                  previous={Number(prevStats?.clients_served || 0)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Graphs */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Conversas por Dia</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={convPerDay}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#E2E8F0"
                  />
                  <XAxis
                    dataKey="date"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => {
                      if (!value) return ''
                      // Use sub-strings to avoid timezone shifts when passing 'YYYY-MM-DD'
                      const parts = value.split('-')
                      if (parts.length === 3) {
                        return `${parts[2]}/${parts[1]}`
                      }
                      return new Date(value).toLocaleDateString([], {
                        day: '2-digit',
                        month: '2-digit',
                      })
                    }}
                  />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#25D366"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Distribuição de Status</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDist}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="status"
                  >
                    {statusDist.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Performance IA</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={aiPerf}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#E2E8F0"
                  />
                  <XAxis
                    dataKey="date"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => {
                      if (!value) return ''
                      const parts = value.split('-')
                      if (parts.length === 3) {
                        return `${parts[2]}/${parts[1]}`
                      }
                      return new Date(value).toLocaleDateString([], {
                        day: '2-digit',
                        month: '2-digit',
                      })
                    }}
                  />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="approved"
                    name="Aprovada s/ edição"
                    fill="#25D366"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="edited"
                    name="Editada antes de enviar"
                    fill="#FBBF24"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Top 5 Regras Autônomas</CardTitle>
              <CardDescription>Escalonamento por uso total.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topRules.map((rule) => (
                  <div key={rule.rule_name} className="flex items-center">
                    <div className="w-full space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-[#111B21]">
                          {rule.rule_name}
                        </span>
                        <span className="text-gray-500">
                          {rule.usage_count} acionamentos
                        </span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#25D366]"
                          style={{
                            width: `${(rule.usage_count / (topRules[0]?.usage_count || 1)) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Conversations Table */}
        <Card>
          <CardHeader>
            <CardTitle>Últimas Atualizações</CardTitle>
            <CardDescription>
              Acesse as conversas mais recentes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contato</TableHead>
                  <TableHead>Última Mensagem</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Horário</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lastConvs.map((conv) => (
                  <TableRow
                    key={conv.phone_number}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() =>
                      navigate('/whatsapp', {
                        state: { selectedId: conv.phone_number },
                      })
                    }
                  >
                    <TableCell className="font-medium">
                      {conv.contact_name || conv.phone_number}
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate text-gray-500">
                      {conv.last_message_text}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        style={{
                          backgroundColor: conv.status_color + '20',
                          borderColor: conv.status_color,
                          color: conv.status_color,
                        }}
                      >
                        {conv.status?.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-500">
                      {conv.last_message_at
                        ? new Date(conv.last_message_at).toLocaleString()
                        : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
