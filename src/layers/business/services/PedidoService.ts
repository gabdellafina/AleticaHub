// Pedido Service - Business Logic Layer

import { Pedido } from '../../shared/types';
import { IPedidoRepository, IProdutoRepository, IUserRepository } from '../../data/repositories/interfaces';

export class PedidoService {
  constructor(
    private pedidoRepository: IPedidoRepository,
    private produtoRepository: IProdutoRepository,
    private userRepository: IUserRepository
  ) {}

  async getAllPedidos(): Promise<Pedido[]> {
    try {
      return await this.pedidoRepository.getAll();
    } catch (error) {
      console.error('Erro no serviço ao buscar pedidos:', error);
      throw new Error('Falha ao buscar pedidos');
    }
  }

  async getPedidoById(id: string): Promise<Pedido | null> {
    if (!id?.trim()) {
      throw new Error('ID do pedido é obrigatório');
    }

    try {
      return await this.pedidoRepository.getById(id);
    } catch (error) {
      console.error(`Erro no serviço ao buscar pedido ${id}:`, error);
      throw new Error('Falha ao buscar pedido');
    }
  }

  async getPedidosByUser(email: string): Promise<Pedido[]> {
    if (!email?.trim()) {
      throw new Error('Email do usuário é obrigatório');
    }

    try {
      return await this.pedidoRepository.getByUserEmail(email);
    } catch (error) {
      console.error(`Erro no serviço ao buscar pedidos do usuário ${email}:`, error);
      throw new Error('Falha ao buscar pedidos do usuário');
    }
  }

  async getPendingPedidos(): Promise<Pedido[]> {
    try {
      return await this.pedidoRepository.getPending();
    } catch (error) {
      console.error('Erro no serviço ao buscar pedidos pendentes:', error);
      throw new Error('Falha ao buscar pedidos pendentes');
    }
  }

  async createPedido(pedido: Omit<Pedido, 'id' | 'createdAt' | 'updatedAt'>): Promise<Pedido> {
    await this.validateBusinessRules(pedido);

    try {
      // Verificar disponibilidade dos produtos
      await this.validateProductAvailability(pedido.itens);

      // Reservar produtos (diminuir estoque)
      await this.reserveProducts(pedido.itens);

      try {
        const novoPedido = await this.pedidoRepository.create(pedido);
        return novoPedido;
      } catch (error) {
        // Se falhar ao criar pedido, restaurar estoque
        await this.releaseProducts(pedido.itens);
        throw error;
      }
    } catch (error) {
      console.error('Erro no serviço ao criar pedido:', error);
      throw error;
    }
  }

  async markAsPaid(id: string, paymentMethod: 'pix' | 'dinheiro', adminId: string): Promise<Pedido> {
    if (!id?.trim()) {
      throw new Error('ID do pedido é obrigatório');
    }

    if (!paymentMethod || !['pix', 'dinheiro'].includes(paymentMethod)) {
      throw new Error('Método de pagamento deve ser "pix" ou "dinheiro"');
    }

    if (!adminId?.trim()) {
      throw new Error('ID do administrador é obrigatório');
    }

    try {
      // Verificar se usuário é admin
      const admin = await this.userRepository.getById(adminId);
      if (!admin || admin.role !== 'admin') {
        throw new Error('Apenas administradores podem marcar pedidos como pagos');
      }

      return await this.pedidoRepository.markAsPaid(id, paymentMethod);
    } catch (error) {
      console.error(`Erro no serviço ao marcar pedido ${id} como pago:`, error);
      throw error;
    }
  }

  async cancelPedido(id: string, userId: string): Promise<Pedido> {
    if (!id?.trim()) {
      throw new Error('ID do pedido é obrigatório');
    }

    if (!userId?.trim()) {
      throw new Error('ID do usuário é obrigatório');
    }

    try {
      const pedido = await this.pedidoRepository.getById(id);
      if (!pedido) {
        throw new Error('Pedido não encontrado');
      }

      // Verificar permissões
      const user = await this.userRepository.getById(userId);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      if (pedido.emailUsuario !== user.email && user.role !== 'admin') {
        throw new Error('Usuário não tem permissão para cancelar este pedido');
      }

      // Restaurar estoque dos produtos
      await this.releaseProducts(pedido.itens);

      return await this.pedidoRepository.cancel(id);
    } catch (error) {
      console.error(`Erro no serviço ao cancelar pedido ${id}:`, error);
      throw error;
    }
  }

  async calculateTotal(items: Array<{ produtoId: string; quantidade: number }>): Promise<number> {
    if (!items || items.length === 0) {
      throw new Error('Lista de itens é obrigatória');
    }

    try {
      let total = 0;

      for (const item of items) {
        const produto = await this.produtoRepository.getById(item.produtoId);
        if (!produto) {
          throw new Error(`Produto ${item.produtoId} não encontrado`);
        }

        if (produto.quantidade < item.quantidade) {
          throw new Error(`Estoque insuficiente para ${produto.nome}`);
        }

        total += produto.preco * item.quantidade;
      }

      return total;
    } catch (error) {
      console.error('Erro ao calcular total do pedido:', error);
      throw error;
    }
  }

  async getPedidoStats(): Promise<{
    total: number;
    pendentes: number;
    pagos: number;
    cancelados: number;
    valorTotal: number;
  }> {
    try {
      const pedidos = await this.pedidoRepository.getAll();
      
      return {
        total: pedidos.length,
        pendentes: pedidos.filter(p => p.status === 'pendente').length,
        pagos: pedidos.filter(p => p.status === 'pago').length,
        cancelados: pedidos.filter(p => p.status === 'cancelado').length,
        valorTotal: pedidos
          .filter(p => p.status === 'pago')
          .reduce((sum, p) => sum + p.valorTotal, 0),
      };
    } catch (error) {
      console.error('Erro ao obter estatísticas de pedidos:', error);
      throw new Error('Falha ao obter estatísticas');
    }
  }

  async getTopProducts(limit: number = 10): Promise<Array<{ produtoId: string; nome: string; quantidade: number }>> {
    try {
      const pedidos = await this.pedidoRepository.getAll();
      const pedidosPagos = pedidos.filter(p => p.status === 'pago');
      
      const produtoCount: Record<string, { nome: string; quantidade: number }> = {};
      
      for (const pedido of pedidosPagos) {
        for (const item of pedido.itens) {
          if (produtoCount[item.produtoId]) {
            produtoCount[item.produtoId].quantidade += item.quantidade;
          } else {
            produtoCount[item.produtoId] = {
              nome: item.nome,
              quantidade: item.quantidade
            };
          }
        }
      }

      return Object.entries(produtoCount)
        .map(([produtoId, data]) => ({
          produtoId,
          nome: data.nome,
          quantidade: data.quantidade
        }))
        .sort((a, b) => b.quantidade - a.quantidade)
        .slice(0, limit);
    } catch (error) {
      console.error('Erro ao obter produtos mais vendidos:', error);
      throw new Error('Falha ao obter produtos mais vendidos');
    }
  }

  private async validateBusinessRules(pedido: Omit<Pedido, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    // Verificar se usuário existe
    const usuarios = await this.userRepository.getAll();
    const usuario = usuarios.find(u => u.email === pedido.emailUsuario);
    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    if (usuario.status !== 'ativo') {
      throw new Error('Usuário deve estar ativo para fazer pedidos');
    }

    // Validar itens do pedido
    if (!pedido.itens || pedido.itens.length === 0) {
      throw new Error('Pedido deve conter pelo menos um item');
    }

    if (pedido.itens.length > 50) {
      throw new Error('Pedido não pode conter mais de 50 itens diferentes');
    }

    // Validar valor total máximo
    if (pedido.valorTotal > 100000) {
      throw new Error('Valor do pedido não pode exceder R$ 100.000');
    }
  }

  private async validateProductAvailability(items: Array<{ produtoId: string; quantidade: number; nome: string; preco: number }>): Promise<void> {
    for (const item of items) {
      const produto = await this.produtoRepository.getById(item.produtoId);
      if (!produto) {
        throw new Error(`Produto ${item.nome} não encontrado`);
      }

      if (produto.quantidade < item.quantidade) {
        throw new Error(`Estoque insuficiente para ${produto.nome}. Disponível: ${produto.quantidade}, Solicitado: ${item.quantidade}`);
      }
    }
  }

  private async reserveProducts(items: Array<{ produtoId: string; quantidade: number }>): Promise<void> {
    for (const item of items) {
      await this.produtoRepository.decreaseStock(item.produtoId, item.quantidade);
    }
  }

  private async releaseProducts(items: Array<{ produtoId: string; quantidade: number }>): Promise<void> {
    for (const item of items) {
      await this.produtoRepository.increaseStock(item.produtoId, item.quantidade);
    }
  }
}
