import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <h1 className="text-4xl font-bold mb-6 text-red-500">AtleticaHub</h1>
        <p className="text-xl mb-8">Seu portal completo da atlética</p>
        
        <Link 
          href="/login" 
          className="bg-red-700 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-bold text-lg transition duration-300"
        >
          ACESSAR
        </Link>
    </div>
  );
}