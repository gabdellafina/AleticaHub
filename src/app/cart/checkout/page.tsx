import Link from 'next/link';
import { FaHome, FaArrowLeft } from 'react-icons/fa';

export default function CheckoutPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-red-500 hover:text-red-400">
          <FaHome />
          Voltar para Home
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Link href="/cart" className="text-red-500 hover:text-red-400">
          <FaArrowLeft />
        </Link>
        Finalizar Compra
      </h1>
      
      <div className="bg-gray-900 p-6 rounded-lg shadow border border-gray-800">
        <form className="space-y-4">
          <div>
            <label className="block mb-2 text-gray-300">Nome no Cartão</label>
            <input 
              type="text" 
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white" 
            />
          </div>
          
          <div>
            <label className="block mb-2 text-gray-300">Número do Cartão</label>
            <input 
              type="text" 
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white" 
              placeholder="0000 0000 0000 0000"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-gray-300">Validade</label>
              <input 
                type="text" 
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white" 
                placeholder="MM/AA"
              />
            </div>
            
            <div>
              <label className="block mb-2 text-gray-300">CVV</label>
              <input 
                type="text" 
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white" 
                placeholder="123"
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded font-bold mt-6"
          >
            Confirmar Pagamento
          </button>
        </form>
      </div>
    </div>
  );
}