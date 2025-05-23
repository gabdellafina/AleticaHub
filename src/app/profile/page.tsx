import { FaHome } from "react-icons/fa";
import Link from "next/link";

export default function ProfilePage() {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
            <Link 
                href="/home" 
                className="inline-flex items-center gap-2 text-red-500 hover:text-red-400"
            >
                <FaHome />
                Voltar para Home
            </Link>
            </div>
        <h1 className="text-2xl font-bold mb-6">Editar Perfil</h1>
        
        <form className="space-y-4 bg-gray-900 p-6 rounded-lg shadow border border-gray-800">
          <div>
            <label className="block mb-2 text-gray-300">Nome completo</label>
            <input 
              type="text" 
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white" 
            />
          </div>
          
          <div>
            <label className="block mb-2 text-gray-300">Idade</label>
            <input 
              type="number" 
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white" 
            />
          </div>
          
          <div>
            <label className="block mb-2 text-gray-300">Curso</label>
            <input 
              type="text" 
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white" 
            />
          </div>
          
          <button 
            type="submit" 
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Salvar Alterações
          </button>
        </form>
      </div>
    );
  }