'use client';

import { useState, useEffect } from 'react';

type Props = {
  esporteId: string;
};

export default function BotaoParticiparEsporte({ esporteId }: Props) {
  const [status, setStatus] = useState<'pendente' | 'aprovado' | 'nenhum'>('nenhum');

  useEffect(() => {
    fetch(`/api/inscricoes/${esporteId}/status`)
      .then(res => res.json())
      .then(data => setStatus(data.status))
      .catch(() => setStatus('nenhum'));
  }, [esporteId]);

  const handleInscricao = async () => {
    const res = await fetch(`/api/inscricoes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ esporteId }),
    });

    if (res.ok) {
      setStatus('pendente');
    }
  };

  return (
    <div>
      {status === 'nenhum' && (
        <button
          onClick={handleInscricao}
          className="text-red-500 hover:text-red-400 font-semibold mt-2"
        >
          Participar do esporte
        </button>
      )}
      {status === 'pendente' && (
        <span className="text-yellow-400 text-sm mt-2 block">Inscrição pendente</span>
      )}
      {status === 'aprovado' && (
        <span className="text-green-500 text-sm mt-2 block">Inscrição aprovada</span>
      )}
    </div>
  );
}
