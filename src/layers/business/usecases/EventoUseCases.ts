// Evento Use Cases - Business Logic Layer

import { Evento } from '../../shared/types';
import { EventoService } from '../services/EventoService';

export class EventoUseCases {
  constructor(private eventoService: EventoService) {}

  // Casos de uso para usuários comuns
  async viewAllEventos(): Promise<Evento[]> {
    return await this.eventoService.getAllEventos();
  }

  async viewEvento(id: string): Promise<Evento | null> {
    return await this.eventoService.getEventoById(id);
  }

  async viewUpcomingEventos(): Promise<Evento[]> {
    return await this.eventoService.getUpcomingEventos();
  }

  async checkEventAvailability(eventoId: string): Promise<{ disponivel: boolean; vagasRestantes: number }> {
    return await this.eventoService.checkEventAvailability(eventoId);
  }

  async searchEventosByDate(startDate: Date, endDate: Date): Promise<Evento[]> {
    return await this.eventoService.getEventosByDateRange(startDate, endDate);
  }

  // Casos de uso para administradores
  async createEvento(evento: Omit<Evento, 'id' | 'createdAt' | 'updatedAt'>): Promise<Evento> {
    return await this.eventoService.createEvento(evento);
  }

  async updateEvento(id: string, data: Partial<Evento>): Promise<Evento> {
    return await this.eventoService.updateEvento(id, data);
  }

  async deleteEvento(id: string): Promise<void> {
    return await this.eventoService.deleteEvento(id);
  }

  // Casos de uso compostos
  async getEventCalendar(month: number, year: number): Promise<Evento[]> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    
    return await this.eventoService.getEventosByDateRange(startDate, endDate);
  }

  async getEventoSummary(): Promise<{
    total: number;
    upcoming: number;
    thisMonth: number;
  }> {
    const [allEventos, upcomingEventos] = await Promise.all([
      this.eventoService.getAllEventos(),
      this.eventoService.getUpcomingEventos()
    ]);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const thisMonthEventos = await this.eventoService.getEventosByDateRange(startOfMonth, endOfMonth);

    return {
      total: allEventos.length,
      upcoming: upcomingEventos.length,
      thisMonth: thisMonthEventos.length
    };
  }
}
