// Esporte Use Cases - Business Logic Layer

import { Esporte } from '../../shared/types';
import { EsporteService } from '../services/EsporteService';

export class EsporteUseCases {
  constructor(private esporteService: EsporteService) {}

  // Casos de uso para usuários comuns
  async viewAllEsportes(): Promise<Esporte[]> {
    return await this.esporteService.getAllEsportes();
  }

  async viewActiveEsportes(): Promise<Esporte[]> {
    return await this.esporteService.getActiveEsportes();
  }

  async viewEsporte(id: string): Promise<Esporte | null> {
    return await this.esporteService.getEsporteById(id);
  }

  async findEsportesBySchedule(dias: string[]): Promise<Esporte[]> {
    return await this.esporteService.getEsportesByDiasTreino(dias);
  }

  async searchEsportes(query: string): Promise<Esporte[]> {
    return await this.esporteService.searchEsportes(query);
  }

  // Casos de uso para administradores
  async createEsporte(esporte: Omit<Esporte, 'id' | 'createdAt' | 'updatedAt'>): Promise<Esporte> {
    return await this.esporteService.createEsporte(esporte);
  }

  async updateEsporte(id: string, data: Partial<Esporte>): Promise<Esporte> {
    return await this.esporteService.updateEsporte(id, data);
  }

  async deleteEsporte(id: string): Promise<void> {
    return await this.esporteService.deleteEsporte(id);
  }

  async activateEsporte(id: string): Promise<Esporte> {
    return await this.esporteService.updateEsporte(id, { ativo: true });
  }

  async deactivateEsporte(id: string): Promise<Esporte> {
    return await this.esporteService.updateEsporte(id, { ativo: false });
  }

  // Casos de uso compostos
  async getEsporteDashboard(): Promise<{
    total: number;
    active: number;
    inactive: number;
    byCategory: Record<string, number>;
  }> {
    const esportes = await this.esporteService.getAllEsportes();
    
    const byCategory: Record<string, number> = {};
    esportes.forEach(esporte => {
      const categoria = esporte.categoria || 'Sem categoria';
      byCategory[categoria] = (byCategory[categoria] || 0) + 1;
    });

    return {
      total: esportes.length,
      active: esportes.filter(e => e.ativo).length,
      inactive: esportes.filter(e => !e.ativo).length,
      byCategory
    };
  }

  async getWeeklySchedule(): Promise<Record<string, Esporte[]>> {
    const esportes = await this.esporteService.getActiveEsportes();
    const schedule: Record<string, Esporte[]> = {
      'segunda': [],
      'terca': [],
      'quarta': [],
      'quinta': [],
      'sexta': [],
      'sabado': [],
      'domingo': []
    };

    esportes.forEach(esporte => {
      esporte.diasTreino.forEach(dia => {
        if (schedule[dia]) {
          schedule[dia].push(esporte);
        }
      });
    });

    return schedule;
  }
}
