import { useState, useEffect, useCallback } from 'react';
import { EsporteUseCases } from '../../business/usecases';
import { Esporte, CreateEsporteDTO, UpdateEsporteDTO } from '../../shared/types';

interface UseEsportesOptions {
  autoLoad?: boolean;
}

interface UseEsportesReturn {
  esportes: Esporte[];
  loading: boolean;
  error: string | null;
  createEsporte: (data: CreateEsporteDTO) => Promise<Esporte | null>;
  updateEsporte: (id: string, data: UpdateEsporteDTO) => Promise<Esporte | null>;
  deleteEsporte: (id: string) => Promise<boolean>;
  getEsporteById: (id: string) => Promise<Esporte | null>;
  searchEsportes: (query: string) => Promise<Esporte[]>;
  refreshEsportes: () => Promise<void>;
  clearError: () => void;
}

export function useEsportes(
  esporteUseCases: EsporteUseCases,
  options: UseEsportesOptions = {}
): UseEsportesReturn {
  const { autoLoad = true } = options;

  const [esportes, setEsportes] = useState<Esporte[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refreshEsportes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await esporteUseCases.getAllEsportes();
      setEsportes(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar esportes';
      setError(errorMessage);
      console.error('Erro ao carregar esportes:', err);
    } finally {
      setLoading(false);
    }
  }, [esporteUseCases]);

  const createEsporte = useCallback(async (data: CreateEsporteDTO): Promise<Esporte | null> => {
    try {
      setLoading(true);
      setError(null);
      const esporte = await esporteUseCases.createEsporte(data);
      setEsportes(prev => [...prev, esporte]);
      return esporte;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar esporte';
      setError(errorMessage);
      console.error('Erro ao criar esporte:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [esporteUseCases]);

  const updateEsporte = useCallback(async (id: string, data: UpdateEsporteDTO): Promise<Esporte | null> => {
    try {
      setLoading(true);
      setError(null);
      const esporte = await esporteUseCases.updateEsporte(id, data);
      setEsportes(prev => prev.map(e => e.id === id ? esporte : e));
      return esporte;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar esporte';
      setError(errorMessage);
      console.error('Erro ao atualizar esporte:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [esporteUseCases]);

  const deleteEsporte = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await esporteUseCases.deleteEsporte(id);
      setEsportes(prev => prev.filter(e => e.id !== id));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir esporte';
      setError(errorMessage);
      console.error('Erro ao excluir esporte:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [esporteUseCases]);

  const getEsporteById = useCallback(async (id: string): Promise<Esporte | null> => {
    try {
      setLoading(true);
      setError(null);
      const esporte = await esporteUseCases.getEsporteById(id);
      return esporte;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar esporte';
      setError(errorMessage);
      console.error('Erro ao buscar esporte:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [esporteUseCases]);

  const searchEsportes = useCallback(async (query: string): Promise<Esporte[]> => {
    try {
      setLoading(true);
      setError(null);
      const results = await esporteUseCases.searchEsportes(query);
      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar esportes';
      setError(errorMessage);
      console.error('Erro ao buscar esportes:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [esporteUseCases]);

  useEffect(() => {
    if (autoLoad) {
      refreshEsportes();
    }
  }, [autoLoad, refreshEsportes]);

  return {
    esportes,
    loading,
    error,
    createEsporte,
    updateEsporte,
    deleteEsporte,
    getEsporteById,
    searchEsportes,
    refreshEsportes,
    clearError
  };
}
