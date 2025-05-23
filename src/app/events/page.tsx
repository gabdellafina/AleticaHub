import { FaHome } from "react-icons/fa";
import Link from "next/link";

export default function EventsPage() {
    const events = [
      { name: 'Campeonato Interno', date: '15/06' },
      { name: 'Festival Esportivo', date: '22/06' },
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
        <h1 className="text-2xl font-bold mb-6">Eventos</h1>
        
        <div className="space-y-4">
          {events.map((event, index) => (
            <div key={index} className="bg-gray-900 p-4 rounded-lg shadow border border-gray-800">
              <div className="flex justify-between">
                <h2 className="font-bold">{event.name}</h2>
                <span className="text-red-500">{event.date}</span>
              </div>
              <button className="mt-2 text-red-500 hover:text-red-400">
                Mais informações
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }