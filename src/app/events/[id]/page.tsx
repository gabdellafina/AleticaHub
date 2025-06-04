'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import BotaoInscricaoEvento from '@/components/BotaoInscricaoEvento';

export default function PaginaEvento() {
  const { id } = useParams();
  const [evento, setEvento] = useState<{
    nome: string;
    descricao: string;
    data: string;
    preco?: number;
    imagemUrl?: string;
  } | null>(null);

  useEffect(() => {
    fetch(`/api/eventos/${id}`)
      .then(res => res.json())
      .then(setEvento);
  }, [id]);

  if (!evento) return <p className="text-white">Carregando evento...</p>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{evento.nome}</h1>
      <p className="text-sm text-gray-400 mb-4">{new Date(evento.data).toLocaleDateString()}</p>
      {evento.imagemUrl && (
        <img src={evento.imagemUrl} alt="Banner" className="w-full h-64 object-cover rounded mb-4" />
      )}
      <p className="text-gray-300 mb-4">{evento.descricao}</p>

      <BotaoInscricaoEvento eventoId={id as string} preco={evento.preco} />
    </div>
  );
}
