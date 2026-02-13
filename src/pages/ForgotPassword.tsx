import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, ArrowLeft } from 'lucide-react';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/login`,
        });

        if (error) {
            toast({
                variant: "destructive",
                title: "Erro",
                description: error.message,
            });
        } else {
            toast({
                title: "Email enviado",
                description: "Verifique sua caixa de entrada para redefinir sua senha.",
            });
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F0F2F5] p-4 text-[#111B21]">
            <div className="absolute top-0 w-full h-52 bg-[#25D366] z-0" />

            <div className="z-10 w-full max-w-[450px] bg-white rounded-lg shadow-elevation p-10 mt-20">
                <Link to="/login" className="flex items-center text-sm text-[#008069] mb-8 hover:underline">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Voltar ao Login
                </Link>

                <div className="flex flex-col items-center mb-8">
                    <div className="bg-[#25D366] p-4 rounded-full mb-4">
                        <MessageSquare className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-light">Recuperar Senha</h1>
                    <p className="text-sm text-[#667781] text-center mt-2">
                        Informe seu email para receber o link de redefinição.
                    </p>
                </div>

                <form onSubmit={handleReset} className="space-y-6">
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

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#25D366] hover:bg-[#1fb355] text-white font-semibold py-6"
                    >
                        {loading ? 'Enviando...' : 'ENVIAR LINK'}
                    </Button>
                </form>
            </div>
        </div>
    );
}
