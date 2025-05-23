import Link from 'next/link';
import { FaHome } from 'react-icons/fa';

export default function SportsPage() {
    const sports = [
      { name: 'Futebol', members: 24 },
      { name: 'Vôlei', members: 18 },
      { name: 'Basquete', members: 15 },
    ];
  
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
            <Link 
                href="/home" 
                className="inline-flex items-center gap-2 text-red-500 hover:text-red-400"
            >
                <FaHome />
                Voltar para Home
            </Link>
        </div>
        <h1 className="text-2xl font-bold mb-6">Esportes</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sports.map((sport, index) => (
            <div key={index} className="bg-gray-900 p-4 rounded-lg shadow border border-gray-800">
              <h2 className="font-bold text-lg">{sport.name}</h2>
              <p className="text-gray-400">{sport.members} membros</p>
              <button className="mt-2 text-red-500 hover:text-red-400">
                Ver detalhes
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }