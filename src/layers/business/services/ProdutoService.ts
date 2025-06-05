// Produto Service - Business Logic Layer

import { Produto } from '../../shared/types';
import { IProdutoRepository } from '../../data/repositories/interfaces';

export class ProdutoService {
  constructor(private produtoRepository: IProdutoRepository) {}

  async getAllProdutos(): Promise<Produto[]> {
    try {
      return await this.produtoRepository.getAll();
    } catch (error) {
      console.error('Erro no serviço ao buscar produtos:', error);
      throw new Error('Falha ao buscar produtos');
    }
  }

  async getProdutoById(id: string): Promise<Produto | null> {
    if (!id?.trim()) {
      throw new Error('ID do produto é obrigatório');
    }

    try {
      return await this.produtoRepository.getById(id);
    } catch (error) {
      console.error(`Erro no serviço ao buscar produto ${id}:`, error);
      throw new Error('Falha ao buscar produto');
    }
  }

  async getAvailableProdutos(): Promise<Produto[]> {
    try {
      return await this.produtoRepository.getAvailable();
    } catch (error) {
      console.error('Erro no serviço ao buscar produtos disponíveis:', error);
      throw new Error('Falha ao buscar produtos disponíveis');
    }
  }

  async createProduto(produto: Omit<Produto, 'id' | 'createdAt' | 'updatedAt'>): Promise<Produto> {
    this.validateBusinessRules(produto);

    try {
      return await this.produtoRepository.create(produto);
    } catch (error) {
      console.error('Erro no serviço ao criar produto:', error);
      throw error;
    }
  }

  async updateProduto(id: string, data: Partial<Produto>): Promise<Produto> {
    if (!id?.trim()) {
      throw new Error('ID do produto é obrigatório');
    }

    if (data.preco !== undefined) {
      this.validatePrice(data.preco);
    }

    try {
      return await this.produtoRepository.update(id, data);
    } catch (error) {
      console.error(`Erro no serviço ao atualizar produto ${id}:`, error);
      throw error;
    }
  }

  async deleteProduto(id: string): Promise<void> {
    if (!id?.trim()) {
      throw new Error('ID do produto é obrigatório');
    }

    try {
      const produto = await this.produtoRepository.getById(id);
      if (!produto) {
        throw new Error('Produto não encontrado');
      }

      // Verificar se produto pode ser deletado (não possui pedidos em andamento)
      // Esta verificação seria feita com dados reais
      await this.produtoRepository.delete(id);
    } catch (error) {
      console.error(`Erro no serviço ao deletar produto ${id}:`, error);
      throw error;
    }
  }

  async processOrder(items: Array<{ produtoId: string; quantidade: number }>): Promise<{ success: boolean; unavailableItems: string[] }> {
    const unavailableItems: string[] = [];

    try {
      // Verificar disponibilidade de todos os itens
      for (const item of items) {
        const produto = await this.produtoRepository.getById(item.produtoId);
        if (!produto) {
          unavailableItems.push(`Produto ${item.produtoId} não encontrado`);
          continue;
        }

        if (produto.quantidade < item.quantidade) {
          unavailableItems.push(`${produto.nome} - estoque insuficiente (disponível: ${produto.quantidade})`);
        }
      }

      if (unavailableItems.length > 0) {
        return { success: false, unavailableItems };
      }

      // Reduzir estoque de todos os itens
      for (const item of items) {
        await this.produtoRepository.decreaseStock(item.produtoId, item.quantidade);
      }

      return { success: true, unavailableItems: [] };
    } catch (error) {
      console.error('Erro ao processar pedido:', error);
      throw new Error('Falha ao processar pedido');
    }
  }

  async cancelOrder(items: Array<{ produtoId: string; quantidade: number }>): Promise<void> {
    try {
      // Restaurar estoque de todos os itens
      for (const item of items) {
        await this.produtoRepository.increaseStock(item.produtoId, item.quantidade);
      }
    } catch (error) {
      console.error('Erro ao cancelar pedido:', error);
      throw new Error('Falha ao cancelar pedido');
    }
  }

  async updateStock(id: string, quantidade: number, operation: 'increase' | 'decrease'): Promise<Produto> {
    if (!id?.trim()) {
      throw new Error('ID do produto é obrigatório');
    }

    if (quantidade <= 0) {
      throw new Error('Quantidade deve ser positiva');
    }

    try {
      if (operation === 'increase') {
        return await this.produtoRepository.increaseStock(id, quantidade);
      } else {
        return await this.produtoRepository.decreaseStock(id, quantidade);
      }
    } catch (error) {
      console.error(`Erro ao ${operation === 'increase' ? 'aumentar' : 'diminuir'} estoque:`, error);
      throw error;
    }
  }

  async getProdutosByCategory(categoria: string): Promise<Produto[]> {
    if (!categoria?.trim()) {
      throw new Error('Categoria é obrigatória');
    }

    try {
      const produtos = await this.produtoRepository.getAll();
      return produtos.filter(produto => 
        produto.categoria.toLowerCase() === categoria.toLowerCase()
      );
    } catch (error) {
      console.error(`Erro ao buscar produtos da categoria ${categoria}:`, error);
      throw new Error('Falha ao buscar produtos por categoria');
    }
  }

  async searchProdutos(query: string): Promise<Produto[]> {
    if (!query?.trim()) {
      return [];
    }

    try {
      const produtos = await this.produtoRepository.getAll();
      const searchTerm = query.toLowerCase();
      
      return produtos.filter(produto =>
        produto.nome.toLowerCase().includes(searchTerm) ||
        produto.descricao.toLowerCase().includes(searchTerm) ||
        produto.categoria.toLowerCase().includes(searchTerm)
      );
    } catch (error) {
      console.error(`Erro ao pesquisar produtos com termo "${query}":`, error);
      throw new Error('Falha ao pesquisar produtos');
    }
  }

  async getLowStockProdutos(threshold: number = 10): Promise<Produto[]> {
    try {
      const produtos = await this.produtoRepository.getAll();
      return produtos.filter(produto => produto.quantidade <= threshold);
    } catch (error) {
      console.error('Erro ao buscar produtos com estoque baixo:', error);
      throw new Error('Falha ao buscar produtos com estoque baixo');
    }
  }

  private validateBusinessRules(produto: Omit<Produto, 'id' | 'createdAt' | 'updatedAt'>): void {
    this.validatePrice(produto.preco);

    // Validar categoria
    const categoriasPermitidas = ['uniforme', 'equipamento', 'acessorio', 'suplemento', 'outro'];
    if (!categoriasPermitidas.includes(produto.categoria.toLowerCase())) {
      throw new Error(`Categoria deve ser uma das seguintes: ${categoriasPermitidas.join(', ')}`);
    }

    // Validar estoque inicial
    if (produto.quantidade > 10000) {
      throw new Error('Estoque inicial não pode exceder 10.000 unidades');
    }
  }

  private validatePrice(preco: number): void {
    if (preco > 50000) {
      throw new Error('Preço do produto não pode exceder R$ 50.000');
    }

    if (preco < 0.01) {
      throw new Error('Preço mínimo é R$ 0,01');
    }
  }
}
