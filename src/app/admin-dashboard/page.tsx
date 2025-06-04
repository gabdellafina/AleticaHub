'use client';

import Link from 'next/link';

export default function AdminDashboardHome() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Painel do Administrador</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/admin-dashboard/loja" className="block bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-red-500">
          <h2 className="font-bold text-lg text-red-500">Gerenciar Loja</h2>
          <p className="text-gray-400 mt-2">Adicionar produtos, editar estoque e acompanhar vendas.</p>
        </Link>

        <Link href="/admin-dashboard/eventos" className="block bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-red-500">
          <h2 className="font-bold text-lg text-red-500">Gerenciar Eventos</h2>
          <p className="text-gray-400 mt-2">Criar eventos, definir banner, descrição e preço opcional.</p>
        </Link>

        <Link href="/admin-dashboard/usuarios" className="block bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-red-500">
          <h2 className="font-bold text-lg text-red-500">Gerenciar Usuários</h2>
          <p className="text-gray-400 mt-2">Aceitar cadastros, suspender, promover a admin e aprovar inscrições.</p>
        </Link>

        <Link href="/admin-dashboard/esportes" className="block bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-red-500">
          <h2 className="font-bold text-lg text-red-500">Gerenciar Esportes</h2>
          <p className="text-gray-400 mt-2">Cadastrar esportes, editar treinos e evitar conflitos de horário.</p>
        </Link>
      </div>
    </div>
  );
}
