import Link from 'next/link';
import { FaHome, FaComments } from 'react-icons/fa';

const chats = [
  { id: 1, name: 'Geral', lastMessage: 'Bem-vindos ao novo semestre!' },
  { id: 2, name: 'Futebol', lastMessage: 'Treino amanhã às 14h' },
];

export default function ChatPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/home" className="inline-flex items-center gap-2 text-red-500 hover:text-red-400">
          <FaHome />
          Voltar para Home
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FaComments />
        Chat
      </h1>
      
      <div className="bg-gray-900 p-6 rounded-lg shadow border border-gray-800">
        <div className="space-y-4">
          {chats.map((chat) => (
            <div 
              key={chat.id} 
              className="p-4 border border-gray-800 rounded-lg hover:border-red-500 cursor-pointer"
            >
              <h3 className="font-bold">{chat.name}</h3>
              <p className="text-gray-400 text-sm truncate">{chat.lastMessage}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}