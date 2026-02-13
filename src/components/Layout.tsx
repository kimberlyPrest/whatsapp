import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { User, MessageCircle, LayoutDashboard, BrainCircuit } from 'lucide-react'

const Layout = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <main className="flex flex-col min-h-screen bg-[#F0F2F5]">
      {/* Header com Navegação e User Info */}
      <header className="bg-white border-b border-[#E2E8F0] px-6 py-3 flex justify-between items-center z-20 shadow-sm sticky top-0">
        <div className="flex items-center gap-8">
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => navigate('/dashboard')}
          >
            <div className="bg-[#25D366] p-1.5 rounded-lg group-hover:bg-[#1fb355] transition-colors">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-[#111B21] hidden sm:inline-block">WhatsApp Sugestão</span>
          </div>

          <nav className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="text-sm font-medium text-[#667781] hover:text-[#25D366] hover:bg-[#25D366]/5"
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate('/whatsapp')}
              className="text-sm font-medium text-[#667781] hover:text-[#25D366] hover:bg-[#25D366]/5"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Conversas
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate('/agente-ia')}
              className="text-sm font-medium text-[#667781] hover:text-[#25D366] hover:bg-[#25D366]/5"
            >
              <BrainCircuit className="w-4 h-4 mr-2" />
              Agente IA
            </Button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 text-[#111B21] border-r border-[#E2E8F0] pr-4">
            <div className="bg-gray-100 p-2 rounded-full">
              <User className="w-4 h-4 text-gray-500" />
            </div>
            <span className="text-sm font-medium">{user?.email}</span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-[#667781] hover:text-red-500 hover:bg-red-50 text-sm font-medium"
          >
            Sair
          </Button>
        </div>
      </header>

      {/* Page Content */}
      <div className="flex-1 overflow-hidden h-[calc(100vh-64px)]">
        <Outlet />
      </div>
    </main>
  )
}

export default Layout
