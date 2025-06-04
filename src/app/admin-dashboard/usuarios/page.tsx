'use client';

import { useEffect, useState } from 'react';

type Usuario = {
  id: string;
  nome: string;
  email?: string;
  curso: string;
  telefone: string;
  dataNascimento: string;
  role: 'user' | 'admin';
  status: 'ativo' | 'pendente' | 'suspenso';
};

type Inscricao = {
  id: string;
  esporteNome: string;
  status: 'pendente' | 'aprovado' | 'rejeitado';
};

export default function AdminUsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [inscricoes, setInscricoes] = useState<Record<string, Inscricao[]>>({});

  useEffect(() => {
    fetch('/api/usuarios')
      .then(res => res.json())
      .then(setUsuarios)
      .catch(console.error);

    fetch('/api/inscricoes')
      .then(res => res.json())
      .then(data => {
        const agrupado = data.reduce((acc: Record<string, Inscricao[]>, insc: Inscricao & { usuarioId: string }) => {
          if (!acc[insc.usuarioId]) acc[insc.usuarioId] = [];
          acc[insc.usuarioId].push(insc);
          return acc;
        }, {});
        setInscricoes(agrupado);
      });
  }, []);

  const aprovarUsuario = async (id: string) => {
    await fetch(`/api/usuarios/${id}/aprovar`, { method: 'PUT' });
    setUsuarios(usuarios.map(u => u.id === id ? { ...u, status: 'ativo' } : u));
  };

  const promoverAdmin = async (id: string) => {
    await fetch(`/api/usuarios/${id}/promover`, { method: 'PUT' });
    setUsuarios(usuarios.map(u => u.id === id ? { ...u, role: 'admin' } : u));
  };

  const aprovarInscricao = async (inscricaoId: string, usuarioId: string) => {
    await fetch(`/api/inscricoes/${inscricaoId}/aprovar`, { method: 'PUT' });
    const novas = inscricoes[usuarioId].map(i => i.id === inscricaoId ? { ...i, status: 'aprovado' } : i);
    setInscricoes({ ...inscricoes, [usuarioId]: novas });
  };

  const rejeitarInscricao = async (inscricaoId: string, usuarioId: string) => {
    await fetch(`/api/inscricoes/${inscricaoId}/rejeitar`, { method: 'PUT' });
    const novas = inscricoes[usuarioId].map(i => i.id === inscricaoId ? { ...i, status: 'rejeitado' } : i);
    setInscricoes({ ...inscricoes, [usuarioId]: novas });
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Gerenciar Usuários</h1>

      {usuarios.length === 0 ? (
        <p className="text-gray-400">Nenhum usuário cadastrado ainda.</p>
      ) : (
        usuarios.map(usuario => (
          <div key={usuario.id} className="bg-gray-900 p-4 border border-gray-800 rounded-lg mb-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-bold">{usuario.nome}</h2>
                <p className="text-gray-400 text-sm">{usuario.curso} • {usuario.telefone}</p>
                <p className="text-sm text-yellow-400">Status: {usuario.status}</p>
                <p className="text-sm text-blue-400">Papel: {usuario.role}</p>
              </div>

              <div className="flex gap-3">
                {usuario.status !== 'ativo' && (
                  <button onClick={() => aprovarUsuario(usuario.id)} className="text-green-500 hover:text-green-400">Aprovar</button>
                )}
                {usuario.role !== 'admin' && (
                  <button onClick={() => promoverAdmin(usuario.id)} className="text-blue-500 hover:text-blue-400">Tornar Admin</button>
                )}
              </div>
            </div>

            {inscricoes[usuario.id]?.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold text-red-400 mb-2">Inscrições em esportes</h3>
                {inscricoes[usuario.id].map(inscricao => (
                  <div key={inscricao.id} className="bg-gray-800 p-2 rounded mb-2 flex justify-between items-center">
                    <span>{inscricao.esporteNome} — {inscricao.status}</span>
                    {inscricao.status === 'pendente' && (
                      <div className="flex gap-2">
                        <button onClick={() => aprovarInscricao(inscricao.id, usuario.id)} className="text-green-400 hover:text-green-300 text-sm">Aprovar</button>
                        <button onClick={() => rejeitarInscricao(inscricao.id, usuario.id)} className="text-red-400 hover:text-red-300 text-sm">Rejeitar</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
