import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare } from 'lucide-react';

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            return toast({
                variant: "destructive",
                title: "Erro no cadastro",
                description: "As senhas não coincidem.",
            });
        }

        setLoading(true);

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/login`,
            }
        });

        if (error) {
            toast({
                variant: "destructive",
                title: "Erro ao cadastrar",
                description: error.message,
            });
        } else {
            toast({
                title: "Cadastro realizado!",
                description: "Verifique seu email para confirmar o cadastro.",
            });
            navigate('/login');
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
                    <h1 className="text-2xl font-light">Criar Conta</h1>
                </div>

                <form onSubmit={handleSignup} className="space-y-6">
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
                        <label className="text-sm font-medium text-[#667781]">Senha</label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="bg-[#F0F2F5] border-none focus-visible:ring-1 focus-visible:ring-[#25D366]"
                            placeholder="Mínimo 6 caracteres"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[#667781]">Confirmar Senha</label>
                        <Input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="bg-[#F0F2F5] border-none focus-visible:ring-1 focus-visible:ring-[#25D366]"
                            placeholder="Repita a senha"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#25D366] hover:bg-[#1fb355] text-white font-semibold py-6"
                    >
                        {loading ? 'Cadastrando...' : 'CADASTRAR'}
                    </Button>
                </form>

                <div className="mt-8 text-center text-sm text-[#667781]">
                    Já tem uma conta?{' '}
                    <Link to="/login" className="text-[#008069] hover:underline font-medium">
                        Entrar
                    </Link>
                </div>
            </div>
        </div>
    );
}
