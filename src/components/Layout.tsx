import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  MessageCircle,
  LayoutDashboard,
  BrainCircuit,
  Settings,
  Users,
  LogOut,
  User,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Conversas', icon: MessageCircle, path: '/whatsapp' },
  {
    name: 'Contatos',
    icon: Users,
    path: '/contatos',
    subItems: [
      { name: 'Meus Clientes', path: '/contatos/clientes' },
      { name: 'Vendas', path: '/contatos/vendas' },
      { name: 'Para Validar', path: '/contatos/validar' },
    ],
  },
  { name: 'Agente IA', icon: BrainCircuit, path: '/agente-ia' },
  { name: 'Configurações', icon: Settings, path: '/settings' },
]

export default function Layout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <SidebarProvider>
      <Sidebar className="border-r border-[#E2E8F0]">
        <SidebarHeader className="border-b border-[#E2E8F0] px-4 py-4 h-[60px] flex items-center justify-center bg-white">
          <div
            className="flex items-center gap-2 cursor-pointer w-full group"
            onClick={() => navigate('/dashboard')}
          >
            <div className="bg-[#25D366] p-1.5 rounded-lg group-hover:bg-[#1fb355] transition-colors shrink-0">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-[#111B21] truncate">
              WhatsApp IA
            </span>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-3 py-4 bg-white">
          <SidebarMenu className="gap-2">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path)

              if (item.subItems) {
                return (
                  <Collapsible
                    key={item.path}
                    asChild
                    defaultOpen={isActive}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          tooltip={item.name}
                          isActive={isActive}
                          className={cn(
                            'h-10 cursor-pointer rounded-lg transition-colors',
                            isActive
                              ? 'bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 hover:text-[#25D366] font-medium'
                              : 'text-[#667781] hover:bg-[#F0F2F5] hover:text-[#111B21]',
                          )}
                        >
                          <div className="flex items-center gap-3 w-full">
                            <item.icon
                              className={cn(
                                'w-5 h-5 shrink-0',
                                isActive ? 'text-[#25D366]' : 'text-[#667781]',
                              )}
                            />
                            <span className="truncate">{item.name}</span>
                            <ChevronRight className="ml-auto w-4 h-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </div>
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.subItems.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.path}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={location.pathname === subItem.path}
                                className={cn(
                                  location.pathname === subItem.path
                                    ? 'bg-[#25D366]/10 text-[#25D366] font-medium'
                                    : 'text-[#667781] hover:text-[#111B21]',
                                )}
                              >
                                <Link to={subItem.path}>{subItem.name}</Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                )
              }

              return (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    onClick={() => navigate(item.path)}
                    tooltip={item.name}
                    className={cn(
                      'h-10 cursor-pointer rounded-lg transition-colors',
                      isActive
                        ? 'bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 hover:text-[#25D366] font-medium'
                        : 'text-[#667781] hover:bg-[#F0F2F5] hover:text-[#111B21]',
                    )}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <item.icon
                        className={cn(
                          'w-5 h-5 shrink-0',
                          isActive ? 'text-[#25D366]' : 'text-[#667781]',
                        )}
                      />
                      <span className="truncate">{item.name}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="border-t border-[#E2E8F0] p-4 bg-white space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="bg-[#F0F2F5] p-2 rounded-full shrink-0">
              <User className="w-4 h-4 text-[#667781]" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-[#111B21] truncate">
                Sua Conta
              </span>
              <span className="text-xs text-[#667781] truncate">
                {user?.email || 'carregando...'}
              </span>
            </div>
          </div>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleLogout}
                className="text-red-500 hover:bg-red-50 hover:text-red-600 cursor-pointer rounded-lg transition-colors h-10"
              >
                <LogOut className="w-5 h-5 shrink-0 mr-1" />
                <span>Sair da plataforma</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="flex flex-col h-screen w-full bg-[#F0F2F5] overflow-hidden">
        <header className="flex h-[60px] md:hidden shrink-0 items-center gap-3 border-b border-[#E2E8F0] bg-white px-4 shadow-sm z-10">
          <SidebarTrigger className="text-[#667781] hover:text-[#111B21] hover:bg-[#F0F2F5]" />
          <div className="flex items-center gap-2">
            <div className="bg-[#25D366] p-1 rounded-md shrink-0">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-[#111B21] text-lg">
              WhatsApp IA
            </span>
          </div>
        </header>
        <main className="flex-1 w-full h-full overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
