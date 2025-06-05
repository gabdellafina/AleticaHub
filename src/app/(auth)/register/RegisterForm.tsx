// filepath: c:\Users\julio\Downloads\AtleticaHub-FrontEnd\AleticaHub\src\app\(auth)\register\RegisterForm.tsx
// Register Form Component - Formulário de registro integrado com API

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuthForm } from '../../../hooks/useAuthForm';

const RegisterForm = () => {
  const { handleRegister, isLoading, errors, formatPhoneNumber } = useAuthForm();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefone: '',
    dataNascimento: '',
    curso: '',
    codigo: '', // Adicionado campo 'codigo' ao estado do formulário
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Special formatting for phone number
    if (name === 'telefone') {
      const formattedPhone = formatPhoneNumber(value);
      setFormData(prev => ({ ...prev, [name]: formattedPhone }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleRegister(formData);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-gray-900 p-8 rounded-lg border border-gray-700 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-red-500 mb-2">AtleticaHub</h1>
          <p className="text-gray-400">Crie sua conta</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="nome"
              placeholder="Nome completo"
              value={formData.nome}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full p-3 rounded bg-gray-800 border text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors ${
                errors.nome 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-700 focus:ring-red-600'
              }`}
              required
            />
            {errors.nome && (
              <p className="text-red-500 text-sm mt-1">{errors.nome}</p>
            )}
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="E-mail"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full p-3 rounded bg-gray-800 border text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors ${
                errors.email 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-700 focus:ring-red-600'
              }`}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Senha"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full p-3 rounded bg-gray-800 border text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors ${
                errors.password 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-700 focus:ring-red-600'
              }`}
              required
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirmar senha"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full p-3 rounded bg-gray-800 border text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors ${
                errors.confirmPassword 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-700 focus:ring-red-600'
              }`}
              required
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <div>
            <input
              type="tel"
              name="telefone"
              placeholder="Telefone (11) 99999-9999"
              value={formData.telefone}
              onChange={handleChange}
              disabled={isLoading}
              maxLength={15}
              className={`w-full p-3 rounded bg-gray-800 border text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors ${
                errors.telefone 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-700 focus:ring-red-600'
              }`}
              required
            />
            {errors.telefone && (
              <p className="text-red-500 text-sm mt-1">{errors.telefone}</p>
            )}
          </div>

          <div>
            <input
              type="date"
              name="dataNascimento"
              value={formData.dataNascimento}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full p-3 rounded bg-gray-800 border text-white focus:outline-none focus:ring-2 transition-colors ${
                errors.dataNascimento 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-700 focus:ring-red-600'
              }`}
              required
            />
            {errors.dataNascimento && (
              <p className="text-red-500 text-sm mt-1">{errors.dataNascimento}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              name="curso"
              placeholder="Curso"
              value={formData.curso}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full p-3 rounded bg-gray-800 border text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors ${
                errors.curso 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-700 focus:ring-red-600'
              }`}
              required
            />
            {errors.curso && (
              <p className="text-red-500 text-sm mt-1">{errors.curso}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              name="codigo"
              placeholder="Código de convite (opcional)"
              value={formData.codigo || ''}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full p-3 rounded bg-gray-800 border text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors ${
                errors.codigo 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-700 focus:ring-red-600'
              }`}
            />
            {errors.codigo && (
              <p className="text-red-500 text-sm mt-1">{errors.codigo}</p>
            )}
          </div>

          {errors.general && (
            <div className="bg-red-900/20 border border-red-500 rounded p-3">
              <p className="text-red-500 text-sm">{errors.general}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-700 hover:bg-red-600 disabled:bg-red-800 disabled:cursor-not-allowed text-white py-3 rounded font-bold transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registrando...
              </>
            ) : (
              'Registrar'
            )}
          </button>

          <p className="text-gray-400 text-sm text-center">
            Já tem conta?{' '}
            <Link 
              href="/login" 
              className="text-red-500 hover:text-red-400 font-semibold transition-colors"
            >
              Entrar
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
