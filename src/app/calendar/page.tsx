import Link from 'next/link';
import { FaHome, FaCalendarAlt } from 'react-icons/fa';

const events = [
  { id: 1, title: 'Treino de Futebol', date: '15/06', time: '14:00' },
  { id: 2, title: 'Jogo de Basquete', date: '18/06', time: '19:00' },
];

export default function CalendarPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/home" className="inline-flex items-center gap-2 text-red-500 hover:text-red-400">
          <FaHome />
          Voltar para Home
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FaCalendarAlt />
        Calendário
      </h1>
      
      <div className="bg-gray-900 p-6 rounded-lg shadow border border-gray-800">
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="border-b border-gray-800 pb-4 last:border-0">
              <div className="flex justify-between">
                <h3 className="font-bold">{event.title}</h3>
                <span className="text-red-500">{event.date} • {event.time}</span>
              </div>
              <button className="mt-2 text-red-500 hover:text-red-400 text-sm">
                Mais detalhes
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}