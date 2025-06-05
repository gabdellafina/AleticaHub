// Shared Types - Definições de tipos usadas em toda aplicação

export interface BaseEntity {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface User extends BaseEntity {
  uid: string;
  nome: string;
  email?: string;
  telefone: string;
  dataNascimento: string;
  curso: string;
  role: 'user' | 'admin';
  status: 'ativo' | 'pendente' | 'suspenso';
}

export interface Esporte extends BaseEntity {
  nome: string;
  descricao: string;
  diasTreino: string[];
}

export interface Evento extends BaseEntity {
  nome: string;
  descricao: string;
  data: string;
  preco?: number;
  imagemUrl?: string;
}

export interface Produto extends BaseEntity {
  nome: string;
  preco: number;
  estoque: number;
  imagemUrl?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  size: string;
  quantity: number;
}

export interface Inscricao extends BaseEntity {
  usuarioId: string;
  esporteId: string;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  esporteNome?: string;
}

export interface Mensagem extends BaseEntity {
  conteudo: string;
  autorId: string;
  autorNome: string;
  chatId: string;
  tipo: 'geral' | 'esporte';
}

export interface Chat extends BaseEntity {
  nome: string;
  tipo: 'geral' | 'esporte';
  esporteId?: string;
  ultimoConteudo?: string;
}

export interface Pedido extends BaseEntity {
  usuarioEmail: string;
  items: CartItem[];
  total: number;
  status: 'pendente' | 'pago' | 'cancelado';
  metodoPagamento?: 'pix' | 'dinheiro';
}

// Tipos para requisições/respostas da API
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Tipos para formulários
export interface LoginForm {
  email: string;
  senha: string;
}

export interface RegisterForm {
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  dataNascimento: string;
  curso: string;
}

export interface EsporteForm {
  nome: string;
  descricao: string;
  diasTreino: string[];
}

export interface EventoForm {
  nome: string;
  descricao: string;
  data: string;
  preco?: number;
  imagem?: File;
}

export interface ProdutoForm {
  nome: string;
  preco: number;
  estoque: number;
  imagem?: File;
}
