// Loja Use Cases - Business Logic Layer (Produtos + Pedidos)

import { Produto, Pedido } from '../../shared/types';
import { ProdutoService } from '../services/ProdutoService';
import { PedidoService } from '../services/PedidoService';

export class LojaUseCases {
  constructor(
    private produtoService: ProdutoService,
    private pedidoService: PedidoService
  ) {}

  // Casos de uso para visualização de produtos
  async viewCatalog(): Promise<Produto[]> {
    return await this.produtoService.getAvailableProdutos();
  }

  async viewProduct(id: string): Promise<Produto | null> {
    return await this.produtoService.getProdutoById(id);
  }

  async searchProducts(query: string): Promise<Produto[]> {
    return await this.produtoService.searchProdutos(query);
  }

  async getProductsByCategory(categoria: string): Promise<Produto[]> {
    return await this.produtoService.getProdutosByCategory(categoria);
  }

  // Casos de uso para carrinho e pedidos
  async calculateCart(items: Array<{ produtoId: string; quantidade: number }>): Promise<{
    total: number;
    items: Array<{ produto: Produto; quantidade: number; subtotal: number }>;
    errors: string[];
  }> {
    const errors: string[] = [];
    const cartItems: Array<{ produto: Produto; quantidade: number; subtotal: number }> = [];
    let total = 0;

    for (const item of items) {
      try {
        const produto = await this.produtoService.getProdutoById(item.produtoId);
        if (!produto) {
          errors.push(`Produto ${item.produtoId} não encontrado`);
          continue;
        }

        if (produto.quantidade < item.quantidade) {
          errors.push(`${produto.nome} - estoque insuficiente (disponível: ${produto.quantidade})`);
          continue;
        }

        const subtotal = produto.preco * item.quantidade;
        cartItems.push({ produto, quantidade: item.quantidade, subtotal });
        total += subtotal;
      } catch (error) {
        errors.push(`Erro ao processar produto ${item.produtoId}`);
      }
    }

    return { total, items: cartItems, errors };
  }

  async createOrder(userEmail: string, items: Array<{ produtoId: string; quantidade: number }>): Promise<Pedido> {
    // Calcular total e validar disponibilidade
    const { total, items: cartItems, errors } = await this.calculateCart(items);
    
    if (errors.length > 0) {
      throw new Error(`Erro no carrinho: ${errors.join(', ')}`);
    }

    // Criar pedido
    const pedidoData = {
      emailUsuario: userEmail,
      itens: cartItems.map(item => ({
        produtoId: item.produto.id,
        nome: item.produto.nome,
        preco: item.produto.preco,
        quantidade: item.quantidade
      })),
      valorTotal: total,
      status: 'pendente' as const
    };

    return await this.pedidoService.createPedido(pedidoData);
  }

  async getUserOrders(email: string): Promise<Pedido[]> {
    return await this.pedidoService.getPedidosByUser(email);
  }

  async cancelOrder(orderId: string, userId: string): Promise<Pedido> {
    return await this.pedidoService.cancelPedido(orderId, userId);
  }

  // Casos de uso administrativos
  async manageInventory(): Promise<{
    lowStock: Produto[];
    outOfStock: Produto[];
    totalProducts: number;
  }> {
    const [allProducts, lowStock] = await Promise.all([
      this.produtoService.getAllProdutos(),
      this.produtoService.getLowStockProdutos()
    ]);

    const outOfStock = allProducts.filter(p => p.quantidade === 0);

    return {
      lowStock,
      outOfStock,
      totalProducts: allProducts.length
    };
  }

  async createProduct(produto: Omit<Produto, 'id' | 'createdAt' | 'updatedAt'>): Promise<Produto> {
    return await this.produtoService.createProduto(produto);
  }

  async updateProduct(id: string, data: Partial<Produto>): Promise<Produto> {
    return await this.produtoService.updateProduto(id, data);
  }

  async deleteProduct(id: string): Promise<void> {
    return await this.produtoService.deleteProduto(id);
  }

  async updateStock(id: string, quantidade: number, operation: 'increase' | 'decrease'): Promise<Produto> {
    return await this.produtoService.updateStock(id, quantidade, operation);
  }

  async processPayment(orderId: string, paymentMethod: 'pix' | 'dinheiro', adminId: string): Promise<Pedido> {
    return await this.pedidoService.markAsPaid(orderId, paymentMethod, adminId);
  }

  async getPendingOrders(): Promise<Pedido[]> {
    return await this.pedidoService.getPendingPedidos();
  }

  async getSalesStats(): Promise<{
    orders: {
      total: number;
      pendentes: number;
      pagos: number;
      cancelados: number;
      valorTotal: number;
    };
    topProducts: Array<{ produtoId: string; nome: string; quantidade: number }>;
  }> {
    const [orderStats, topProducts] = await Promise.all([
      this.pedidoService.getPedidoStats(),
      this.pedidoService.getTopProducts(5)
    ]);

    return {
      orders: orderStats,
      topProducts
    };
  }
}
