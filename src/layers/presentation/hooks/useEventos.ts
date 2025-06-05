import { useState, useEffect, useCallback } from 'react';
import { EventoUseCases } from '../../business/usecases';
import { Evento, CreateEventoDTO, UpdateEventoDTO, EventoStatus } from '../../shared/types';

interface UseEventosOptions {
  autoLoad?: boolean;
  esporteId?: string;
}

interface UseEventosReturn {
  eventos: Evento[];
  loading: boolean;
  error: string | null;
  createEvento: (data: CreateEventoDTO) => Promise<Evento | null>;
  updateEvento: (id: string, data: UpdateEventoDTO) => Promise<Evento | null>;
  deleteEvento: (id: string) => Promise<boolean>;
  getEventoById: (id: string) => Promise<Evento | null>;
  searchEventos: (query: string) => Promise<Evento[]>;
  getEventosByEsporte: (esporteId: string) => Promise<Evento[]>;
  updateEventoStatus: (id: string, status: EventoStatus) => Promise<boolean>;
  refreshEventos: () => Promise<void>;
  clearError: () => void;
}

export function useEventos(
  eventoUseCases: EventoUseCases,
  options: UseEventosOptions = {}
): UseEventosReturn {
  const { autoLoad = true, esporteId } = options;

  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refreshEventos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let result: Evento[];
      if (esporteId) {
        result = await eventoUseCases.getEventosByEsporte(esporteId);
      } else {
        result = await eventoUseCases.getAllEventos();
      }
      
      setEventos(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar eventos';
      setError(errorMessage);
      console.error('Erro ao carregar eventos:', err);
    } finally {
      setLoading(false);
    }
  }, [eventoUseCases, esporteId]);

  const createEvento = useCallback(async (data: CreateEventoDTO): Promise<Evento | null> => {
    try {
      setLoading(true);
      setError(null);
      const evento = await eventoUseCases.createEvento(data);
      setEventos(prev => [...prev, evento]);
      return evento;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar evento';
      setError(errorMessage);
      console.error('Erro ao criar evento:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [eventoUseCases]);

  const updateEvento = useCallback(async (id: string, data: UpdateEventoDTO): Promise<Evento | null> => {
    try {
      setLoading(true);
      setError(null);
      const evento = await eventoUseCases.updateEvento(id, data);
      setEventos(prev => prev.map(e => e.id === id ? evento : e));
      return evento;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar evento';
      setError(errorMessage);
      console.error('Erro ao atualizar evento:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [eventoUseCases]);

  const deleteEvento = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await eventoUseCases.deleteEvento(id);
      setEventos(prev => prev.filter(e => e.id !== id));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir evento';
      setError(errorMessage);
      console.error('Erro ao excluir evento:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [eventoUseCases]);

  const getEventoById = useCallback(async (id: string): Promise<Evento | null> => {
    try {
      setLoading(true);
      setError(null);
      const evento = await eventoUseCases.getEventoById(id);
      return evento;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar evento';
      setError(errorMessage);
      console.error('Erro ao buscar evento:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [eventoUseCases]);

  const searchEventos = useCallback(async (query: string): Promise<Evento[]> => {
    try {
      setLoading(true);
      setError(null);
      const results = await eventoUseCases.searchEventos(query);
      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar eventos';
      setError(errorMessage);
      console.error('Erro ao buscar eventos:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [eventoUseCases]);

  const getEventosByEsporte = useCallback(async (esporteId: string): Promise<Evento[]> => {
    try {
      setLoading(true);
      setError(null);
      const results = await eventoUseCases.getEventosByEsporte(esporteId);
      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar eventos do esporte';
      setError(errorMessage);
      console.error('Erro ao buscar eventos do esporte:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [eventoUseCases]);

  const updateEventoStatus = useCallback(async (id: string, status: EventoStatus): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const evento = await eventoUseCases.updateEventoStatus(id, status);
      setEventos(prev => prev.map(e => e.id === id ? evento : e));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar status do evento';
      setError(errorMessage);
      console.error('Erro ao atualizar status do evento:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [eventoUseCases]);

  useEffect(() => {
    if (autoLoad) {
      refreshEventos();
    }
  }, [autoLoad, refreshEventos]);

  return {
    eventos,
    loading,
    error,
    createEvento,
    updateEvento,
    deleteEvento,
    getEventoById,
    searchEventos,
    getEventosByEsporte,
    updateEventoStatus,
    refreshEventos,
    clearError
  };
}
