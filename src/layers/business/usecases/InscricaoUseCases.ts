// Inscricao Use Cases - Business Logic Layer

import { Inscricao } from '../../shared/types';
import { InscricaoService } from '../services/InscricaoService';

export class InscricaoUseCases {
  constructor(private inscricaoService: InscricaoService) {}

  // Casos de uso para usuários
  async checkEligibility(userId: string, esporteId: string): Promise<{ eligible: boolean; reason?: string }> {
    return await this.inscricaoService.checkUserEligibility(userId, esporteId);
  }

  async subscribeToSport(userId: string, esporteId: string, observacoes?: string): Promise<Inscricao> {
    const inscricaoData = {
      userId,
      esporteId,
      observacoes: observacoes || '',
      status: 'pendente' as const
    };

    return await this.inscricaoService.createInscricao(inscricaoData);
  }

  async getUserInscricoes(userId: string): Promise<Inscricao[]> {
    return await this.inscricaoService.getInscricoesByUser(userId);
  }

  async cancelSubscription(inscricaoId: string, userId: string): Promise<void> {
    return await this.inscricaoService.cancelInscricao(inscricaoId, userId);
  }

  async getUserSubscriptionStatus(userId: string): Promise<{
    total: number;
    aprovadas: number;
    pendentes: number;
    rejeitadas: number;
    canceladas: number;
    inscricoes: Inscricao[];
  }> {
    const inscricoes = await this.inscricaoService.getInscricoesByUser(userId);

    return {
      total: inscricoes.length,
      aprovadas: inscricoes.filter(i => i.status === 'aprovada').length,
      pendentes: inscricoes.filter(i => i.status === 'pendente').length,
      rejeitadas: inscricoes.filter(i => i.status === 'rejeitada').length,
      canceladas: inscricoes.filter(i => i.status === 'cancelada').length,
      inscricoes
    };
  }

  // Casos de uso administrativos
  async getPendingInscricoes(): Promise<Inscricao[]> {
    return await this.inscricaoService.getPendingInscricoes();
  }

  async approveInscricao(inscricaoId: string, adminId: string): Promise<Inscricao> {
    return await this.inscricaoService.approveInscricao(inscricaoId, adminId);
  }

  async rejectInscricao(inscricaoId: string, adminId: string): Promise<Inscricao> {
    return await this.inscricaoService.rejectInscricao(inscricaoId, adminId);
  }

  async cancelInscricao(inscricaoId: string, adminId: string): Promise<void> {
    return await this.inscricaoService.cancelInscricao(inscricaoId, adminId);
  }

  async getSportInscricoes(esporteId: string): Promise<Inscricao[]> {
    return await this.inscricaoService.getInscricoesByEsporte(esporteId);
  }

  async getAllInscricoes(): Promise<Inscricao[]> {
    return await this.inscricaoService.getAllInscricoes();
  }

  async getInscricaoStats(): Promise<{
    total: number;
    pendentes: number;
    aprovadas: number;
    rejeitadas: number;
    canceladas: number;
  }> {
    return await this.inscricaoService.getInscricaoStats();
  }

  // Casos de uso compostos
  async getInscricaoDashboard(): Promise<{
    stats: {
      total: number;
      pendentes: number;
      aprovadas: number;
      rejeitadas: number;
      canceladas: number;
    };
    recentInscricoes: Inscricao[];
    pendingActions: Inscricao[];
  }> {
    const [stats, allInscricoes, pendingInscricoes] = await Promise.all([
      this.inscricaoService.getInscricaoStats(),
      this.inscricaoService.getAllInscricoes(),
      this.inscricaoService.getPendingInscricoes()
    ]);

    // Inscrições mais recentes (últimas 10)
    const recentInscricoes = allInscricoes
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);

    return {
      stats,
      recentInscricoes,
      pendingActions: pendingInscricoes
    };
  }

  async getSportSubscriptionReport(esporteId: string): Promise<{
    total: number;
    aprovadas: number;
    pendentes: number;
    rejeitadas: number;
    canceladas: number;
    inscricoes: Inscricao[];
  }> {
    const inscricoes = await this.inscricaoService.getInscricoesByEsporte(esporteId);

    return {
      total: inscricoes.length,
      aprovadas: inscricoes.filter(i => i.status === 'aprovada').length,
      pendentes: inscricoes.filter(i => i.status === 'pendente').length,
      rejeitadas: inscricoes.filter(i => i.status === 'rejeitada').length,
      canceladas: inscricoes.filter(i => i.status === 'cancelada').length,
      inscricoes
    };
  }

  async bulkApproveInscricoes(inscricaoIds: string[], adminId: string): Promise<{
    approved: Inscricao[];
    errors: Array<{ id: string; error: string }>;
  }> {
    const approved: Inscricao[] = [];
    const errors: Array<{ id: string; error: string }> = [];

    for (const id of inscricaoIds) {
      try {
        const inscricao = await this.inscricaoService.approveInscricao(id, adminId);
        approved.push(inscricao);
      } catch (error) {
        errors.push({
          id,
          error: error instanceof Error ? error.message : 'Erro desconhecido'
        });
      }
    }

    return { approved, errors };
  }

  async bulkRejectInscricoes(inscricaoIds: string[], adminId: string): Promise<{
    rejected: Inscricao[];
    errors: Array<{ id: string; error: string }>;
  }> {
    const rejected: Inscricao[] = [];
    const errors: Array<{ id: string; error: string }> = [];

    for (const id of inscricaoIds) {
      try {
        const inscricao = await this.inscricaoService.rejectInscricao(id, adminId);
        rejected.push(inscricao);
      } catch (error) {
        errors.push({
          id,
          error: error instanceof Error ? error.message : 'Erro desconhecido'
        });
      }
    }

    return { rejected, errors };
  }
}
