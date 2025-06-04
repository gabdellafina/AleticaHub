'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { app } from '../../../../lib/firebase';

export default function RegisterPage() {
  const router = useRouter();
  const auth = getAuth(app);

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    telefone: '',
    dataNascimento: '',
    curso: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const { email, senha, nome, telefone, dataNascimento, curso } = formData;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const token = await userCredential.user.getIdToken();

      await fetch('/api/usuario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          uid: userCredential.user.uid,
          nome,
          telefone,
          dataNascimento: new Date(dataNascimento).toISOString(), // garantir formato correto
          curso,
        }),
      });

      router.push('/home');
    } catch (err) {
      console.error('Erro ao registrar:', err);
      setError('Erro ao registrar. Verifique os dados ou tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <form onSubmit={handleRegister} className="bg-gray-900 p-8 rounded border border-gray-700 w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-red-500 text-center mb-4">Criar Conta</h1>

        <input type="text" name="nome" placeholder="Nome completo" required onChange={handleChange} className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white" />
        <input type="email" name="email" placeholder="E-mail" required onChange={handleChange} className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white" />
        <input type="password" name="senha" placeholder="Senha" required onChange={handleChange} className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white" />
        <input type="tel" name="telefone" placeholder="Telefone" required onChange={handleChange} className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white" />
        <input type="date" name="dataNascimento" required onChange={handleChange} className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white" />
        <input type="text" name="curso" placeholder="Curso" required onChange={handleChange} className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white" />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button type="submit" className="w-full bg-red-700 hover:bg-red-600 text-white py-3 rounded font-bold">
          Registrar
        </button>

        <p className="text-gray-400 text-sm text-center">
          Já tem conta?{' '}
          <Link href="/login" className="text-red-500 hover:text-red-400 font-semibold">Entrar</Link>
        </p>
      </form>
    </div>
  );
}
