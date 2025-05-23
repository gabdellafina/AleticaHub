export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Bem-vindo ao AtleticaHub</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-800">
          <h2 className="text-xl font-bold mb-4">Esportes</h2>
          <p className="text-gray-300">Confira os esportes disponíveis</p>
          <a href="/sports" className="text-red-500 hover:text-red-400 mt-2 inline-block">
            VER TODOS →
          </a>
        </div>
        
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-800">
          <h2 className="text-xl font-bold mb-4">Eventos</h2>
          <p className="text-gray-300">Próximos eventos da atlética</p>
          <a href="/events" className="text-red-500 hover:text-red-400 mt-2 inline-block">
            VER TODOS →
          </a>
        </div>
      </div>

      <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Loja</h2>
          <a href="/shop" className="text-red-500 hover:text-red-400">
            VER TODOS →
          </a>
        </div>
        {/* Produtos em destaque */}
      </div>
    </div>
  );
}