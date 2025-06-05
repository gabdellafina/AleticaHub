// Produto Repository Implementation

import { Produto } from '../../shared/types';
import { IProdutoRepository } from './interfaces';
import { IProdutoDataSource } from '../datasources/interfaces';

export class ProdutoRepository implements IProdutoRepository {
  constructor(private dataSource: IProdutoDataSource) {}

  async getAll(): Promise<Produto[]> {
    try {
      return await this.dataSource.getAll();
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw new Error('Falha ao buscar produtos');
    }
  }

  async getById(id: string): Promise<Produto | null> {
    if (!id?.trim()) {
      throw new Error('ID do produto é obrigatório');
    }

    try {
      return await this.dataSource.getById(id);
    } catch (error) {
      console.error(`Erro ao buscar produto ${id}:`, error);
      throw new Error('Falha ao buscar produto');
    }
  }

  async getAvailable(): Promise<Produto[]> {
    try {
      const produtos = await this.dataSource.getAll();
      return produtos.filter(produto => produto.quantidade > 0);
    } catch (error) {
      console.error('Erro ao buscar produtos disponíveis:', error);
      throw new Error('Falha ao buscar produtos disponíveis');
    }
  }

  async create(produto: Omit<Produto, 'id' | 'createdAt' | 'updatedAt'>): Promise<Produto> {
    this.validateProdutoData(produto);

    try {
      const novoProduto = {
        ...produto,
        id: '', // Será gerado pelo datasource
        createdAt: new Date(),
        updatedAt: new Date()
      };

      return await this.dataSource.create(novoProduto);
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      throw new Error('Falha ao criar produto');
    }
  }

  async update(id: string, data: Partial<Produto>): Promise<Produto> {
    if (!id?.trim()) {
      throw new Error('ID do produto é obrigatório');
    }

    if (data.nome && !data.nome.trim()) {
      throw new Error('Nome do produto é obrigatório');
    }

    if (data.preco !== undefined && data.preco < 0) {
      throw new Error('Preço não pode ser negativo');
    }

    if (data.quantidade !== undefined && data.quantidade < 0) {
      throw new Error('Quantidade não pode ser negativa');
    }

    try {
      const produtoAtualizado = {
        ...data,
        updatedAt: new Date()
      };

      return await this.dataSource.update(id, produtoAtualizado);
    } catch (error) {
      console.error(`Erro ao atualizar produto ${id}:`, error);
      throw new Error('Falha ao atualizar produto');
    }
  }

  async delete(id: string): Promise<void> {
    if (!id?.trim()) {
      throw new Error('ID do produto é obrigatório');
    }

    try {
      await this.dataSource.delete(id);
    } catch (error) {
      console.error(`Erro ao deletar produto ${id}:`, error);
      throw new Error('Falha ao deletar produto');
    }
  }

  async decreaseStock(id: string, quantity: number): Promise<Produto> {
    if (!id?.trim()) {
      throw new Error('ID do produto é obrigatório');
    }

    if (quantity <= 0) {
      throw new Error('Quantidade deve ser positiva');
    }

    try {
      const produto = await this.dataSource.getById(id);
      if (!produto) {
        throw new Error('Produto não encontrado');
      }

      if (produto.quantidade < quantity) {
        throw new Error('Estoque insuficiente');
      }

      const novaQuantidade = produto.quantidade - quantity;
      return await this.dataSource.update(id, { 
        quantidade: novaQuantidade,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error(`Erro ao diminuir estoque do produto ${id}:`, error);
      throw error;
    }
  }

  async increaseStock(id: string, quantity: number): Promise<Produto> {
    if (!id?.trim()) {
      throw new Error('ID do produto é obrigatório');
    }

    if (quantity <= 0) {
      throw new Error('Quantidade deve ser positiva');
    }

    try {
      const produto = await this.dataSource.getById(id);
      if (!produto) {
        throw new Error('Produto não encontrado');
      }

      const novaQuantidade = produto.quantidade + quantity;
      return await this.dataSource.update(id, { 
        quantidade: novaQuantidade,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error(`Erro ao aumentar estoque do produto ${id}:`, error);
      throw new Error('Falha ao aumentar estoque');
    }
  }

  private validateProdutoData(produto: Omit<Produto, 'id' | 'createdAt' | 'updatedAt'>): void {
    if (!produto.nome?.trim()) {
      throw new Error('Nome do produto é obrigatório');
    }

    if (!produto.descricao?.trim()) {
      throw new Error('Descrição do produto é obrigatória');
    }

    if (produto.preco === undefined || produto.preco < 0) {
      throw new Error('Preço é obrigatório e deve ser positivo');
    }

    if (produto.quantidade === undefined || produto.quantidade < 0) {
      throw new Error('Quantidade é obrigatória e deve ser positiva');
    }

    if (!produto.categoria?.trim()) {
      throw new Error('Categoria do produto é obrigatória');
    }
  }
}
