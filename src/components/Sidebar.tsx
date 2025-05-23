'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome } from 'react-icons/fa';

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 fixed h-full bg-red-800 shadow-lg">

      <div className="p-6 border-b border-red-900">
        <h1 className="text-xl font-bold text-white">Nome, idade</h1>
        <p className="text-red-200">Curso, faculdade</p>
        <Link 
          href="/profile" 
          className="text-white font-medium mt-2 inline-block hover:text-red-200"
        >
          Editar perfil
        </Link>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-3">
        <li>
            <Link 
              href="/shop" 
              className={`block ${pathname === '/shop' ? 'text-white font-bold' : 'text-red-200 hover:text-white'}`}
            >
              Loja
            </Link>
          </li>
          <li>
            <Link 
              href="/calendar" 
              className={`block ${pathname === '/calendar' ? 'text-white font-bold' : 'text-red-200 hover:text-white'}`}
            >
              Seu calendário
            </Link>
          </li>
          <li>
            <Link 
              href="/chat" 
              className={`block ${pathname === '/chat' ? 'text-white font-bold' : 'text-red-200 hover:text-white'}`}
            >
              Chat
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}