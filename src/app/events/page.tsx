'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaHome } from 'react-icons/fa';

type Evento = {
  id: string;
  nome: string;
  data: string;
};

export default function EventsPage() {
  const [eventos, setEventos] = useState<Evento[]>([]);

  useEffect(() => {
    fetch('/api/eventos')
      .then(res => res.json())
      .then(setEventos)
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

      <h1 className="text-2xl font-bold mb-6">Eventos</h1>

      {eventos.length === 0 ? (
        <p className="text-gray-400">Nenhum evento disponível no momento.</p>
      ) : (
        <div className="space-y-4">
          {eventos.map((event) => (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className="block bg-gray-900 p-4 rounded-lg shadow border border-gray-800 hover:border-red-500 transition"
            >
              <div className="flex justify-between">
                <h2 className="font-bold">{event.nome}</h2>
                <span className="text-red-500">{new Date(event.data).toLocaleDateString()}</span>
              </div>
              <span className="text-sm text-red-400 block mt-2">Mais informações</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
