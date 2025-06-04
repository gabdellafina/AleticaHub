'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import CampoMensagem from '@/components/CampoMensagem';

type Mensagem = {
  id: string;
  texto: string;
  autor: string;
  timestamp: string;
};

export default function ChatPage() {
  const { id } = useParams(); // id === "geral" ou esporteId
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);

  useEffect(() => {
    fetch(`/api/mensagens/${id}`)
      .then(res => res.json())
      .then(setMensagens);
  }, [id]);

  const handleEnviar = async (texto: string) => {
    const res = await fetch(`/api/mensagens/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conteudo: texto }),
    });

    const nova = await res.json();
    setMensagens(prev => [...prev, nova]);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Chat: {id}</h1>

      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 h-96 overflow-y-auto space-y-2">
        {mensagens.map(msg => (
          <div key={msg.id} className="bg-gray-800 p-2 rounded">
            <strong>{msg.autor}</strong>: {msg.texto}
          </div>
        ))}
      </div>

      <CampoMensagem
        tipo={id === 'geral' ? 'geral' : 'esporte'}
        esporteId={id !== 'geral' ? (id as string) : undefined}
        onEnviar={handleEnviar}
      />
    </div>
  );
}
