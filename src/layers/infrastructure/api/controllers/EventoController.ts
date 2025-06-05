// Evento Controller - Infrastructure Layer

import { Request, Response } from 'express';
import { EventoUseCases } from '../../../business/usecases/EventoUseCases';

export class EventoController {
  constructor(private eventoUseCases: EventoUseCases) {}

  async getAllEventos(req: Request, res: Response): Promise<void> {
    try {
      const eventos = await this.eventoUseCases.viewAllEventos();
      res.json({
        success: true,
        data: eventos
      });
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  async getUpcomingEventos(req: Request, res: Response): Promise<void> {
    try {
      const eventos = await this.eventoUseCases.viewUpcomingEventos();
      res.json({
        success: true,
        data: eventos
      });
    } catch (error) {
      console.error('Erro ao buscar próximos eventos:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  async getEventoById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const evento = await this.eventoUseCases.viewEvento(id);
      
      if (!evento) {
        res.status(404).json({
          success: false,
          message: 'Evento não encontrado'
        });
        return;
      }

      res.json({
        success: true,
        data: evento
      });
    } catch (error) {
      console.error('Erro ao buscar evento:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  async checkEventAvailability(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const availability = await this.eventoUseCases.checkEventAvailability(id);
      
      res.json({
        success: true,
        data: availability
      });
    } catch (error) {
      console.error('Erro ao verificar disponibilidade do evento:', error);
      
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

  async getEventosByDateRange(req: Request, res: Response): Promise<void> {
    try {
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        res.status(400).json({
          success: false,
          message: 'Data inicial e final são obrigatórias'
        });
        return;
      }

      const start = new Date(startDate as string);
      const end = new Date(endDate as string);
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        res.status(400).json({
          success: false,
          message: 'Formato de data inválido'
        });
        return;
      }

      const eventos = await this.eventoUseCases.searchEventosByDate(start, end);
      res.json({
        success: true,
        data: eventos
      });
    } catch (error) {
      console.error('Erro ao buscar eventos por período:', error);
      
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

  async getEventCalendar(req: Request, res: Response): Promise<void> {
    try {
      const { month, year } = req.query;
      
      if (!month || !year) {
        res.status(400).json({
          success: false,
          message: 'Mês e ano são obrigatórios'
        });
        return;
      }

      const monthNum = parseInt(month as string);
      const yearNum = parseInt(year as string);
      
      if (isNaN(monthNum) || isNaN(yearNum) || monthNum < 1 || monthNum > 12) {
        res.status(400).json({
          success: false,
          message: 'Mês ou ano inválido'
        });
        return;
      }

      const eventos = await this.eventoUseCases.getEventCalendar(monthNum, yearNum);
      res.json({
        success: true,
        data: eventos
      });
    } catch (error) {
      console.error('Erro ao buscar calendário de eventos:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  async getEventoSummary(req: Request, res: Response): Promise<void> {
    try {
      const summary = await this.eventoUseCases.getEventoSummary();
      res.json({
        success: true,
        data: summary
      });
    } catch (error) {
      console.error('Erro ao buscar resumo de eventos:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Métodos administrativos
  async createEvento(req: Request, res: Response): Promise<void> {
    try {
      const eventoData = req.body;
      const evento = await this.eventoUseCases.createEvento(eventoData);
      
      res.status(201).json({
        success: true,
        message: 'Evento criado com sucesso',
        data: evento
      });
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      
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

  async updateEvento(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const evento = await this.eventoUseCases.updateEvento(id, updateData);
      
      res.json({
        success: true,
        message: 'Evento atualizado com sucesso',
        data: evento
      });
    } catch (error) {
      console.error('Erro ao atualizar evento:', error);
      
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

  async deleteEvento(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.eventoUseCases.deleteEvento(id);
      
      res.json({
        success: true,
        message: 'Evento deletado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar evento:', error);
      
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
