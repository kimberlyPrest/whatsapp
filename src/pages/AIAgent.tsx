import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import {
  Plus,
  Edit2,
  Trash2,
  BrainCircuit,
  Settings2,
  Check,
  X,
  MessageSquare,
  Zap,
} from 'lucide-react'
import {
  whatsappService,
  AutonomousRule,
  TrainingFeedback,
  AIPrompt,
} from '@/lib/services/whatsapp'
import { useToast } from '@/hooks/use-toast'

export default function AIAgent() {
  const [rules, setRules] = useState<any[]>([])
  const [feedbacks, setFeedbacks] = useState<any[]>([])
  const [feedbackStatus, setFeedbackStatus] = useState('pending')
  const [prompts, setPrompts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRule, setEditingRule] = useState<any>(null)
  const { toast } = useToast()

  // Form states
  const [formData, setFormData] = useState({
    rule_name: '',
    description: '',
    trigger_patterns: '',
    response_template: '',
    auto_send: false,
    should_close: false,
    priority: 1,
  })

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    loadFeedbacks()
  }, [feedbackStatus])

  async function loadData() {
    setLoading(true)
    try {
      const [rulesData, promptsData] = await Promise.all([
        whatsappService.getAutonomousRules(),
        whatsappService.getAIPrompts(),
      ])
      setRules(rulesData)
      setPrompts(promptsData)
      await loadFeedbacks()
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro ao carregar configurações',
      })
    } finally {
      setLoading(false)
    }
  }

  async function loadFeedbacks() {
    try {
      const data = await whatsappService.getTrainingFeedback(feedbackStatus)
      setFeedbacks(data)
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro ao carregar feedbacks',
      })
    }
  }

  const handleOpenModal = (rule?: any) => {
    if (rule) {
      setEditingRule(rule)
      setFormData({
        rule_name: rule.rule_name,
        description: rule.description || '',
        trigger_patterns: rule.trigger_patterns?.join(', ') || '',
        response_template: rule.response_template || '',
        auto_send: rule.auto_send || false,
        should_close: rule.should_close || false,
        priority: rule.priority || 1,
      })
    } else {
      setEditingRule(null)
      setFormData({
        rule_name: '',
        description: '',
        trigger_patterns: '',
        response_template: '',
        auto_send: false,
        should_close: false,
        priority: 1,
      })
    }
    setIsModalOpen(true)
  }

  const handleSaveRule = async () => {
    if (!formData.rule_name) return

    const payload = {
      ...formData,
      trigger_patterns: formData.trigger_patterns
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    }

    try {
      if (editingRule) {
        await whatsappService.updateAutonomousRule(editingRule.id, payload)
        toast({ title: 'Sucesso', description: 'Regra atualizada com sucesso' })
      } else {
        await whatsappService.createAutonomousRule(payload)
        toast({ title: 'Sucesso', description: 'Regra criada com sucesso' })
      }
      setIsModalOpen(false)
      loadData()
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro ao salvar regra',
      })
    }
  }

  const handleDeleteRule = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta regra?')) return
    try {
      await whatsappService.deleteAutonomousRule(id)
      toast({ title: 'Sucesso', description: 'Regra excluída' })
      loadData()
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro ao excluir regra',
      })
    }
  }

  const handleToggleRuleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await whatsappService.updateAutonomousRule(id, {
        is_active: !currentStatus,
      })
      setRules(
        rules.map((r) =>
          r.id === id ? { ...r, is_active: !currentStatus } : r,
        ),
      )
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro ao alterar status',
      })
    }
  }

  const handleFeedbackAction = async (
    feedback: any,
    status: 'approved' | 'rejected',
  ) => {
    try {
      await whatsappService.updateFeedbackStatus(feedback.id, status)

      if (status === 'approved') {
        if (feedback.feedback_type === 'new_rule') {
          await whatsappService.createAutonomousRule({
            rule_name: feedback.title,
            description: feedback.description,
            response_template: feedback.suggested_value,
            trigger_patterns: [], // Need manual editing later or extract from evidence
          })
          toast({
            title: 'Regra Criada',
            description: 'Uma nova regra foi gerada a partir do feedback',
          })
        } else if (feedback.feedback_type === 'prompt_update' && prompts[0]) {
          await whatsappService.updateAIPrompt(
            prompts[0].id,
            feedback.suggested_value,
          )
          toast({
            title: 'Prompt Atualizado',
            description: 'O comando da IA foi atualizado',
          })
        }
      }

      loadFeedbacks()
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro ao processar feedback',
      })
    }
  }

  return (
    <div className="p-4 md:p-8 space-y-6 bg-[#F8FAFC] min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-[#111B21]">
            Gestão do Agente IA
          </h1>
          <p className="text-gray-500">
            Configure automações e treine o modelo com base no histórico.
          </p>
        </div>
        <Button
          onClick={() => handleOpenModal()}
          className="bg-[#25D366] hover:bg-[#1fb355] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Regra
        </Button>
      </div>

      <Tabs defaultValue="rules" className="w-full">
        <TabsList className="bg-white border p-1 rounded-xl shadow-sm mb-6">
          <TabsTrigger
            value="rules"
            className="data-[state=active]:bg-[#25D366]/10 data-[state=active]:text-[#25D366]"
          >
            <Zap className="w-4 h-4 mr-2" />
            Regras Autônomas
          </TabsTrigger>
          <TabsTrigger
            value="training"
            className="data-[state=active]:bg-[#25D366]/10 data-[state=active]:text-[#25D366]"
          >
            <BrainCircuit className="w-4 h-4 mr-2" />
            Treinamento
          </TabsTrigger>
          <TabsTrigger
            value="prompts"
            className="data-[state=active]:bg-[#25D366]/10 data-[state=active]:text-[#25D366]"
          >
            <Settings2 className="w-4 h-4 mr-2" />
            Prompt Global
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Triggers</TableHead>
                    <TableHead>Resposta Template</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Uso Total</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">
                        {rule.rule_name}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {rule.trigger_patterns?.map((t: string) => (
                            <Badge
                              key={t}
                              variant="outline"
                              className="text-[10px] lowercase"
                            >
                              {t}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate text-gray-500">
                        {rule.response_template}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={rule.is_active}
                          onCheckedChange={() =>
                            handleToggleRuleStatus(rule.id, rule.is_active)
                          }
                        />
                      </TableCell>
                      <TableCell>{rule.usage_count}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenModal(rule)}
                          >
                            <Edit2 className="w-4 h-4 text-gray-400" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteRule(rule.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training" className="space-y-6">
          <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
            <Button
              variant={feedbackStatus === 'pending' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFeedbackStatus('pending')}
              className={feedbackStatus === 'pending' ? 'bg-[#25D366]' : ''}
            >
              Pendentes
            </Button>
            <Button
              variant={feedbackStatus === 'approved' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFeedbackStatus('approved')}
              className={feedbackStatus === 'approved' ? 'bg-[#25D366]' : ''}
            >
              Aprovadas
            </Button>
            <Button
              variant={feedbackStatus === 'rejected' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFeedbackStatus('rejected')}
              className={feedbackStatus === 'rejected' ? 'bg-[#25D366]' : ''}
            >
              Rejeitadas
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {feedbacks.length > 0 ? (
              feedbacks.map((f) => (
                <Card key={f.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary" className="capitalize">
                        {f.feedback_type?.replace('_', ' ')}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{f.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {f.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="bg-gray-50 p-3 rounded-lg text-sm italic mb-4 border-l-2 border-[#25D366]">
                      "{f.suggested_value}"
                    </div>
                    {f.evidence && (
                      <div className="text-xs text-gray-400 flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        Baseado em histórico de conversa
                      </div>
                    )}
                  </CardContent>
                  {f.status === 'pending' && (
                    <CardFooter className="flex justify-between gap-2 pt-0">
                      <Button
                        variant="outline"
                        className="flex-1 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleFeedbackAction(f, 'rejected')}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Rejeitar
                      </Button>
                      <Button
                        className="flex-1 bg-[#25D366] hover:bg-[#1fb355] text-white"
                        onClick={() => handleFeedbackAction(f, 'approved')}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Aprovar
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-gray-500">
                Nenhum feedback {feedbackStatus === 'pending' ? 'pendente' : ''}{' '}
                no momento.
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="prompts">
          <Card>
            <CardHeader>
              <CardTitle>Comportamento Base da IA</CardTitle>
              <CardDescription>
                Defina como a IA deve se comportar quando não houver uma regra
                específica.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {prompts.map((p) => (
                <div key={p.id} className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-base font-bold">
                      {p.prompt_name}
                    </Label>
                    <Badge variant="outline">v{p.version}</Badge>
                  </div>
                  <Textarea
                    defaultValue={p.prompt_content}
                    className="min-h-[400px] font-mono text-sm"
                    onChange={(e) => {
                      // Logic to save would go here
                    }}
                  />
                  <Button
                    className="bg-[#25D366] hover:bg-[#1fb355] text-white"
                    onClick={() => {
                      toast({
                        title: 'Sucesso',
                        description: 'Prompt atualizado (simulação)',
                      })
                    }}
                  >
                    Salvar Prompt
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New/Edit Rule Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingRule ? 'Editar Regra' : 'Nova Regra Autônoma'}
            </DialogTitle>
            <DialogDescription>
              Regras autônomas respondem automaticamente a gatilhos específicos.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Regra</Label>
                <Input
                  id="name"
                  value={formData.rule_name}
                  onChange={(e) =>
                    setFormData({ ...formData, rule_name: e.target.value })
                  }
                  placeholder="Ex: Saudação Inicial"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Prioridade (1-100)</Label>
                <Input
                  id="priority"
                  type="number"
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      priority: parseInt(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="triggers">
                Palavras-chave (gatilhos separar por vírgula)
              </Label>
              <Input
                id="triggers"
                value={formData.trigger_patterns}
                onChange={(e) =>
                  setFormData({ ...formData, trigger_patterns: e.target.value })
                }
                placeholder="oi, olá, bom dia"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="template">Resposta Template</Label>
              <Textarea
                id="template"
                value={formData.response_template}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    response_template: e.target.value,
                  })
                }
                placeholder="Olá! Sou o assistente virtual..."
                className="min-h-[100px]"
              />
            </div>

            <div className="flex items-center justify-between border p-4 rounded-lg bg-gray-50">
              <div className="space-y-0.5">
                <Label>Envio Automático</Label>
                <p className="text-xs text-muted-foreground">
                  Enviar sem pedir aprovação do operador.
                </p>
              </div>
              <Switch
                checked={formData.auto_send}
                onCheckedChange={(val) =>
                  setFormData({ ...formData, auto_send: val })
                }
              />
            </div>

            <div className="flex items-center justify-between border p-4 rounded-lg bg-gray-50">
              <div className="space-y-0.5">
                <Label>Finalizar Conversa</Label>
                <p className="text-xs text-muted-foreground">
                  Marcar conversa como resolvida após o envio.
                </p>
              </div>
              <Switch
                checked={formData.should_close}
                onCheckedChange={(val) =>
                  setFormData({ ...formData, should_close: val })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSaveRule}
              className="bg-[#25D366] hover:bg-[#1fb355] text-white"
            >
              Salvar Configuração
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
