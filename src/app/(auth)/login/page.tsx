'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { email, password } = formData;

    try {
      setIsLoading(true);
      setError('');

      // Login diretamente com a API de backend
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          password
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erro ao fazer login');
      }

      // 3. Processar a resposta
      const data = await response.json();
      
      // 4. Armazenar o token JWT retornado pelo backend para futuras requisições
      localStorage.setItem('authToken', data.token);

      // 5. Redirecionar com base no papel do usuário
      if (data.user.role === 'admin') {
        router.push('/admin-dashboard');
      } else {
        router.push('/home');
      }
    } catch (err) {
      console.error('Erro ao logar:', err);
      setError(err instanceof Error ? err.message : 'E-mail ou senha inválidos');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="bg-gray-900 p-8 rounded-lg border border-gray-700 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-red-500">ATLÉTICA HUB</h1>
          <p className="text-gray-300 mt-2">Faça login para continuar</p>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label className="block text-gray-300 mb-2">E-mail</label>
            <input 
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
            />
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2">Senha</label>
            <input 
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
            />
          </div>

          {error && <p className="text-red-500 text-sm py-2 px-3 bg-red-900/30 rounded">{error}</p>}
          
          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full ${isLoading ? 'bg-gray-600' : 'bg-red-700 hover:bg-red-600'} 
              text-white py-3 px-4 rounded-md font-bold transition duration-300`}
          >
            {isLoading ? 'ENTRANDO...' : 'ENTRAR'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Não tem conta?{' '}
            <Link href="/register" className="text-red-500 hover:text-red-400 font-semibold">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
