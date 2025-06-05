// Inscricao Service - Business Logic Layer

import { Inscricao } from '../../shared/types';
import { IInscricaoRepository, IEsporteRepository, IUserRepository } from '../../data/repositories/interfaces';

export class InscricaoService {
  constructor(
    private inscricaoRepository: IInscricaoRepository,
    private esporteRepository: IEsporteRepository,
    private userRepository: IUserRepository
  ) {}

  async getAllInscricoes(): Promise<Inscricao[]> {
    try {
      return await this.inscricaoRepository.getAll();
    } catch (error) {
      console.error('Erro no serviço ao buscar inscrições:', error);
      throw new Error('Falha ao buscar inscrições');
    }
  }

  async getInscricoesByUser(userId: string): Promise<Inscricao[]> {
    if (!userId?.trim()) {
      throw new Error('ID do usuário é obrigatório');
    }

    try {
      return await this.inscricaoRepository.getByUser(userId);
    } catch (error) {
      console.error(`Erro no serviço ao buscar inscrições do usuário ${userId}:`, error);
      throw new Error('Falha ao buscar inscrições do usuário');
    }
  }

  async getInscricoesByEsporte(esporteId: string): Promise<Inscricao[]> {
    if (!esporteId?.trim()) {
      throw new Error('ID do esporte é obrigatório');
    }

    try {
      return await this.inscricaoRepository.getByEsporte(esporteId);
    } catch (error) {
      console.error(`Erro no serviço ao buscar inscrições do esporte ${esporteId}:`, error);
      throw new Error('Falha ao buscar inscrições do esporte');
    }
  }

  async getPendingInscricoes(): Promise<Inscricao[]> {
    try {
      return await this.inscricaoRepository.getPending();
    } catch (error) {
      console.error('Erro no serviço ao buscar inscrições pendentes:', error);
      throw new Error('Falha ao buscar inscrições pendentes');
    }
  }

  async createInscricao(inscricao: Omit<Inscricao, 'id' | 'createdAt' | 'updatedAt'>): Promise<Inscricao> {
    await this.validateBusinessRules(inscricao);

    try {
      return await this.inscricaoRepository.create(inscricao);
    } catch (error) {
      console.error('Erro no serviço ao criar inscrição:', error);
      throw error;
    }
  }

  async approveInscricao(id: string, adminId: string): Promise<Inscricao> {
    if (!id?.trim()) {
      throw new Error('ID da inscrição é obrigatório');
    }

    if (!adminId?.trim()) {
      throw new Error('ID do administrador é obrigatório');
    }

    try {
      // Verificar se usuário é admin
      const admin = await this.userRepository.getById(adminId);
      if (!admin || admin.role !== 'admin') {
        throw new Error('Apenas administradores podem aprovar inscrições');
      }

      return await this.inscricaoRepository.approve(id);
    } catch (error) {
      console.error(`Erro no serviço ao aprovar inscrição ${id}:`, error);
      throw error;
    }
  }

  async rejectInscricao(id: string, adminId: string): Promise<Inscricao> {
    if (!id?.trim()) {
      throw new Error('ID da inscrição é obrigatório');
    }

    if (!adminId?.trim()) {
      throw new Error('ID do administrador é obrigatório');
    }

    try {
      // Verificar se usuário é admin
      const admin = await this.userRepository.getById(adminId);
      if (!admin || admin.role !== 'admin') {
        throw new Error('Apenas administradores podem rejeitar inscrições');
      }

      return await this.inscricaoRepository.reject(id);
    } catch (error) {
      console.error(`Erro no serviço ao rejeitar inscrição ${id}:`, error);
      throw error;
    }
  }

  async cancelInscricao(id: string, userId: string): Promise<void> {
    if (!id?.trim()) {
      throw new Error('ID da inscrição é obrigatório');
    }

    if (!userId?.trim()) {
      throw new Error('ID do usuário é obrigatório');
    }

    try {
      // Verificar se inscrição pertence ao usuário ou se usuário é admin
      const inscricao = await this.inscricaoRepository.getAll();
      const targetInscricao = inscricao.find(i => i.id === id);
      
      if (!targetInscricao) {
        throw new Error('Inscrição não encontrada');
      }

      const user = await this.userRepository.getById(userId);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      if (targetInscricao.userId !== userId && user.role !== 'admin') {
        throw new Error('Usuário não tem permissão para cancelar esta inscrição');
      }

      await this.inscricaoRepository.cancel(id);
    } catch (error) {
      console.error(`Erro no serviço ao cancelar inscrição ${id}:`, error);
      throw error;
    }
  }

  async checkUserEligibility(userId: string, esporteId: string): Promise<{ eligible: boolean; reason?: string }> {
    if (!userId?.trim() || !esporteId?.trim()) {
      throw new Error('ID do usuário e do esporte são obrigatórios');
    }

    try {
      // Verificar se usuário existe e está ativo
      const user = await this.userRepository.getById(userId);
      if (!user) {
        return { eligible: false, reason: 'Usuário não encontrado' };
      }

      if (user.status !== 'ativo') {
        return { eligible: false, reason: 'Usuário não está ativo' };
      }

      // Verificar se esporte existe e está ativo
      const esporte = await this.esporteRepository.getById(esporteId);
      if (!esporte) {
        return { eligible: false, reason: 'Esporte não encontrado' };
      }

      if (!esporte.ativo) {
        return { eligible: false, reason: 'Esporte não está ativo' };
      }

      // Verificar se usuário já tem inscrição ativa para este esporte
      const inscricoesUsuario = await this.inscricaoRepository.getByUser(userId);
      const inscricaoExistente = inscricoesUsuario.find(
        i => i.esporteId === esporteId && i.status !== 'cancelada'
      );

      if (inscricaoExistente) {
        return { eligible: false, reason: 'Usuário já possui inscrição ativa para este esporte' };
      }

      // Verificar limite de vagas (se existir)
      if (esporte.maxParticipantes) {
        const inscricoesEsporte = await this.inscricaoRepository.getByEsporte(esporteId);
        const inscricoesAprovadas = inscricoesEsporte.filter(i => i.status === 'aprovada');
        
        if (inscricoesAprovadas.length >= esporte.maxParticipantes) {
          return { eligible: false, reason: 'Limite de participantes atingido' };
        }
      }

      return { eligible: true };
    } catch (error) {
      console.error(`Erro ao verificar elegibilidade do usuário ${userId} para esporte ${esporteId}:`, error);
      throw new Error('Falha ao verificar elegibilidade');
    }
  }

  async getInscricaoStats(): Promise<{
    total: number;
    pendentes: number;
    aprovadas: number;
    rejeitadas: number;
    canceladas: number;
  }> {
    try {
      const inscricoes = await this.inscricaoRepository.getAll();
      
      return {
        total: inscricoes.length,
        pendentes: inscricoes.filter(i => i.status === 'pendente').length,
        aprovadas: inscricoes.filter(i => i.status === 'aprovada').length,
        rejeitadas: inscricoes.filter(i => i.status === 'rejeitada').length,
        canceladas: inscricoes.filter(i => i.status === 'cancelada').length,
      };
    } catch (error) {
      console.error('Erro ao obter estatísticas de inscrições:', error);
      throw new Error('Falha ao obter estatísticas');
    }
  }

  private async validateBusinessRules(inscricao: Omit<Inscricao, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    // Verificar elegibilidade
    const eligibility = await this.checkUserEligibility(inscricao.userId, inscricao.esporteId);
    if (!eligibility.eligible) {
      throw new Error(eligibility.reason || 'Usuário não elegível para inscrição');
    }

    // Validar observações se fornecidas
    if (inscricao.observacoes && inscricao.observacoes.trim().length > 500) {
      throw new Error('Observações não podem exceder 500 caracteres');
    }
  }
}
