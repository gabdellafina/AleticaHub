'use client';

import { useState } from 'react';

type Props = {
  eventoId: string;
  preco?: number;
};

export default function BotaoInscricaoEvento({ eventoId, preco }: Props) {
  const [inscrito, setInscrito] = useState(false);
  const [metodo, setMetodo] = useState<'pix' | 'dinheiro' | null>(null);
  const [chavePix, setChavePix] = useState<string | null>(null);

  const gerarChavePix = () => {
    return 'chave-' + Math.floor(Math.random() * 1000000000);
  };

  const handleEscolherMetodo = (m: 'pix' | 'dinheiro') => {
    setMetodo(m);
    if (m === 'pix') {
      const chave = gerarChavePix();
      setChavePix(chave);
    }
  };

  const handleInscricao = async () => {
    await fetch('/api/inscricoes-evento', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventoId, metodoPagamento: metodo }),
    });
    setInscrito(true);
  };

  if (inscrito) {
    return <p className="text-green-500 mt-2">Inscrição confirmada!</p>;
  }

  return (
    <div className="mt-2">
      <p className="text-gray-300 mb-2">{preco ? `Valor: R$ ${preco.toFixed(2)}` : 'Evento gratuito'}</p>

      {preco ? (
        !metodo ? (
          <div className="flex gap-4">
            <button onClick={() => handleEscolherMetodo('pix')} className="bg-red-600 px-4 py-2 rounded text-white">Pagar com Pix</button>
            <button onClick={() => handleEscolherMetodo('dinheiro')} className="bg-gray-600 px-4 py-2 rounded text-white">Pagar com Dinheiro</button>
          </div>
        ) : (
          <div className="space-y-2">
            {metodo === 'pix' && (
              <div>
                <p className="text-gray-400 text-sm">Chave Pix gerada:</p>
                <div className="bg-gray-800 p-2 rounded text-white font-mono">{chavePix}</div>
              </div>
            )}
            <button onClick={handleInscricao} className="bg-red-600 px-4 py-2 rounded text-white font-bold">Confirmar inscrição</button>
          </div>
        )
      ) : (
        <button onClick={handleInscricao} className="bg-red-600 px-4 py-2 rounded text-white font-bold">
          Inscrever-se
        </button>
      )}
    </div>
  );
}
