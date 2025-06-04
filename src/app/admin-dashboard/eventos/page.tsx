'use client';

import { useState, useEffect } from 'react';

type Evento = {
  id: string;
  nome: string;
  descricao: string;
  data: string;
  preco?: number;
  imagemUrl?: string;
};

export default function AdminEventosPage() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    data: '',
    preco: '',
    imagem: null as File | null,
  });
  const [editandoId, setEditandoId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/eventos')
      .then(res => res.json())
      .then(setEventos)
      .catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setForm(prev => ({ ...prev, imagem: file }));
  };

  const limparFormulario = () => {
    setForm({ nome: '', descricao: '', data: '', preco: '', imagem: null });
    setEditandoId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('nome', form.nome);
    formData.append('descricao', form.descricao);
    formData.append('data', form.data);
    if (form.preco) formData.append('preco', form.preco);
    if (form.imagem) formData.append('imagem', form.imagem);

    const method = editandoId ? 'PUT' : 'POST';
    const url = editandoId ? `/api/eventos/${editandoId}` : '/api/eventos';

    const res = await fetch(url, {
      method,
      body: formData,
    });

    const eventoAtualizado = await res.json();
    if (editandoId) {
      setEventos(prev => prev.map(e => (e.id === eventoAtualizado.id ? eventoAtualizado : e)));
    } else {
      setEventos([...eventos, eventoAtualizado]);
    }

    limparFormulario();
  };

  const excluirEvento = async (id: string) => {
    await fetch(`/api/eventos/${id}`, { method: 'DELETE' });
    setEventos(eventos.filter(e => e.id !== id));
  };

  const iniciarEdicao = (evento: Evento) => {
    setEditandoId(evento.id);
    setForm({
      nome: evento.nome,
      descricao: evento.descricao,
      data: evento.data.slice(0, 10),
      preco: evento.preco?.toString() ?? '',
      imagem: null,
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Gerenciar Eventos</h1>

      <form onSubmit={handleSubmit} className="bg-gray-900 p-6 border border-gray-800 rounded-lg mb-6 space-y-4">
        <h2 className="text-xl font-bold text-red-500">{editandoId ? 'Editar Evento' : 'Novo Evento'}</h2>

        <input type="text" name="nome" placeholder="Nome" value={form.nome} onChange={handleChange} required className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white" />
        <textarea name="descricao" placeholder="Descrição" value={form.descricao} onChange={handleChange} required className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white" />
        <input type="date" name="data" value={form.data} onChange={handleChange} required className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white" />
        <input type="number" name="preco" placeholder="Preço (R$) - deixe em branco se gratuito" value={form.preco} onChange={handleChange} className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white" />
        <input type="file" accept="image/*" onChange={handleFileChange} className="text-white" />

        <div className="flex gap-4">
          <button type="submit" className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded font-bold">
            {editandoId ? 'Salvar Alterações' : 'Criar Evento'}
          </button>
          {editandoId && (
            <button type="button" onClick={limparFormulario} className="bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded font-bold">
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-red-500">Eventos Cadastrados</h2>
        {eventos.length === 0 ? (
          <p className="text-gray-400">Nenhum evento ainda.</p>
        ) : (
          eventos.map(e => (
            <div key={e.id} className="bg-gray-900 p-4 border border-gray-800 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold">{e.nome}</h3>
                <span className="text-sm text-red-500">{new Date(e.data).toLocaleDateString()}</span>
              </div>
              <p className="text-gray-400">{e.descricao}</p>
              <p className="text-gray-400 mt-1">
                {e.preco ? `R$ ${e.preco.toFixed(2)}` : 'Evento Gratuito'}
              </p>
              {e.imagemUrl && (
                <img src={e.imagemUrl} alt="Banner" className="mt-2 rounded w-full h-48 object-cover" />
              )}
              <div className="flex gap-3 mt-3">
                <button onClick={() => iniciarEdicao(e)} className="text-blue-400 hover:text-blue-300">Editar</button>
                <button onClick={() => excluirEvento(e.id)} className="text-red-500 hover:text-red-400">Excluir</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
