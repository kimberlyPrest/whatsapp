import { Sparkles, Check, Edit2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface AISuggestionProps {
  suggestion: string
  onApprove: () => void
  onEdit: () => void
  onDiscard: () => void
}

export function AISuggestion({
  suggestion,
  onApprove,
  onEdit,
  onDiscard,
}: AISuggestionProps) {
  return (
    <div className="mb-2 mx-4 rounded-lg bg-blue-50 border-l-4 border-[#25D366] p-3 shadow-sm animate-fade-in-up">
      <div className="flex items-start gap-2 mb-2">
        <Sparkles className="w-4 h-4 text-[#25D366] mt-0.5 shrink-0" />
        <p className="text-sm text-gray-700 italic">
          <span className="font-semibold not-italic text-gray-900 block mb-1">
            Sugestão de Resposta:
          </span>
          "{suggestion}"
        </p>
      </div>

      <div className="flex gap-2 justify-end mt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onDiscard}
          className="h-7 px-2 text-red-500 hover:text-red-600 hover:bg-red-50 text-xs"
        >
          <X className="w-3 h-3 mr-1" />
          Descartar
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
          className="h-7 px-2 border-blue-200 text-blue-600 hover:bg-blue-50 text-xs bg-white"
        >
          <Edit2 className="w-3 h-3 mr-1" />
          Editar
        </Button>
        <Button
          size="sm"
          onClick={onApprove}
          className="h-7 px-3 bg-[#25D366] hover:bg-[#128C7E] text-white text-xs"
        >
          <Check className="w-3 h-3 mr-1" />
          Aprovar
        </Button>
      </div>
    </div>
  )
}
