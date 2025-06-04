'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaHome } from 'react-icons/fa';

type Esporte = {
  id: string;
  nome: string;
  membros: number;
};

export default function SportsPage() {
  const [esportes, setEsportes] = useState<Esporte[]>([]);

  useEffect(() => {
    fetch('/api/esportes')
      .then(res => res.json())
      .then(setEsportes)
      .catch(console.error);
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/home" className="inline-flex items-center gap-2 text-red-500 hover:text-red-400">
          <FaHome />
          Voltar para Home
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">Esportes</h1>

      {esportes.length === 0 ? (
        <p className="text-gray-400">Nenhum esporte disponível no momento.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {esportes.map((sport) => (
            <Link
              key={sport.id}
              href={`/sports/${sport.id}`}
              className="bg-gray-900 p-4 rounded-lg shadow border border-gray-800 hover:border-red-500 transition"
            >
              <h2 className="font-bold text-lg">{sport.nome}</h2>
              <p className="text-gray-400">{sport.membros} membros</p>
              <span className="text-red-500 text-sm mt-1 block">Ver detalhes</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
