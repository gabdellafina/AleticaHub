import Link from 'next/link';
import { FaHome, FaShoppingCart } from 'react-icons/fa';

const products = [
  { id: 1, name: 'Camisa Oficial', price: 89.90 },
  { id: 2, name: 'Moletom', price: 129.90 },
  { id: 3, name: 'Boné', price: 49.90 },
];

export default function ShopPage() {
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <Link 
            key={product.id} 
            href={`/shop/${product.id}`}
            className="bg-gray-900 p-4 rounded-lg shadow border border-gray-800 hover:border-red-500 transition-colors"
          >
            <div className="h-40 bg-gray-800 rounded mb-3 flex items-center justify-center">
              <span className="text-gray-500">Imagem</span>
            </div>
            <h2 className="font-bold">{product.name}</h2>
            <p className="text-red-500 my-2">R$ {product.price.toFixed(2)}</p>
            <div className="text-center text-sm text-gray-400 hover:text-white">
              Ver detalhes
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}