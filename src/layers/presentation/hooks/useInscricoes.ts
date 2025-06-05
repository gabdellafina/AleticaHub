import { useState, useEffect, useCallback } from 'react';
import { InscricaoUseCases } from '../../business/usecases';
import { Inscricao, CreateInscricaoDTO, UpdateInscricaoDTO, InscricaoStatus } from '../../shared/types';

interface UseInscricoesOptions {
  autoLoad?: boolean;
  eventoId?: string;
}

interface UseInscricoesReturn {
  inscricoes: Inscricao[];
  loading: boolean;
  error: string | null;
  createInscricao: (data: CreateInscricaoDTO) => Promise<Inscricao | null>;
  updateInscricao: (id: string, data: UpdateInscricaoDTO) => Promise<Inscricao | null>;
  cancelInscricao: (id: string) => Promise<boolean>;
  approveInscricao: (id: string) => Promise<boolean>;
  rejectInscricao: (id: string, motivo?: string) => Promise<boolean>;
  getInscricaoById: (id: string) => Promise<Inscricao | null>;
  getUserInscricoes: (status?: InscricaoStatus) => Promise<Inscricao[]>;
  getEventoInscricoes: (eventoId: string, status?: InscricaoStatus) => Promise<Inscricao[]>;
  getInscricaoStats: (eventoId: string) => Promise<any>;
  exportInscricoes: (eventoId: string, format?: string) => Promise<string>;
  refreshInscricoes: () => Promise<void>;
  clearError: () => void;
}

export function useInscricoes(
  inscricaoUseCases: InscricaoUseCases,
  options: UseInscricoesOptions = {}
): UseInscricoesReturn {
  const { autoLoad = true, eventoId } = options;

  const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refreshInscricoes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let result: Inscricao[];
      if (eventoId) {
        result = await inscricaoUseCases.getEventoInscricoes(eventoId);
      } else {
        result = await inscricaoUseCases.getUserInscricoes();
      }
      
      setInscricoes(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar inscrições';
      setError(errorMessage);
      console.error('Erro ao carregar inscrições:', err);
    } finally {
      setLoading(false);
    }
  }, [inscricaoUseCases, eventoId]);

  const createInscricao = useCallback(async (data: CreateInscricaoDTO): Promise<Inscricao | null> => {
    try {
      setLoading(true);
      setError(null);
      const inscricao = await inscricaoUseCases.createInscricao(data);
      setInscricoes(prev => [...prev, inscricao]);
      return inscricao;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar inscrição';
      setError(errorMessage);
      console.error('Erro ao criar inscrição:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [inscricaoUseCases]);

  const updateInscricao = useCallback(async (id: string, data: UpdateInscricaoDTO): Promise<Inscricao | null> => {
    try {
      setLoading(true);
      setError(null);
      const inscricao = await inscricaoUseCases.updateInscricao(id, data);
      setInscricoes(prev => prev.map(i => i.id === id ? inscricao : i));
      return inscricao;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar inscrição';
      setError(errorMessage);
      console.error('Erro ao atualizar inscrição:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [inscricaoUseCases]);

  const cancelInscricao = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const inscricao = await inscricaoUseCases.cancelInscricao(id);
      setInscricoes(prev => prev.map(i => i.id === id ? inscricao : i));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao cancelar inscrição';
      setError(errorMessage);
      console.error('Erro ao cancelar inscrição:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [inscricaoUseCases]);

  const approveInscricao = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const inscricao = await inscricaoUseCases.approveInscricao(id);
      setInscricoes(prev => prev.map(i => i.id === id ? inscricao : i));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao aprovar inscrição';
      setError(errorMessage);
      console.error('Erro ao aprovar inscrição:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [inscricaoUseCases]);

  const rejectInscricao = useCallback(async (id: string, motivo?: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const inscricao = await inscricaoUseCases.rejectInscricao(id, motivo);
      setInscricoes(prev => prev.map(i => i.id === id ? inscricao : i));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao rejeitar inscrição';
      setError(errorMessage);
      console.error('Erro ao rejeitar inscrição:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [inscricaoUseCases]);

  const getInscricaoById = useCallback(async (id: string): Promise<Inscricao | null> => {
    try {
      setLoading(true);
      setError(null);
      const inscricao = await inscricaoUseCases.getInscricaoById(id);
      return inscricao;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar inscrição';
      setError(errorMessage);
      console.error('Erro ao buscar inscrição:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [inscricaoUseCases]);

  const getUserInscricoes = useCallback(async (status?: InscricaoStatus): Promise<Inscricao[]> => {
    try {
      setLoading(true);
      setError(null);
      const results = await inscricaoUseCases.getUserInscricoes(status);
      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar inscrições do usuário';
      setError(errorMessage);
      console.error('Erro ao buscar inscrições do usuário:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [inscricaoUseCases]);

  const getEventoInscricoes = useCallback(async (eventoId: string, status?: InscricaoStatus): Promise<Inscricao[]> => {
    try {
      setLoading(true);
      setError(null);
      const results = await inscricaoUseCases.getEventoInscricoes(eventoId, status);
      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar inscrições do evento';
      setError(errorMessage);
      console.error('Erro ao buscar inscrições do evento:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [inscricaoUseCases]);

  const getInscricaoStats = useCallback(async (eventoId: string): Promise<any> => {
    try {
      setLoading(true);
      setError(null);
      const stats = await inscricaoUseCases.getInscricaoStats(eventoId);
      return stats;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar estatísticas de inscrições';
      setError(errorMessage);
      console.error('Erro ao buscar estatísticas de inscrições:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [inscricaoUseCases]);

  const exportInscricoes = useCallback(async (eventoId: string, format = 'csv'): Promise<string> => {
    try {
      setLoading(true);
      setError(null);
      const exportData = await inscricaoUseCases.exportInscricoes(eventoId, format);
      return exportData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao exportar inscrições';
      setError(errorMessage);
      console.error('Erro ao exportar inscrições:', err);
      return '';
    } finally {
      setLoading(false);
    }
  }, [inscricaoUseCases]);

  useEffect(() => {
    if (autoLoad) {
      refreshInscricoes();
    }
  }, [autoLoad, refreshInscricoes]);

  return {
    inscricoes,
    loading,
    error,
    createInscricao,
    updateInscricao,
    cancelInscricao,
    approveInscricao,
    rejectInscricao,
    getInscricaoById,
    getUserInscricoes,
    getEventoInscricoes,
    getInscricaoStats,
    exportInscricoes,
    refreshInscricoes,
    clearError
  };
}
