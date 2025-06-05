// Pedido Repository Implementation

import { Pedido } from '../../shared/types';
import { IPedidoRepository } from './interfaces';
import { IPedidoDataSource } from '../datasources/interfaces';

export class PedidoRepository implements IPedidoRepository {
  constructor(private dataSource: IPedidoDataSource) {}

  async getAll(): Promise<Pedido[]> {
    try {
      return await this.dataSource.getAll();
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      throw new Error('Falha ao buscar pedidos');
    }
  }

  async getById(id: string): Promise<Pedido | null> {
    if (!id?.trim()) {
      throw new Error('ID do pedido é obrigatório');
    }

    try {
      return await this.dataSource.getById(id);
    } catch (error) {
      console.error(`Erro ao buscar pedido ${id}:`, error);
      throw new Error('Falha ao buscar pedido');
    }
  }

  async getByUserEmail(email: string): Promise<Pedido[]> {
    if (!email?.trim()) {
      throw new Error('Email do usuário é obrigatório');
    }

    try {
      const pedidos = await this.dataSource.getAll();
      return pedidos
        .filter(pedido => pedido.emailUsuario === email)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      console.error(`Erro ao buscar pedidos do usuário ${email}:`, error);
      throw new Error('Falha ao buscar pedidos do usuário');
    }
  }

  async getPending(): Promise<Pedido[]> {
    try {
      const pedidos = await this.dataSource.getAll();
      return pedidos.filter(pedido => pedido.status === 'pendente');
    } catch (error) {
      console.error('Erro ao buscar pedidos pendentes:', error);
      throw new Error('Falha ao buscar pedidos pendentes');
    }
  }

  async create(pedido: Omit<Pedido, 'id' | 'createdAt' | 'updatedAt'>): Promise<Pedido> {
    this.validatePedidoData(pedido);

    try {
      const novoPedido = {
        ...pedido,
        id: '', // Será gerado pelo datasource
        status: 'pendente' as const,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      return await this.dataSource.create(novoPedido);
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      throw new Error('Falha ao criar pedido');
    }
  }

  async markAsPaid(id: string, paymentMethod: 'pix' | 'dinheiro'): Promise<Pedido> {
    if (!id?.trim()) {
      throw new Error('ID do pedido é obrigatório');
    }

    if (!paymentMethod || !['pix', 'dinheiro'].includes(paymentMethod)) {
      throw new Error('Método de pagamento deve ser "pix" ou "dinheiro"');
    }

    try {
      const pedido = await this.dataSource.getById(id);
      if (!pedido) {
        throw new Error('Pedido não encontrado');
      }

      if (pedido.status !== 'pendente') {
        throw new Error('Apenas pedidos pendentes podem ser marcados como pagos');
      }

      return await this.dataSource.update(id, {
        status: 'pago',
        metodoPagamento: paymentMethod,
        dataPagamento: new Date(),
        updatedAt: new Date()
      });
    } catch (error) {
      console.error(`Erro ao marcar pedido ${id} como pago:`, error);
      throw error;
    }
  }

  async cancel(id: string): Promise<Pedido> {
    if (!id?.trim()) {
      throw new Error('ID do pedido é obrigatório');
    }

    try {
      const pedido = await this.dataSource.getById(id);
      if (!pedido) {
        throw new Error('Pedido não encontrado');
      }

      if (pedido.status === 'cancelado') {
        throw new Error('Pedido já está cancelado');
      }

      if (pedido.status === 'pago') {
        throw new Error('Pedidos pagos não podem ser cancelados');
      }

      return await this.dataSource.update(id, {
        status: 'cancelado',
        updatedAt: new Date()
      });
    } catch (error) {
      console.error(`Erro ao cancelar pedido ${id}:`, error);
      throw error;
    }
  }

  private validatePedidoData(pedido: Omit<Pedido, 'id' | 'createdAt' | 'updatedAt'>): void {
    if (!pedido.emailUsuario?.trim()) {
      throw new Error('Email do usuário é obrigatório');
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(pedido.emailUsuario)) {
      throw new Error('Email inválido');
    }

    if (!pedido.itens || pedido.itens.length === 0) {
      throw new Error('Pedido deve conter pelo menos um item');
    }

    // Validar cada item do pedido
    for (const item of pedido.itens) {
      if (!item.produtoId?.trim()) {
        throw new Error('ID do produto é obrigatório para cada item');
      }

      if (!item.nome?.trim()) {
        throw new Error('Nome do produto é obrigatório para cada item');
      }

      if (item.quantidade <= 0) {
        throw new Error('Quantidade deve ser positiva para cada item');
      }

      if (item.preco < 0) {
        throw new Error('Preço não pode ser negativo para cada item');
      }
    }

    if (pedido.valorTotal === undefined || pedido.valorTotal < 0) {
      throw new Error('Valor total é obrigatório e deve ser positivo');
    }

    // Verificar se valor total está correto
    const valorCalculado = pedido.itens.reduce((total, item) => {
      return total + (item.preco * item.quantidade);
    }, 0);

    if (Math.abs(valorCalculado - pedido.valorTotal) > 0.01) {
      throw new Error('Valor total não confere com a soma dos itens');
    }
  }
}
