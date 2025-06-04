'use client';

import Link from 'next/link';
import { FaHome, FaShoppingCart } from 'react-icons/fa';
import { useEffect, useState } from 'react';

type Produto = {
  id: string;
  nome: string;
  preco: number;
};

export default function ShopPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);

  useEffect(() => {
    fetch('/api/produtos')
      .then(res => res.json())
      .then(setProdutos)
      .catch(console.error);
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <Link href="/home" className="inline-flex items-center gap-2 text-red-500 hover:text-red-400">
          <FaHome />
          Voltar para Home
        </Link>
        <Link href="/cart" className="flex items-center gap-2 text-red-500 hover:text-red-400">
          <FaShoppingCart />
          Carrinho
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">Loja da Atlética</h1>

      {produtos.length === 0 ? (
        <p className="text-gray-400">Nenhum produto disponível no momento.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {produtos.map((product) => (
            <Link
              key={product.id}
              href={`/shop/${product.id}`}
              className="bg-gray-900 p-4 rounded-lg shadow border border-gray-800 hover:border-red-500 transition-colors"
            >
              <div className="h-40 bg-gray-800 rounded mb-3 flex items-center justify-center">
                <span className="text-gray-500">Imagem</span>
              </div>
              <h2 className="font-bold">{product.nome}</h2>
              <p className="text-red-500 my-2">R$ {product.preco.toFixed(2)}</p>
              <div className="text-center text-sm text-gray-400 hover:text-white">
                Ver detalhes
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
