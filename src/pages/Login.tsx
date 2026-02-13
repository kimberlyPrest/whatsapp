import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            toast({
                variant: "destructive",
                title: "Erro ao entrar",
                description: error.message,
            });
        } else {
            navigate('/whatsapp');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F0F2F5] p-4 text-[#111B21]">
            <div className="absolute top-0 w-full h-52 bg-[#25D366] z-0" />

            <div className="z-10 w-full max-w-[450px] bg-white rounded-lg shadow-elevation p-10 mt-20">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-[#25D366] p-3 rounded-full mb-4">
                        <MessageSquare className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-light">WhatsApp Business IA</h1>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[#667781]">Email</label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="bg-[#F0F2F5] border-none focus-visible:ring-1 focus-visible:ring-[#25D366]"
                            placeholder="seu@email.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <label className="text-sm font-medium text-[#667781]">Senha</label>
                            <Link to="/forgot-password" size="sm" className="text-xs text-[#008069] hover:underline font-medium">
                                Esqueceu a senha?
                            </Link>
                        </div>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="bg-[#F0F2F5] border-none focus-visible:ring-1 focus-visible:ring-[#25D366]"
                            placeholder="●●●●●●"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#25D366] hover:bg-[#1fb355] text-white font-semibold py-6"
                    >
                        {loading ? 'Entrando...' : 'ENTRAR'}
                    </Button>
                </form>

                <div className="mt-8 text-center text-sm text-[#667781]">
                    Não tem uma conta?{' '}
                    <Link to="/signup" className="text-[#008069] hover:underline font-medium">
                        Cadastre-se
                    </Link>
                </div>
            </div>
        </div>
    );
}
