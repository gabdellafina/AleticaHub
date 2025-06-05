import { Request, Response } from 'express';
import { 
  InscricaoUseCases,
  AuthUseCases 
} from '../../../business/usecases';
import { ApiResponse } from '../../../shared/types';

export class InscricaoController {
  constructor(
    private inscricaoUseCases: InscricaoUseCases,
    private authUseCases: AuthUseCases
  ) {}

  async createInscricao(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Token de autenticação inválido'
        } as ApiResponse);
        return;
      }

      const { eventoId, dadosAdicionais } = req.body;

      if (!eventoId) {
        res.status(400).json({
          success: false,
          message: 'ID do evento é obrigatório'
        } as ApiResponse);
        return;
      }

      const inscricao = await this.inscricaoUseCases.createInscricao({
        usuarioId: userId,
        eventoId,
        dadosAdicionais
      });

      res.status(201).json({
        success: true,
        message: 'Inscrição realizada com sucesso',
        data: inscricao
      } as ApiResponse);
    } catch (error) {
      console.error('Erro ao criar inscrição:', error);
      if (error instanceof Error) {
        if (error.message.includes('já inscrito')) {
          res.status(409).json({
            success: false,
            message: error.message
          } as ApiResponse);
          return;
        }
        if (error.message.includes('não encontrado')) {
          res.status(404).json({
            success: false,
            message: error.message
          } as ApiResponse);
          return;
        }
        if (error.message.includes('encerradas') || error.message.includes('lotado')) {
          res.status(400).json({
            success: false,
            message: error.message
          } as ApiResponse);
          return;
        }
      }
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      } as ApiResponse);
    }
  }

  async getUserInscricoes(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Token de autenticação inválido'
        } as ApiResponse);
        return;
      }

      const status = req.query.status as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.inscricaoUseCases.getUserInscricoes(
        userId, 
        status, 
        page, 
        limit
      );

      res.status(200).json({
        success: true,
        message: 'Inscrições recuperadas com sucesso',
        data: result
      } as ApiResponse);
    } catch (error) {
      console.error('Erro ao buscar inscrições:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      } as ApiResponse);
    }
  }

  async getEventoInscricoes(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Token de autenticação inválido'
        } as ApiResponse);
        return;
      }

      const { eventoId } = req.params;
      if (!eventoId) {
        res.status(400).json({
          success: false,
          message: 'ID do evento é obrigatório'
        } as ApiResponse);
        return;
      }

      const status = req.query.status as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await this.inscricaoUseCases.getEventoInscricoes(
        eventoId,
        userId,
        status,
        page,
        limit
      );

      res.status(200).json({
        success: true,
        message: 'Inscrições do evento recuperadas com sucesso',
        data: result
      } as ApiResponse);
    } catch (error) {
      console.error('Erro ao buscar inscrições do evento:', error);
      if (error instanceof Error) {
        if (error.message.includes('não encontrado')) {
          res.status(404).json({
            success: false,
            message: error.message
          } as ApiResponse);
          return;
        }
        if (error.message.includes('permissão')) {
          res.status(403).json({
            success: false,
            message: error.message
          } as ApiResponse);
          return;
        }
      }
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      } as ApiResponse);
    }
  }

  async getInscricaoById(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Token de autenticação inválido'
        } as ApiResponse);
        return;
      }

      const { inscricaoId } = req.params;
      if (!inscricaoId) {
        res.status(400).json({
          success: false,
          message: 'ID da inscrição é obrigatório'
        } as ApiResponse);
        return;
      }

      const inscricao = await this.inscricaoUseCases.getInscricaoById(inscricaoId, userId);

      if (!inscricao) {
        res.status(404).json({
          success: false,
          message: 'Inscrição não encontrada'
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Inscrição recuperada com sucesso',
        data: inscricao
      } as ApiResponse);
    } catch (error) {
      console.error('Erro ao buscar inscrição:', error);
      if (error instanceof Error) {
        if (error.message.includes('permissão')) {
          res.status(403).json({
            success: false,
            message: error.message
          } as ApiResponse);
          return;
        }
      }
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      } as ApiResponse);
    }
  }

  async updateInscricao(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Token de autenticação inválido'
        } as ApiResponse);
        return;
      }

      const { inscricaoId } = req.params;
      const updates = req.body;

      if (!inscricaoId) {
        res.status(400).json({
          success: false,
          message: 'ID da inscrição é obrigatório'
        } as ApiResponse);
        return;
      }

      const inscricao = await this.inscricaoUseCases.updateInscricao(
        inscricaoId,
        updates,
        userId
      );

      res.status(200).json({
        success: true,
        message: 'Inscrição atualizada com sucesso',
        data: inscricao
      } as ApiResponse);
    } catch (error) {
      console.error('Erro ao atualizar inscrição:', error);
      if (error instanceof Error) {
        if (error.message.includes('não encontrada')) {
          res.status(404).json({
            success: false,
            message: error.message
          } as ApiResponse);
          return;
        }
        if (error.message.includes('permissão')) {
          res.status(403).json({
            success: false,
            message: error.message
          } as ApiResponse);
          return;
        }
      }
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      } as ApiResponse);
    }
  }

  async cancelInscricao(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Token de autenticação inválido'
        } as ApiResponse);
        return;
      }

      const { inscricaoId } = req.params;
      if (!inscricaoId) {
        res.status(400).json({
          success: false,
          message: 'ID da inscrição é obrigatório'
        } as ApiResponse);
        return;
      }

      const inscricao = await this.inscricaoUseCases.cancelInscricao(inscricaoId, userId);

      res.status(200).json({
        success: true,
        message: 'Inscrição cancelada com sucesso',
        data: inscricao
      } as ApiResponse);
    } catch (error) {
      console.error('Erro ao cancelar inscrição:', error);
      if (error instanceof Error) {
        if (error.message.includes('não encontrada')) {
          res.status(404).json({
            success: false,
            message: error.message
          } as ApiResponse);
          return;
        }
        if (error.message.includes('permissão')) {
          res.status(403).json({
            success: false,
            message: error.message
          } as ApiResponse);
          return;
        }
        if (error.message.includes('não pode ser cancelada')) {
          res.status(400).json({
            success: false,
            message: error.message
          } as ApiResponse);
          return;
        }
      }
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      } as ApiResponse);
    }
  }

  async approveInscricao(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Token de autenticação inválido'
        } as ApiResponse);
        return;
      }

      const { inscricaoId } = req.params;
      if (!inscricaoId) {
        res.status(400).json({
          success: false,
          message: 'ID da inscrição é obrigatório'
        } as ApiResponse);
        return;
      }

      const inscricao = await this.inscricaoUseCases.approveInscricao(inscricaoId, userId);

      res.status(200).json({
        success: true,
        message: 'Inscrição aprovada com sucesso',
        data: inscricao
      } as ApiResponse);
    } catch (error) {
      console.error('Erro ao aprovar inscrição:', error);
      if (error instanceof Error) {
        if (error.message.includes('não encontrada')) {
          res.status(404).json({
            success: false,
            message: error.message
          } as ApiResponse);
          return;
        }
        if (error.message.includes('permissão')) {
          res.status(403).json({
            success: false,
            message: error.message
          } as ApiResponse);
          return;
        }
      }
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      } as ApiResponse);
    }
  }

  async rejectInscricao(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Token de autenticação inválido'
        } as ApiResponse);
        return;
      }

      const { inscricaoId } = req.params;
      const { motivo } = req.body;

      if (!inscricaoId) {
        res.status(400).json({
          success: false,
          message: 'ID da inscrição é obrigatório'
        } as ApiResponse);
        return;
      }

      const inscricao = await this.inscricaoUseCases.rejectInscricao(
        inscricaoId,
        userId,
        motivo
      );

      res.status(200).json({
        success: true,
        message: 'Inscrição rejeitada com sucesso',
        data: inscricao
      } as ApiResponse);
    } catch (error) {
      console.error('Erro ao rejeitar inscrição:', error);
      if (error instanceof Error) {
        if (error.message.includes('não encontrada')) {
          res.status(404).json({
            success: false,
            message: error.message
          } as ApiResponse);
          return;
        }
        if (error.message.includes('permissão')) {
          res.status(403).json({
            success: false,
            message: error.message
          } as ApiResponse);
          return;
        }
      }
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      } as ApiResponse);
    }
  }

  async getInscricaoStats(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Token de autenticação inválido'
        } as ApiResponse);
        return;
      }

      const { eventoId } = req.params;
      if (!eventoId) {
        res.status(400).json({
          success: false,
          message: 'ID do evento é obrigatório'
        } as ApiResponse);
        return;
      }

      const stats = await this.inscricaoUseCases.getInscricaoStats(eventoId, userId);

      res.status(200).json({
        success: true,
        message: 'Estatísticas de inscrições recuperadas com sucesso',
        data: stats
      } as ApiResponse);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      if (error instanceof Error) {
        if (error.message.includes('não encontrado')) {
          res.status(404).json({
            success: false,
            message: error.message
          } as ApiResponse);
          return;
        }
        if (error.message.includes('permissão')) {
          res.status(403).json({
            success: false,
            message: error.message
          } as ApiResponse);
          return;
        }
      }
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      } as ApiResponse);
    }
  }

  async exportInscricoes(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Token de autenticação inválido'
        } as ApiResponse);
        return;
      }

      const { eventoId } = req.params;
      const format = req.query.format as string || 'csv';

      if (!eventoId) {
        res.status(400).json({
          success: false,
          message: 'ID do evento é obrigatório'
        } as ApiResponse);
        return;
      }

      const exportData = await this.inscricaoUseCases.exportInscricoes(
        eventoId,
        userId,
        format
      );

      // Set appropriate headers for file download
      const filename = `inscricoes_evento_${eventoId}.${format}`;
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', format === 'csv' ? 'text/csv' : 'application/json');

      res.status(200).send(exportData);
    } catch (error) {
      console.error('Erro ao exportar inscrições:', error);
      if (error instanceof Error) {
        if (error.message.includes('não encontrado')) {
          res.status(404).json({
            success: false,
            message: error.message
          } as ApiResponse);
          return;
        }
        if (error.message.includes('permissão')) {
          res.status(403).json({
            success: false,
            message: error.message
          } as ApiResponse);
          return;
        }
      }
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      } as ApiResponse);
    }
  }
}
