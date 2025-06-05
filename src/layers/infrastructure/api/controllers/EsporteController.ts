// Esporte Controller - Infrastructure Layer

import { Request, Response } from 'express';
import { EsporteUseCases } from '../../../business/usecases/EsporteUseCases';

export class EsporteController {
  constructor(private esporteUseCases: EsporteUseCases) {}

  async getAllEsportes(req: Request, res: Response): Promise<void> {
    try {
      const esportes = await this.esporteUseCases.viewAllEsportes();
      res.json({
        success: true,
        data: esportes
      });
    } catch (error) {
      console.error('Erro ao buscar esportes:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  async getActiveEsportes(req: Request, res: Response): Promise<void> {
    try {
      const esportes = await this.esporteUseCases.viewActiveEsportes();
      res.json({
        success: true,
        data: esportes
      });
    } catch (error) {
      console.error('Erro ao buscar esportes ativos:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  async getEsporteById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const esporte = await this.esporteUseCases.viewEsporte(id);
      
      if (!esporte) {
        res.status(404).json({
          success: false,
          message: 'Esporte não encontrado'
        });
        return;
      }

      res.json({
        success: true,
        data: esporte
      });
    } catch (error) {
      console.error('Erro ao buscar esporte:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  async searchEsportes(req: Request, res: Response): Promise<void> {
    try {
      const { q } = req.query;
      
      if (!q || typeof q !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Parâmetro de busca é obrigatório'
        });
        return;
      }

      const esportes = await this.esporteUseCases.searchEsportes(q);
      res.json({
        success: true,
        data: esportes
      });
    } catch (error) {
      console.error('Erro ao pesquisar esportes:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  async getEsportesBySchedule(req: Request, res: Response): Promise<void> {
    try {
      const { dias } = req.query;
      
      if (!dias) {
        res.status(400).json({
          success: false,
          message: 'Dias da semana são obrigatórios'
        });
        return;
      }

      const diasArray = Array.isArray(dias) ? dias as string[] : [dias as string];
      const esportes = await this.esporteUseCases.findEsportesBySchedule(diasArray);
      
      res.json({
        success: true,
        data: esportes
      });
    } catch (error) {
      console.error('Erro ao buscar esportes por horário:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  async getWeeklySchedule(req: Request, res: Response): Promise<void> {
    try {
      const schedule = await this.esporteUseCases.getWeeklySchedule();
      res.json({
        success: true,
        data: schedule
      });
    } catch (error) {
      console.error('Erro ao buscar agenda semanal:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  async getDashboard(req: Request, res: Response): Promise<void> {
    try {
      const dashboard = await this.esporteUseCases.getEsporteDashboard();
      res.json({
        success: true,
        data: dashboard
      });
    } catch (error) {
      console.error('Erro ao buscar dashboard de esportes:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Métodos administrativos
  async createEsporte(req: Request, res: Response): Promise<void> {
    try {
      const esporteData = req.body;
      const esporte = await this.esporteUseCases.createEsporte(esporteData);
      
      res.status(201).json({
        success: true,
        message: 'Esporte criado com sucesso',
        data: esporte
      });
    } catch (error) {
      console.error('Erro ao criar esporte:', error);
      
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

  async updateEsporte(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const esporte = await this.esporteUseCases.updateEsporte(id, updateData);
      
      res.json({
        success: true,
        message: 'Esporte atualizado com sucesso',
        data: esporte
      });
    } catch (error) {
      console.error('Erro ao atualizar esporte:', error);
      
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

  async deleteEsporte(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.esporteUseCases.deleteEsporte(id);
      
      res.json({
        success: true,
        message: 'Esporte deletado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar esporte:', error);
      
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

  async activateEsporte(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const esporte = await this.esporteUseCases.activateEsporte(id);
      
      res.json({
        success: true,
        message: 'Esporte ativado com sucesso',
        data: esporte
      });
    } catch (error) {
      console.error('Erro ao ativar esporte:', error);
      
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

  async deactivateEsporte(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const esporte = await this.esporteUseCases.deactivateEsporte(id);
      
      res.json({
        success: true,
        message: 'Esporte desativado com sucesso',
        data: esporte
      });
    } catch (error) {
      console.error('Erro ao desativar esporte:', error);
      
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
}
