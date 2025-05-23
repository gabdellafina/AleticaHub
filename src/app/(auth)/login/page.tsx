import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="bg-gray-900 p-8 rounded-lg border border-gray-700 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-red-500">ATLÉTICA HUB</h1>
          <p className="text-gray-300 mt-2">Faça login para continuar</p>
        </div>
        
        <form className="space-y-6">
          <div>
            <label className="block text-gray-300 mb-2">E-mail</label>
            <input 
              type="email" 
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2">Senha</label>
            <input 
              type="password" 
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-red-700 hover:bg-red-600 text-white py-3 px-4 rounded-md font-bold transition duration-300"
          >
            ENTRAR
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Não tem conta? {' '}
            <Link href="/register" className="text-red-500 hover:text-red-400 font-semibold">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}