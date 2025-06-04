'use client';

import { useEffect, useState } from 'react';

type Esporte = {
  id: string;
  nome: string;
  descricao: string;
  diasTreino: string[]; // ['segunda', 'quarta']
};

const diasSemana = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

export default function AdminEsportesPage() {
  const [esportes, setEsportes] = useState<Esporte[]>([]);
  const [form, setForm] = useState({ nome: '', descricao: '', diasTreino: [] as string[] });
  const [editandoId, setEditandoId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/esportes')
      .then(res => res.json())
      .then(setEsportes)
      .catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleDia = (dia: string) => {
    setForm(prev => ({
      ...prev,
      diasTreino: prev.diasTreino.includes(dia)
        ? prev.diasTreino.filter(d => d !== dia)
        : [...prev.diasTreino, dia],
    }));
  };

  const limparFormulario = () => {
    setForm({ nome: '', descricao: '', diasTreino: [] });
    setEditandoId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      nome: form.nome,
      descricao: form.descricao,
      diasTreino: form.diasTreino,
    };

    const res = await fetch(
      editandoId ? `/api/esportes/${editandoId}` : '/api/esportes',
      {
        method: editandoId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    const esporteAtualizado = await res.json();
    setEsportes(prev =>
      editandoId
        ? prev.map(e => (e.id === esporteAtualizado.id ? esporteAtualizado : e))
        : [...prev, esporteAtualizado]
    );

    limparFormulario();
  };

  const excluirEsporte = async (id: string) => {
    await fetch(`/api/esportes/${id}`, { method: 'DELETE' });
    setEsportes(esportes.filter(e => e.id !== id));
  };

  const iniciarEdicao = (esporte: Esporte) => {
    setEditandoId(esporte.id);
    setForm({
      nome: esporte.nome,
      descricao: esporte.descricao,
      diasTreino: esporte.diasTreino,
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Gerenciar Esportes</h1>

      <form onSubmit={handleSubmit} className="bg-gray-900 p-6 border border-gray-800 rounded-lg mb-6 space-y-4">
        <h2 className="text-xl font-bold text-red-500">
          {editandoId ? 'Editar Esporte' : 'Novo Esporte'}
        </h2>

        <input
          type="text"
          name="nome"
          placeholder="Nome do Esporte"
          value={form.nome}
          onChange={handleChange}
          required
          className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white"
        />
        <textarea
          name="descricao"
          placeholder="Descrição"
          value={form.descricao}
          onChange={handleChange}
          required
          className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white"
        />

        <div>
          <label className="block font-bold text-white mb-2">Dias de Treino</label>
          <div className="grid grid-cols-2 gap-2">
            {diasSemana.map(dia => (
              <label key={dia} className="flex items-center gap-2 text-white">
                <input
                  type="checkbox"
                  checked={form.diasTreino.includes(dia)}
                  onChange={() => toggleDia(dia)}
                  className="form-checkbox"
                />
                {dia.charAt(0).toUpperCase() + dia.slice(1)}
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <button type="submit" className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded font-bold">
            {editandoId ? 'Salvar Alterações' : 'Criar Esporte'}
          </button>
          {editandoId && (
            <button
              type="button"
              onClick={limparFormulario}
              className="bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded font-bold"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-red-500">Esportes Cadastrados</h2>
        {esportes.length === 0 ? (
          <p className="text-gray-400">Nenhum esporte ainda.</p>
        ) : (
          esportes.map(esporte => (
            <div key={esporte.id} className="bg-gray-900 p-4 border border-gray-800 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold">{esporte.nome}</h3>
                <div className="flex gap-2">
                  <button onClick={() => iniciarEdicao(esporte)} className="text-blue-400 hover:text-blue-300">Editar</button>
                  <button onClick={() => excluirEsporte(esporte.id)} className="text-red-500 hover:text-red-400">Excluir</button>
                </div>
              </div>
              <p className="text-gray-400">{esporte.descricao}</p>
              <p className="text-gray-400 mt-2 text-sm italic">
                Dias de treino: {esporte.diasTreino.join(', ')}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
