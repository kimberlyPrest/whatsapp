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
    TrendingUp,
} from 'lucide-react'
import { whatsappService } from '@/lib/services/whatsapp'
import { useToast } from '@/hooks/use-toast'

export default function Dashboard() {
    const [stats, setStats] = useState<any>(null)
    const [convPerDay, setConvPerDay] = useState<any[]>([])
    const [aiPerf, setAiPerf] = useState<any[]>([])
    const [statusDist, setStatusDist] = useState<any[]>([])
    const [topRules, setTopRules] = useState<any[]>([])
    const [lastConvs, setLastConvs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const { toast } = useToast()
    const navigate = useNavigate()

    useEffect(() => {
        async function loadData() {
            try {
                const [kpis, perDay, perf, dist, rules, convs] = await Promise.all([
                    whatsappService.getDashboardStats(),
                    whatsappService.getConversationsPerDay(),
                    whatsappService.getAIPerformance(),
                    whatsappService.getStatusDistribution(),
                    whatsappService.getTopRules(),
                    whatsappService.getLastUpdatedConversations(),
                ])

                setStats(kpis)
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
            }
        }

        loadData()
    }, [])

    const formatTIme = (seconds: number) => {
        if (seconds < 60) return `${Math.round(seconds)}s`
        const mins = Math.floor(seconds / 60)
        const secs = Math.round(seconds % 60)
        return `${mins}m ${secs}s`
    }

    const COLORS = ['#25D366', '#3B82F6', '#EF4444', '#FBBF24', '#6B7280']

    if (loading) {
        return <div className="p-8">Carregando dashboard...</div>
    }

    return (
        <div className="p-4 md:p-8 space-y-8 bg-[#F8FAFC] min-h-screen">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-[#111B21]">Dashboard Analytics</h1>
                <p className="text-gray-500">Acompanhe a performance do seu atendimento inteligente.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                <Card className="border-l-4 border-l-[#25D366]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Conversas Ativas</CardTitle>
                        <Users className="h-4 w-4 text-[#25D366]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.active_conversations}</div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-[#EF4444]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sugestões Pendentes</CardTitle>
                        <Zap className="h-4 w-4 text-[#EF4444]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.pending_suggestions}</div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-[#3B82F6]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tempo Médio Resposta</CardTitle>
                        <Clock className="h-4 w-4 text-[#3B82F6]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatTIme(stats?.avg_response_time)}</div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-[#FBBF24]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Aprovação IA (7d)</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-[#FBBF24]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{Math.round(stats?.ai_approval_rate)}%</div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-[#111B21]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Mensagens Hoje</CardTitle>
                        <MessageSquare className="h-4 w-4 text-[#111B21]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.messages_today}</div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-[#7C3AED]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Regras Hoje</CardTitle>
                        <TrendingUp className="h-4 w-4 text-[#7C3AED]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.rules_today}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Graphs */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4">
                    <CardHeader>
                        <CardTitle>Conversas por Dia (30 dias)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={convPerDay}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis
                                    dataKey="date"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => new Date(value).toLocaleDateString([], { day: '2-digit', month: '2-digit' })}
                                />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip />
                                <Line type="monotone" dataKey="count" stroke="#25D366" strokeWidth={2} dot={false} />
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
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
                        <CardTitle>Performance IA (Aprovadas vs Editadas 7d)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={aiPerf}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis
                                    dataKey="date"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => new Date(value).toLocaleDateString([], { day: '2-digit', month: '2-digit' })}
                                />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="approved" name="Aprovada s/ edição" fill="#25D366" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="edited" name="Editada antes de enviar" fill="#FBBF24" radius={[4, 4, 0, 0]} />
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
                                            <span className="font-medium text-[#111B21]">{rule.rule_name}</span>
                                            <span className="text-gray-500">{rule.usage_count} acionamentos</span>
                                        </div>
                                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-[#25D366]"
                                                style={{ width: `${(rule.usage_count / (topRules[0]?.usage_count || 1)) * 100}%` }}
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
                    <CardDescription>Acesse as conversas mais recentes.</CardDescription>
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
                                    onClick={() => navigate('/whatsapp', { state: { selectedId: conv.phone_number } })}
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
                                                color: conv.status_color
                                            }}
                                        >
                                            {conv.status?.replace('_', ' ')}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-gray-500">
                                        {conv.last_message_at ? new Date(conv.last_message_at).toLocaleString() : '-'}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
