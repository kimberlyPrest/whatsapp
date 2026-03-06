import { LayoutList } from 'lucide-react'

export default function ContatosVendas() {
  return (
    <div className="flex flex-col min-h-full bg-[#F0F2F5] items-center justify-center p-6">
      <div className="flex flex-col items-center max-w-md text-center space-y-4">
        <div className="bg-white p-4 rounded-full shadow-sm">
          <LayoutList className="w-12 h-12 text-[#25D366]" />
        </div>
        <h1 className="text-2xl font-bold text-[#111B21]">
          Em desenvolvimento
        </h1>
        <p className="text-[#667781]">
          Esta seção de vendas e pipeline de contatos será liberada em breve.
        </p>
      </div>
    </div>
  )
}
