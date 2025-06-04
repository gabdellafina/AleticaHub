'use client';

import { useParams } from 'next/navigation';
import BotaoParticiparEsporte from '@/components/BotaoParticiparEsporte';
import { useEffect, useState } from 'react';

export default function PaginaEsporte() {
  const { id } = useParams();
  const [esporte, setEsporte] = useState<{ nome: string; descricao: string } | null>(null);

  useEffect(() => {
    fetch(`/api/esportes/${id}`)
      .then(res => res.json())
      .then(setEsporte);
  }, [id]);

  if (!esporte) return <p className="text-white">Carregando esporte...</p>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{esporte.nome}</h1>
      <p className="text-gray-300">{esporte.descricao}</p>
      <BotaoParticiparEsporte esporteId={id as string} />
    </div>
  );
}
