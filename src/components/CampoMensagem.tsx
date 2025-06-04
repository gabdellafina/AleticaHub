'use client';

import { useEffect, useState } from 'react';

type Props = {
  tipo: 'geral' | 'esporte';
  esporteId?: string;
  onEnviar: (texto: string) => void;
};

export default function CampoMensagem({ tipo, esporteId, onEnviar }: Props) {
  const [permitido, setPermitido] = useState(false);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    fetch(`/api/permissoes-chat?tipo=${tipo}&esporteId=${esporteId || ''}`)
      .then(res => res.json())
      .then(data => setPermitido(data.permitido))
      .catch(() => setPermitido(false));
  }, [tipo, esporteId]);

  if (!permitido) {
    return (
      <p className="text-sm italic text-gray-500 mt-4">
        {tipo === 'geral'
          ? 'Apenas administradores podem enviar mensagens aqui.'
          : 'Você precisa ter a inscrição aprovada para enviar mensagens neste esporte.'}
      </p>
    );
  }

  const handleSend = () => {
    if (mensagem.trim()) {
      onEnviar(mensagem.trim());
      setMensagem('');
    }
  };

  return (
    <div className="flex gap-2 mt-4">
      <input
        value={mensagem}
        onChange={(e) => setMensagem(e.target.value)}
        className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded text-white"
        placeholder="Digite sua mensagem..."
      />
      <button onClick={handleSend} className="bg-red-700 hover:bg-red-600 px-4 py-2 rounded text-white">
        Enviar
      </button>
    </div>
  );
}
