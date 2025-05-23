export default function PaymentPage() {
    return (
      <div className="min-h-screen bg-black text-white">
        <header className="bg-gray-900 p-4 border-b border-gray-800">
          <h1 className="text-xl font-bold text-red-500">PAGAMENTO</h1>
        </header>
        
        <main className="container mx-auto p-4 max-w-2xl">
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <h2 className="text-lg font-bold mb-6">DADOS DE PAGAMENTO</h2>
            
            <form className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Número do Cartão</label>
                <input 
                  type="text" 
                  placeholder="0000 0000 0000 0000"
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Validade</label>
                  <input 
                    type="text" 
                    placeholder="MM/AA"
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">CVV</label>
                  <input 
                    type="text" 
                    placeholder="123"
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Nome no Cartão</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              
              <div className="pt-4">
                <button 
                  type="submit" 
                  className="w-full bg-red-700 hover:bg-red-600 py-3 rounded-md font-bold"
                >
                  CONFIRMAR PAGAMENTO
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    );
  }