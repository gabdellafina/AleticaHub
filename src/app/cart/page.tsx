'use client';

import Link from 'next/link';
import { FaHome, FaArrowLeft, FaTrash } from 'react-icons/fa';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-red-500 hover:text-red-400">
          <FaHome />
          Voltar para Home
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Link href="/shop" className="text-red-500 hover:text-red-400">
          <FaArrowLeft />
        </Link>
        Seu Carrinho
      </h1>
      
      <div className="bg-gray-900 p-6 rounded-lg shadow border border-gray-800">
        {cart.length === 0 ? (
          <div className="text-center py-8">
            <p>Seu carrinho está vazio</p>
            <Link 
              href="/shop" 
              className="inline-block mt-4 text-red-500 hover:text-red-400"
            >
              Ir para a Loja
            </Link>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-800">
              {cart.map((item) => (
                <div key={item.id} className="py-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-gray-400">
                      Tamanho: {item.size} • {item.quantity}x R$ {item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-bold">R$ {(item.price * item.quantity).toFixed(2)}</p>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-400"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-800">
              <div className="flex justify-between font-bold text-lg mb-6">
                <span>Total:</span>
                <span className="text-red-500">R$ {subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={clearCart}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded"
                >
                  Limpar Carrinho
                </button>
                <Link
                  href="/cart/checkout"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-center text-white py-2 rounded"
                >
                  Finalizar Compra
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}