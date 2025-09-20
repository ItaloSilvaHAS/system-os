import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { UserData } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface AuthPageProps {
  onLogin: (user: UserData) => void;
}

export default function AuthPage({ onLogin }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        onLogin(data.user);
      } else {
        toast({
          title: "Erro de autenticação",
          description: data.message || "Falha na autenticação",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao servidor",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="system-panel rounded-xl p-8 w-full max-w-md animate-slide-up">
        <CardContent className="pt-0">
          {/* Auth Header */}
          <div className="text-center mb-8">
            <h1 className="font-orbitron text-3xl font-bold text-primary glow-text mb-2">
              SystemOS
            </h1>
            <p className="text-muted-foreground text-sm">
              Solo Leveling Life Management System
            </p>
          </div>

          <div>
            <h2 className="font-orbitron text-xl font-semibold mb-6 text-center">
              {isLogin ? 'Acesso ao Sistema' : 'Registro de Hunter'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="username" className="block text-sm font-medium mb-2">
                  Nome de Usuário
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={isLogin ? "Digite seu username" : "Escolha um username"}
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                  data-testid="input-username"
                  disabled={loading}
                />
              </div>
              
              <div>
                <Label htmlFor="password" className="block text-sm font-medium mb-2">
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isLogin ? "Digite sua senha" : "Crie uma senha"}
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                  data-testid="input-password"
                  disabled={loading}
                />
              </div>
              
              <Button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 rounded-lg font-semibold text-primary-foreground"
                data-testid="button-submit"
              >
                <i className={`fas ${isLogin ? 'fa-sign-in-alt' : 'fa-user-plus'} mr-2`}></i>
                {loading 
                  ? (isLogin ? 'Entrando...' : 'Criando conta...') 
                  : (isLogin ? 'Entrar no Sistema' : 'Criar Conta')
                }
              </Button>
            </form>
            
            <p className="text-center mt-4 text-sm text-muted-foreground">
              {isLogin ? 'Não tem conta? ' : 'Já tem conta? '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:underline"
                data-testid="button-toggle-auth"
              >
                {isLogin ? 'Registre-se' : 'Faça login'}
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
