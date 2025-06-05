import { useState, useEffect, useCallback } from 'react';
import { LojaUseCases } from '../../business/usecases';
import { Produto, Pedido, CreateProdutoDTO, UpdateProdutoDTO, CreatePedidoDTO, ProdutoStatus, PedidoStatus } from '../../shared/types';

interface UseLojaOptions {
  autoLoadProdutos?: boolean;
  autoLoadPedidos?: boolean;
}

interface UseLojaReturn {
  // Produtos
  produtos: Produto[];
  produtosLoading: boolean;
  produtosError: string | null;
  createProduto: (data: CreateProdutoDTO) => Promise<Produto | null>;
  updateProduto: (id: string, data: UpdateProdutoDTO) => Promise<Produto | null>;
  deleteProduto: (id: string) => Promise<boolean>;
  getProdutoById: (id: string) => Promise<Produto | null>;
  searchProdutos: (query: string) => Promise<Produto[]>;
  getProdutosByCategoria: (categoria: string) => Promise<Produto[]>;
  updateProdutoStatus: (id: string, status: ProdutoStatus) => Promise<boolean>;
  updateProdutoStock: (id: string, quantidade: number) => Promise<boolean>;
  
  // Pedidos
  pedidos: Pedido[];
  pedidosLoading: boolean;
  pedidosError: string | null;
  createPedido: (data: CreatePedidoDTO) => Promise<Pedido | null>;
  getUserPedidos: () => Promise<Pedido[]>;
  getPedidoById: (id: string) => Promise<Pedido | null>;
  cancelPedido: (id: string) => Promise<boolean>;
  updatePedidoStatus: (id: string, status: PedidoStatus) => Promise<boolean>;
  
  // Utils
  refreshProdutos: () => Promise<void>;
  refreshPedidos: () => Promise<void>;
  clearErrors: () => void;
}

export function useLoja(
  lojaUseCases: LojaUseCases,
  options: UseLojaOptions = {}
): UseLojaReturn {
  const { autoLoadProdutos = true, autoLoadPedidos = false } = options;

  // Produtos state
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [produtosLoading, setProdutosLoading] = useState(false);
  const [produtosError, setProdutosError] = useState<string | null>(null);

  // Pedidos state
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [pedidosLoading, setPedidosLoading] = useState(false);
  const [pedidosError, setPedidosError] = useState<string | null>(null);

  const clearErrors = useCallback(() => {
    setProdutosError(null);
    setPedidosError(null);
  }, []);

  // Produtos functions
  const refreshProdutos = useCallback(async () => {
    try {
      setProdutosLoading(true);
      setProdutosError(null);
      const result = await lojaUseCases.getAllProdutos();
      setProdutos(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar produtos';
      setProdutosError(errorMessage);
      console.error('Erro ao carregar produtos:', err);
    } finally {
      setProdutosLoading(false);
    }
  }, [lojaUseCases]);

  const createProduto = useCallback(async (data: CreateProdutoDTO): Promise<Produto | null> => {
    try {
      setProdutosLoading(true);
      setProdutosError(null);
      const produto = await lojaUseCases.createProduto(data);
      setProdutos(prev => [...prev, produto]);
      return produto;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar produto';
      setProdutosError(errorMessage);
      console.error('Erro ao criar produto:', err);
      return null;
    } finally {
      setProdutosLoading(false);
    }
  }, [lojaUseCases]);

  const updateProduto = useCallback(async (id: string, data: UpdateProdutoDTO): Promise<Produto | null> => {
    try {
      setProdutosLoading(true);
      setProdutosError(null);
      const produto = await lojaUseCases.updateProduto(id, data);
      setProdutos(prev => prev.map(p => p.id === id ? produto : p));
      return produto;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar produto';
      setProdutosError(errorMessage);
      console.error('Erro ao atualizar produto:', err);
      return null;
    } finally {
      setProdutosLoading(false);
    }
  }, [lojaUseCases]);

  const deleteProduto = useCallback(async (id: string): Promise<boolean> => {
    try {
      setProdutosLoading(true);
      setProdutosError(null);
      await lojaUseCases.deleteProduto(id);
      setProdutos(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir produto';
      setProdutosError(errorMessage);
      console.error('Erro ao excluir produto:', err);
      return false;
    } finally {
      setProdutosLoading(false);
    }
  }, [lojaUseCases]);

  const getProdutoById = useCallback(async (id: string): Promise<Produto | null> => {
    try {
      setProdutosLoading(true);
      setProdutosError(null);
      const produto = await lojaUseCases.getProdutoById(id);
      return produto;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar produto';
      setProdutosError(errorMessage);
      console.error('Erro ao buscar produto:', err);
      return null;
    } finally {
      setProdutosLoading(false);
    }
  }, [lojaUseCases]);

  const searchProdutos = useCallback(async (query: string): Promise<Produto[]> => {
    try {
      setProdutosLoading(true);
      setProdutosError(null);
      const results = await lojaUseCases.searchProdutos(query);
      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar produtos';
      setProdutosError(errorMessage);
      console.error('Erro ao buscar produtos:', err);
      return [];
    } finally {
      setProdutosLoading(false);
    }
  }, [lojaUseCases]);

  const getProdutosByCategoria = useCallback(async (categoria: string): Promise<Produto[]> => {
    try {
      setProdutosLoading(true);
      setProdutosError(null);
      const results = await lojaUseCases.getProdutosByCategoria(categoria);
      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar produtos da categoria';
      setProdutosError(errorMessage);
      console.error('Erro ao buscar produtos da categoria:', err);
      return [];
    } finally {
      setProdutosLoading(false);
    }
  }, [lojaUseCases]);

  const updateProdutoStatus = useCallback(async (id: string, status: ProdutoStatus): Promise<boolean> => {
    try {
      setProdutosLoading(true);
      setProdutosError(null);
      const produto = await lojaUseCases.updateProdutoStatus(id, status);
      setProdutos(prev => prev.map(p => p.id === id ? produto : p));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar status do produto';
      setProdutosError(errorMessage);
      console.error('Erro ao atualizar status do produto:', err);
      return false;
    } finally {
      setProdutosLoading(false);
    }
  }, [lojaUseCases]);

  const updateProdutoStock = useCallback(async (id: string, quantidade: number): Promise<boolean> => {
    try {
      setProdutosLoading(true);
      setProdutosError(null);
      const produto = await lojaUseCases.updateProdutoStock(id, quantidade);
      setProdutos(prev => prev.map(p => p.id === id ? produto : p));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar estoque do produto';
      setProdutosError(errorMessage);
      console.error('Erro ao atualizar estoque do produto:', err);
      return false;
    } finally {
      setProdutosLoading(false);
    }
  }, [lojaUseCases]);

  // Pedidos functions
  const refreshPedidos = useCallback(async () => {
    try {
      setPedidosLoading(true);
      setPedidosError(null);
      const result = await lojaUseCases.getUserPedidos();
      setPedidos(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar pedidos';
      setPedidosError(errorMessage);
      console.error('Erro ao carregar pedidos:', err);
    } finally {
      setPedidosLoading(false);
    }
  }, [lojaUseCases]);

  const createPedido = useCallback(async (data: CreatePedidoDTO): Promise<Pedido | null> => {
    try {
      setPedidosLoading(true);
      setPedidosError(null);
      const pedido = await lojaUseCases.createPedido(data);
      setPedidos(prev => [...prev, pedido]);
      return pedido;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar pedido';
      setPedidosError(errorMessage);
      console.error('Erro ao criar pedido:', err);
      return null;
    } finally {
      setPedidosLoading(false);
    }
  }, [lojaUseCases]);

  const getUserPedidos = useCallback(async (): Promise<Pedido[]> => {
    try {
      setPedidosLoading(true);
      setPedidosError(null);
      const results = await lojaUseCases.getUserPedidos();
      setPedidos(results);
      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar pedidos';
      setPedidosError(errorMessage);
      console.error('Erro ao buscar pedidos:', err);
      return [];
    } finally {
      setPedidosLoading(false);
    }
  }, [lojaUseCases]);

  const getPedidoById = useCallback(async (id: string): Promise<Pedido | null> => {
    try {
      setPedidosLoading(true);
      setPedidosError(null);
      const pedido = await lojaUseCases.getPedidoById(id);
      return pedido;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar pedido';
      setPedidosError(errorMessage);
      console.error('Erro ao buscar pedido:', err);
      return null;
    } finally {
      setPedidosLoading(false);
    }
  }, [lojaUseCases]);

  const cancelPedido = useCallback(async (id: string): Promise<boolean> => {
    try {
      setPedidosLoading(true);
      setPedidosError(null);
      const pedido = await lojaUseCases.cancelPedido(id);
      setPedidos(prev => prev.map(p => p.id === id ? pedido : p));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao cancelar pedido';
      setPedidosError(errorMessage);
      console.error('Erro ao cancelar pedido:', err);
      return false;
    } finally {
      setPedidosLoading(false);
    }
  }, [lojaUseCases]);

  const updatePedidoStatus = useCallback(async (id: string, status: PedidoStatus): Promise<boolean> => {
    try {
      setPedidosLoading(true);
      setPedidosError(null);
      const pedido = await lojaUseCases.updatePedidoStatus(id, status);
      setPedidos(prev => prev.map(p => p.id === id ? pedido : p));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar status do pedido';
      setPedidosError(errorMessage);
      console.error('Erro ao atualizar status do pedido:', err);
      return false;
    } finally {
      setPedidosLoading(false);
    }
  }, [lojaUseCases]);

  useEffect(() => {
    if (autoLoadProdutos) {
      refreshProdutos();
    }
  }, [autoLoadProdutos, refreshProdutos]);

  useEffect(() => {
    if (autoLoadPedidos) {
      refreshPedidos();
    }
  }, [autoLoadPedidos, refreshPedidos]);

  return {
    // Produtos
    produtos,
    produtosLoading,
    produtosError,
    createProduto,
    updateProduto,
    deleteProduto,
    getProdutoById,
    searchProdutos,
    getProdutosByCategoria,
    updateProdutoStatus,
    updateProdutoStock,
    
    // Pedidos
    pedidos,
    pedidosLoading,
    pedidosError,
    createPedido,
    getUserPedidos,
    getPedidoById,
    cancelPedido,
    updatePedidoStatus,
    
    // Utils
    refreshProdutos,
    refreshPedidos,
    clearErrors
  };
}
