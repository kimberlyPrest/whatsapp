import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ExternalLink, MessageCircle, Loader2, Video, X } from 'lucide-react'
import {
  clientsService,
  TIPOS_OPTIONS,
  type ClientProfile,
  type TldvMeeting,
} from '@/lib/services/clients'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface ClientModalProps {
  client: ClientProfile | null
  open: boolean
  onClose: () => void
  onSaved: () => void
}

export function ClientModal({
  client,
  open,
  onClose,
  onSaved,
}: ClientModalProps) {
  const navigate = useNavigate()
  const { toast } = useToast()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [secondaryEmail, setSecondaryEmail] = useState('')
  const [tldvLink, setTldvLink] = useState('')
  const [observations, setObservations] = useState('')
  const [selectedTipos, setSelectedTipos] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [etapa, setEtapa] = useState<string | null>(null)
  const [propriedade, setPropriedade] = useState(false)
  const [meetings, setMeetings] = useState<TldvMeeting[]>([])
  const [loadingMeetings, setLoadingMeetings] = useState(false)

  useEffect(() => {
    if (!client) return
    setName(client.contact_name ?? '')
    setEmail(client.email ?? '')
    setSecondaryEmail(client.emails_alternativos?.[0] ?? '')
    setTldvLink(client.tldv_link ?? '')
    setObservations(client.observations ?? '')
    setSelectedTipos(client.tipos ?? [])
    setTags(client.tags ?? [])
    setEtapa(client.etapa_negocio ?? null)
    setPropriedade(client.propriedade ?? false)
  }, [client])

  const loadMeetings = async () => {
    if (!client) return
    setLoadingMeetings(true)
    try {
      const data = await clientsService.getTldvMeetings(client.phone_number)
      setMeetings(data)
    } catch {
      // silently ignore
    } finally {
      setLoadingMeetings(false)
    }
  }

  const handleSave = async () => {
    if (!client) return
    setSaving(true)
    try {
      await clientsService.updateClient(client.phone_number, {
        contact_name: name.trim() || null,
        email: email.trim() || null,
        emails_alternativos: secondaryEmail.trim()
          ? [secondaryEmail.trim()]
          : [],
        tldv_link: tldvLink.trim() || null,
        observations: observations.trim() || null,
        tipos: selectedTipos,
        tags,
        etapa_negocio: etapa,
      })
      toast({ title: 'Salvo', description: 'Perfil do cliente atualizado.' })
      onSaved()
      onClose()
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Erro', description: err.message })
    } finally {
      setSaving(false)
    }
  }

  const toggleTipo = (tipo: string) => {
    setSelectedTipos((prev) =>
      prev.includes(tipo) ? prev.filter((t) => t !== tipo) : [...prev, tipo],
    )
  }

  const addTag = () => {
    const val = tagInput.trim()
    if (val && !tags.includes(val)) {
      setTags((prev) => [...prev, val])
    }
    setTagInput('')
  }

  const removeTag = (tag: string) =>
    setTags((prev) => prev.filter((t) => t !== tag))

  const handleOpenWhatsApp = () => {
    if (!client) return
    onClose()
    navigate('/whatsapp', { state: { selectedId: client.phone_number } })
  }

  const tipoColors: Record<string, string> = {
    Elite: 'bg-purple-100 text-purple-800 border-purple-200',
    Scale: 'bg-blue-100 text-blue-800 border-blue-200',
    Skip: 'bg-gray-100 text-gray-700 border-gray-200',
    'Rec Onboar': 'bg-green-100 text-green-800 border-green-200',
    Vendas: 'bg-orange-100 text-orange-800 border-orange-200',
  }

  if (!client) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0"
              style={{ backgroundColor: phoneToColor(client.phone_number) }}
            >
              {(client.contact_name ?? client.phone_number)
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div>
              <div className="text-base font-semibold text-[#111B21]">
                {client.contact_name ?? 'Sem nome'}
              </div>
              <div className="text-sm text-[#667781] font-normal">
                {client.phone_number}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue="dados"
          onValueChange={(v) => v === 'reunioes' && loadMeetings()}
        >
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="dados">Dados</TabsTrigger>
            <TabsTrigger value="reunioes">Reuniões TL.DV</TabsTrigger>
            <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
          </TabsList>

          {/* ——— Tab Dados ——— */}
          <TabsContent value="dados" className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#667781]">
                  Nome
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nome do cliente"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#667781]">
                  Etapa do Negócio
                </label>
                <select
                  value={etapa ?? ''}
                  onChange={(e) => setEtapa(e.target.value || null)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Selecione a etapa...</option>
                  <option value="Lead Qualificado">Lead Qualificado</option>
                  <option value="1ª Reunião Agendada">
                    1ª Reunião Agendada
                  </option>
                  <option value="Aguardando Contrato">
                    Aguardando Contrato
                  </option>
                  <option value="Cliente Ativo">Cliente Ativo</option>
                  <option value="Churn">Churn</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#667781]">
                  Email Principal
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@exemplo.com"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#667781]">
                  Email Secundário
                </label>
                <Input
                  type="email"
                  value={secondaryEmail}
                  onChange={(e) => setSecondaryEmail(e.target.value)}
                  placeholder="secundario@exemplo.com"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Badge
                variant={propriedade ? 'default' : 'outline'}
                className={propriedade ? 'bg-[#25D366]' : ''}
              >
                {propriedade ? 'Propriedade Ativa' : 'Sem Propriedade'}
              </Badge>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-[#667781]">Tipo</label>
              <div className="flex flex-wrap gap-2">
                {TIPOS_OPTIONS.map((tipo) => (
                  <button
                    key={tipo}
                    onClick={() => toggleTipo(tipo)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                      selectedTipos.includes(tipo)
                        ? tipoColors[tipo]
                        : 'bg-white text-[#667781] border-[#E2E8F0] hover:border-[#25D366]'
                    }`}
                  >
                    {tipo}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-[#667781]">Tags</label>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === 'Enter' && (e.preventDefault(), addTag())
                  }
                  placeholder="Adicionar tag e pressionar Enter"
                  className="flex-1"
                />
                <Button variant="outline" size="sm" onClick={addTag}>
                  Adicionar
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="gap-1 pr-1 text-xs"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="hover:text-red-500 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-[#667781]">
                Link TL.DV
              </label>
              <div className="flex gap-2">
                <Input
                  value={tldvLink}
                  onChange={(e) => setTldvLink(e.target.value)}
                  placeholder="https://tldv.io/app/meetings/..."
                  className="flex-1"
                />
                {tldvLink && (
                  <a
                    href={tldvLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0"
                  >
                    <Button variant="outline" size="icon" type="button">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </a>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-[#667781]">
                Observações
              </label>
              <Textarea
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder="Anotações sobre o cliente..."
                rows={4}
                className="resize-none"
              />
            </div>

            {(client.call_1_date || client.call_2_date) && (
              <div className="space-y-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <label className="text-xs font-bold text-[#111B21] uppercase tracking-wider">
                  Histórico de Calls
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {client.call_1_date && (
                    <div className="text-xs">
                      <div className="text-[#667781] mb-1">Call 1</div>
                      <div className="font-medium flex items-center justify-between">
                        {client.call_1_date}
                        {client.call_1_link && (
                          <a
                            href={client.call_1_link}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <ExternalLink className="w-3 h-3 text-[#25D366]" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                  {client.call_2_date && (
                    <div className="text-xs">
                      <div className="text-[#667781] mb-1">Call 2</div>
                      <div className="font-medium flex items-center justify-between">
                        {client.call_2_date}
                        {client.call_2_link && (
                          <a
                            href={client.call_2_link}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <ExternalLink className="w-3 h-3 text-[#25D366]" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                {client.csat_1 && (
                  <div className="pt-2 mt-2 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#667781]">CSAT 1</span>
                      <span className="text-xs font-bold text-yellow-600">
                        ★ {client.csat_1}/5
                      </span>
                    </div>
                    {client.csat_comment_1 && (
                      <p className="text-[10px] text-[#667781] italic mt-1 bg-white p-1.5 rounded">
                        "{client.csat_comment_1}"
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-[#25D366] hover:bg-[#1fb355] text-white"
              >
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Salvar
              </Button>
            </div>
          </TabsContent>

          {/* ——— Tab Reuniões TL.DV ——— */}
          <TabsContent value="reunioes" className="pt-2">
            {loadingMeetings ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-6 h-6 animate-spin text-[#25D366]" />
              </div>
            ) : meetings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2 text-[#667781]">
                <Video className="w-8 h-8 opacity-40" />
                <p className="text-sm">Nenhuma reunião vinculada</p>
                <p className="text-xs text-center max-w-xs">
                  As reuniões são vinculadas automaticamente pelo email do
                  participante quando o TL.DV envia o webhook.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {meetings.map((m) => (
                  <div
                    key={m.id}
                    className="border border-[#E2E8F0] rounded-lg p-3 flex items-start justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-[#111B21] truncate">
                        {m.meeting_title ?? 'Reunião sem título'}
                      </div>
                      {m.meeting_date && (
                        <div className="text-xs text-[#667781] mt-0.5">
                          {format(
                            new Date(m.meeting_date),
                            "d 'de' MMMM 'de' yyyy",
                            { locale: ptBR },
                          )}
                        </div>
                      )}
                      {m.summary && (
                        <p className="text-xs text-[#667781] mt-1 line-clamp-2">
                          {m.summary}
                        </p>
                      )}
                    </div>
                    <a
                      href={m.tldv_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Abrir
                      </Button>
                    </a>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ——— Tab WhatsApp ——— */}
          <TabsContent value="whatsapp" className="pt-2">
            <div className="flex flex-col items-center justify-center py-10 gap-4">
              <div className="bg-[#25D366]/10 p-4 rounded-full">
                <MessageCircle className="w-8 h-8 text-[#25D366]" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-[#111B21]">
                  {client.contact_name ?? client.phone_number}
                </p>
                <p className="text-xs text-[#667781] mt-1">
                  {client.phone_number}
                </p>
              </div>
              <Button
                onClick={handleOpenWhatsApp}
                className="bg-[#25D366] hover:bg-[#1fb355] text-white gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Abrir conversa
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

// Gera cor consistente a partir do número de telefone
function phoneToColor(phone: string): string {
  const colors = [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#96CEB4',
    '#FFEAA7',
    '#DDA0DD',
    '#98D8C8',
    '#F7DC6F',
    '#BB8FCE',
    '#82E0AA',
  ]
  let hash = 0
  for (let i = 0; i < phone.length; i++)
    hash = phone.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}
