'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../../../../lib/firebase';

export default function LoginPage() {
  const router = useRouter();
  const auth = getAuth(app);

  const [formData, setFormData] = useState({ email: '', senha: '' });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { email, senha } = formData;

    try {
      await signInWithEmailAndPassword(auth, email, senha);
      router.push('/home');
    } catch (err) {
      console.error('Erro ao logar:', err);
      setError('E-mail ou senha inválidos');
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
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
            />
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2">Senha</label>
            <input 
              name="senha"
              type="password"
              value={formData.senha}
              onChange={handleChange}
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <button 
            type="submit" 
            className="w-full bg-red-700 hover:bg-red-600 text-white py-3 px-4 rounded-md font-bold transition duration-300"
          >
            ENTRAR
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
