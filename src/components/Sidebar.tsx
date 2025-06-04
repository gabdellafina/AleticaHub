'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaStore, FaCalendarAlt, FaComments, FaUserShield } from 'react-icons/fa';
import { useEffect, useState } from 'react';

// Simulação de função de busca de usuário logado
// Substitua por contexto de autenticação real se já tiver
const getUserRole = async (): Promise<'user' | 'admin'> => {
  const res = await fetch('/api/auth/me'); // ou useAuthContext()
  const data = await res.json();
  return data.role; // 'user' ou 'admin'
};

export default function Sidebar() {
  const pathname = usePathname();
  const [role, setRole] = useState<'user' | 'admin' | null>(null);

  useEffect(() => {
    getUserRole().then(setRole).catch(() => setRole(null));
  }, []);

  if (role === null) return null; // Ou loader se preferir

  const isActive = (path: string) =>
    pathname.startsWith(path) ? 'text-white font-bold' : 'text-red-200 hover:text-white';

  return (
    <div className="w-64 fixed h-full bg-red-800 shadow-lg">
      <div className="p-6 border-b border-red-900">
        <h1 className="text-xl font-bold text-white">AtleticaHub</h1>
        <p className="text-red-200 capitalize">{role === 'admin' ? 'Administrador' : 'Aluno'}</p>
        <Link
          href="/profile"
          className="text-white font-medium mt-2 inline-block hover:text-red-200"
        >
          Editar perfil
        </Link>
      </div>

      <nav className="p-4">
        <ul className="space-y-3">
          {role === 'user' && (
            <>
              <li>
                <Link href="/shop" className={isActive('/shop')}>
                  Loja
                </Link>
              </li>
              <li>
                <Link href="/calendar" className={isActive('/calendar')}>
                  Seu calendário
                </Link>
              </li>
              <li>
                <Link href="/chat" className={isActive('/chat')}>
                  Chat
                </Link>
              </li>
            </>
          )}

          {role === 'admin' && (
            <>
              <li>
                <Link href="/admin-dashboard/loja" className={isActive('/admin-dashboard/loja')}>
                  Gerenciar Loja
                </Link>
              </li>
              <li>
                <Link href="/admin-dashboard/eventos" className={isActive('/admin-dashboard/eventos')}>
                  Gerenciar Eventos
                </Link>
              </li>
              <li>
                <Link href="/admin-dashboard/usuarios" className={isActive('/admin-dashboard/usuarios')}>
                  Gerenciar Usuários
                </Link>
              </li>
              <li>
                <Link href="/admin-dashboard/esportes" className={isActive('/admin-dashboard/esportes')}>
                  Gerenciar Esportes
                </Link>
              </li>
              <li>
                <Link href="/admin-dashboard" className={isActive('/admin-dashboard')}>
                  Visão Geral
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
}
