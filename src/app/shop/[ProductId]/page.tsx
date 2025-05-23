'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaHome, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '@/context/CartContext';

export default function ProductPage({ params }: { params: { id: string } }) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  // Mock de dados do produto
  const product = {
    id: params.id,
    name: `Produto ${params.id}`,
    price: 89.90,
    description: 'Descrição detalhada do produto. Material, cuidados, etc.',
    sizes: ['P', 'M', 'G', 'GG'],
  };

  const handleAddToCart = () => {
    if (!selectedSize) return;
    
    addToCart({
      id: `${product.id}-${selectedSize}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      quantity,
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
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

      <div className="bg-gray-900 p-6 rounded-lg shadow border border-gray-800">
        <div className="h-64 bg-gray-800 rounded mb-6 flex items-center justify-center">
          <span className="text-gray-500">Imagem do Produto {product.id}</span>
        </div>
        
        <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
        <p className="text-red-500 text-xl font-bold mb-4">R$ {product.price.toFixed(2)}</p>
        
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Descrição</h3>
          <p className="text-gray-300">{product.description}</p>
        </div>
        
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Tamanhos</h3>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`w-12 h-12 flex items-center justify-center rounded-md border-2 ${
                  selectedSize === size 
                    ? 'border-red-500 bg-red-900 bg-opacity-30' 
                    : 'border-gray-700 hover:border-red-500'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Quantidade</h3>
          <div className="flex items-center w-32">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="bg-gray-800 px-3 py-1 rounded-l-md border border-gray-700"
            >
              -
            </button>
            <span className="bg-gray-800 px-4 py-1 border-t border-b border-gray-700 flex-1 text-center">
              {quantity}
            </span>
            <button 
              onClick={() => setQuantity(quantity + 1)}
              className="bg-gray-800 px-3 py-1 rounded-r-md border border-gray-700"
            >
              +
            </button>
          </div>
        </div>
        
        <button
          onClick={handleAddToCart}
          disabled={!selectedSize}
          className={`w-full py-3 rounded-md font-bold ${
            !selectedSize 
              ? 'bg-gray-700 cursor-not-allowed' 
              : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
}