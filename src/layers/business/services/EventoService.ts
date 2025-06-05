// Evento Service - Business Logic Layer

import { Evento } from '../../shared/types';
import { IEventoRepository } from '../../data/repositories/interfaces';

export class EventoService {
  constructor(private eventoRepository: IEventoRepository) {}

  async getAllEventos(): Promise<Evento[]> {
    try {
      return await this.eventoRepository.getAll();
    } catch (error) {
      console.error('Erro no serviço ao buscar eventos:', error);
      throw new Error('Falha ao buscar eventos');
    }
  }

  async getEventoById(id: string): Promise<Evento | null> {
    if (!id?.trim()) {
      throw new Error('ID do evento é obrigatório');
    }

    try {
      return await this.eventoRepository.getById(id);
    } catch (error) {
      console.error(`Erro no serviço ao buscar evento ${id}:`, error);
      throw new Error('Falha ao buscar evento');
    }
  }

  async getUpcomingEventos(): Promise<Evento[]> {
    try {
      return await this.eventoRepository.getUpcoming();
    } catch (error) {
      console.error('Erro no serviço ao buscar próximos eventos:', error);
      throw new Error('Falha ao buscar próximos eventos');
    }
  }

  async createEvento(evento: Omit<Evento, 'id' | 'createdAt' | 'updatedAt'>): Promise<Evento> {
    this.validateBusinessRules(evento);

    try {
      return await this.eventoRepository.create(evento);
    } catch (error) {
      console.error('Erro no serviço ao criar evento:', error);
      throw error;
    }
  }

  async updateEvento(id: string, data: Partial<Evento>): Promise<Evento> {
    if (!id?.trim()) {
      throw new Error('ID do evento é obrigatório');
    }

    if (data.dataEvento) {
      this.validateEventDate(data.dataEvento);
    }

    try {
      return await this.eventoRepository.update(id, data);
    } catch (error) {
      console.error(`Erro no serviço ao atualizar evento ${id}:`, error);
      throw error;
    }
  }

  async deleteEvento(id: string): Promise<void> {
    if (!id?.trim()) {
      throw new Error('ID do evento é obrigatório');
    }

    try {
      // Verificar se evento pode ser deletado (não possui inscrições)
      const evento = await this.eventoRepository.getById(id);
      if (!evento) {
        throw new Error('Evento não encontrado');
      }

      // Verificar se evento já passou
      if (new Date(evento.dataEvento) < new Date()) {
        throw new Error('Não é possível deletar eventos que já aconteceram');
      }

      await this.eventoRepository.delete(id);
    } catch (error) {
      console.error(`Erro no serviço ao deletar evento ${id}:`, error);
      throw error;
    }
  }

  async checkEventAvailability(eventoId: string): Promise<{ disponivel: boolean; vagasRestantes: number }> {
    if (!eventoId?.trim()) {
      throw new Error('ID do evento é obrigatório');
    }

    try {
      const evento = await this.eventoRepository.getById(eventoId);
      if (!evento) {
        throw new Error('Evento não encontrado');
      }

      if (!evento.maxParticipantes) {
        return { disponivel: true, vagasRestantes: -1 }; // Ilimitado
      }

      // Aqui seria necessário contar inscrições aprovadas
      // Por agora, assumindo que participantesAtuais existe no objeto
      const participantesAtuais = (evento as any).participantesAtuais || 0;
      const vagasRestantes = evento.maxParticipantes - participantesAtuais;

      return {
        disponivel: vagasRestantes > 0,
        vagasRestantes: Math.max(0, vagasRestantes)
      };
    } catch (error) {
      console.error(`Erro ao verificar disponibilidade do evento ${eventoId}:`, error);
      throw error;
    }
  }

  async getEventosByDateRange(startDate: Date, endDate: Date): Promise<Evento[]> {
    if (startDate >= endDate) {
      throw new Error('Data inicial deve ser anterior à data final');
    }

    try {
      const eventos = await this.eventoRepository.getAll();
      return eventos.filter(evento => {
        const dataEvento = new Date(evento.dataEvento);
        return dataEvento >= startDate && dataEvento <= endDate;
      });
    } catch (error) {
      console.error('Erro ao buscar eventos por período:', error);
      throw new Error('Falha ao buscar eventos por período');
    }
  }

  private validateBusinessRules(evento: Omit<Evento, 'id' | 'createdAt' | 'updatedAt'>): void {
    // Validar data do evento
    this.validateEventDate(evento.dataEvento);

    // Validar regras específicas do negócio
    if (evento.maxParticipantes && evento.maxParticipantes > 1000) {
      throw new Error('Número máximo de participantes não pode exceder 1000');
    }

    if (evento.preco && evento.preco > 10000) {
      throw new Error('Preço do evento não pode exceder R$ 10.000');
    }

    // Validar se não há conflito de horário/local (seria implementado com dados reais)
    this.validateEventConflicts(evento);
  }

  private validateEventDate(dataEvento: Date): void {
    const eventDate = new Date(dataEvento);
    const now = new Date();
    const minAdvanceTime = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 horas

    if (eventDate <= minAdvanceTime) {
      throw new Error('Evento deve ser criado com pelo menos 24 horas de antecedência');
    }

    const maxAdvanceTime = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 ano
    if (eventDate > maxAdvanceTime) {
      throw new Error('Evento não pode ser criado com mais de 1 ano de antecedência');
    }
  }

  private validateEventConflicts(evento: Omit<Evento, 'id' | 'createdAt' | 'updatedAt'>): void {
    // Implementar validação de conflitos de horário/local
    // Por agora, apenas uma validação básica
    if (evento.local && evento.local.toLowerCase().includes('quadra') && 
        new Date(evento.dataEvento).getHours() < 6) {
      throw new Error('Eventos em quadras não podem ser realizados antes das 6h');
    }
  }
}
