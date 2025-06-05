// Loja Controller - Infrastructure Layer (Products + Orders)

import { Request, Response } from 'express';
import { LojaUseCases } from '../../../business/usecases/LojaUseCases';

export class LojaController {
  constructor(private lojaUseCases: LojaUseCases) {}

  // Endpoints de produtos
  async getCatalog(req: Request, res: Response): Promise<void> {
    try {
      const produtos = await this.lojaUseCases.viewCatalog();
      res.json({
        success: true,
        data: produtos
      });
    } catch (error) {
      console.error('Erro ao buscar catálogo:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const produto = await this.lojaUseCases.viewProduct(id);
      
      if (!produto) {
        res.status(404).json({
          success: false,
          message: 'Produto não encontrado'
        });
        return;
      }

      res.json({
        success: true,
        data: produto
      });
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  async searchProducts(req: Request, res: Response): Promise<void> {
    try {
      const { q } = req.query;
      
      if (!q || typeof q !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Parâmetro de busca é obrigatório'
        });
        return;
      }

      const produtos = await this.lojaUseCases.searchProducts(q);
      res.json({
        success: true,
        data: produtos
      });
    } catch (error) {
      console.error('Erro ao pesquisar produtos:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  async getProductsByCategory(req: Request, res: Response): Promise<void> {
    try {
      const { categoria } = req.params;
      const produtos = await this.lojaUseCases.getProductsByCategory(categoria);
      
      res.json({
        success: true,
        data: produtos
      });
    } catch (error) {
      console.error('Erro ao buscar produtos por categoria:', error);
      
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Erro interno do servidor'
        });
      }
    }
  }

  // Endpoints de carrinho e pedidos
  async calculateCart(req: Request, res: Response): Promise<void> {
    try {
      const { items } = req.body;
      
      if (!items || !Array.isArray(items)) {
        res.status(400).json({
          success: false,
          message: 'Lista de itens é obrigatória'
        });
        return;
      }

      const cartCalculation = await this.lojaUseCases.calculateCart(items);
      res.json({
        success: true,
        data: cartCalculation
      });
    } catch (error) {
      console.error('Erro ao calcular carrinho:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const { userEmail, items } = req.body;
      
      if (!userEmail || !items || !Array.isArray(items)) {
        res.status(400).json({
          success: false,
          message: 'Email do usuário e lista de itens são obrigatórios'
        });
        return;
      }

      const pedido = await this.lojaUseCases.createOrder(userEmail, items);
      
      res.status(201).json({
        success: true,
        message: 'Pedido criado com sucesso',
        data: pedido
      });
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Erro interno do servidor'
        });
      }
    }
  }

  async getUserOrders(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.params;
      const pedidos = await this.lojaUseCases.getUserOrders(email);
      
      res.json({
        success: true,
        data: pedidos
      });
    } catch (error) {
      console.error('Erro ao buscar pedidos do usuário:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  async cancelOrder(req: Request, res: Response): Promise<void> {
    try {
      const { orderId } = req.params;
      const { userId } = req.body;
      
      if (!userId) {
        res.status(400).json({
          success: false,
          message: 'ID do usuário é obrigatório'
        });
        return;
      }

      const pedido = await this.lojaUseCases.cancelOrder(orderId, userId);
      
      res.json({
        success: true,
        message: 'Pedido cancelado com sucesso',
        data: pedido
      });
    } catch (error) {
      console.error('Erro ao cancelar pedido:', error);
      
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Erro interno do servidor'
        });
      }
    }
  }

  // Endpoints administrativos
  async manageInventory(req: Request, res: Response): Promise<void> {
    try {
      const inventory = await this.lojaUseCases.manageInventory();
      res.json({
        success: true,
        data: inventory
      });
    } catch (error) {
      console.error('Erro ao gerenciar estoque:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const productData = req.body;
      const produto = await this.lojaUseCases.createProduct(productData);
      
      res.status(201).json({
        success: true,
        message: 'Produto criado com sucesso',
        data: produto
      });
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Erro interno do servidor'
        });
      }
    }
  }

  async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const produto = await this.lojaUseCases.updateProduct(id, updateData);
      
      res.json({
        success: true,
        message: 'Produto atualizado com sucesso',
        data: produto
      });
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Erro interno do servidor'
        });
      }
    }
  }

  async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.lojaUseCases.deleteProduct(id);
      
      res.json({
        success: true,
        message: 'Produto deletado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Erro interno do servidor'
        });
      }
    }
  }

  async updateStock(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { quantidade, operation } = req.body;
      
      if (!quantidade || !operation || !['increase', 'decrease'].includes(operation)) {
        res.status(400).json({
          success: false,
          message: 'Quantidade e operação (increase/decrease) são obrigatórios'
        });
        return;
      }

      const produto = await this.lojaUseCases.updateStock(id, quantidade, operation);
      
      res.json({
        success: true,
        message: 'Estoque atualizado com sucesso',
        data: produto
      });
    } catch (error) {
      console.error('Erro ao atualizar estoque:', error);
      
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Erro interno do servidor'
        });
      }
    }
  }

  async processPayment(req: Request, res: Response): Promise<void> {
    try {
      const { orderId } = req.params;
      const { paymentMethod, adminId } = req.body;
      
      if (!paymentMethod || !adminId || !['pix', 'dinheiro'].includes(paymentMethod)) {
        res.status(400).json({
          success: false,
          message: 'Método de pagamento (pix/dinheiro) e ID do admin são obrigatórios'
        });
        return;
      }

      const pedido = await this.lojaUseCases.processPayment(orderId, paymentMethod, adminId);
      
      res.json({
        success: true,
        message: 'Pagamento processado com sucesso',
        data: pedido
      });
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Erro interno do servidor'
        });
      }
    }
  }

  async getPendingOrders(req: Request, res: Response): Promise<void> {
    try {
      const pedidos = await this.lojaUseCases.getPendingOrders();
      res.json({
        success: true,
        data: pedidos
      });
    } catch (error) {
      console.error('Erro ao buscar pedidos pendentes:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  async getSalesStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await this.lojaUseCases.getSalesStats();
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas de vendas:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
}
