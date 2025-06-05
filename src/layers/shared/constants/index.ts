// Shared Constants - Constantes usadas em toda aplicação

export const ROLES = {
  USER: 'user',
  ADMIN: 'admin'
} as const;

export const USER_STATUS = {
  ATIVO: 'ativo',
  PENDENTE: 'pendente',
  SUSPENSO: 'suspenso'
} as const;

export const INSCRICAO_STATUS = {
  PENDENTE: 'pendente',
  APROVADO: 'aprovado',
  REJEITADO: 'rejeitado'
} as const;

export const PEDIDO_STATUS = {
  PENDENTE: 'pendente',
  PAGO: 'pago',
  CANCELADO: 'cancelado'
} as const;

export const METODOS_PAGAMENTO = {
  PIX: 'pix',
  DINHEIRO: 'dinheiro'
} as const;

export const CHAT_TIPOS = {
  GERAL: 'geral',
  ESPORTE: 'esporte'
} as const;

export const DIAS_SEMANA = [
  'domingo',
  'segunda',
  'terça',
  'quarta',
  'quinta',
  'sexta',
  'sábado'
] as const;

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/auth/login',
  VERIFY_USER: '/api/auth/verify-user',
  VERIFY_ADMIN: '/api/auth/verify-admin',
  
  // Users
  USUARIOS: '/api/usuarios',
  USUARIO_BY_ID: (id: string) => `/api/usuarios/${id}`,
  APROVAR_USUARIO: (id: string) => `/api/usuarios/${id}/aprovar`,
  PROMOVER_USUARIO: (id: string) => `/api/usuarios/${id}/promover`,
  
  // Esportes
  ESPORTES: '/api/esportes',
  ESPORTE_BY_ID: (id: string) => `/api/esportes/${id}`,
  
  // Eventos
  EVENTOS: '/api/eventos',
  EVENTO_BY_ID: (id: string) => `/api/eventos/${id}`,
  
  // Produtos
  PRODUTOS: '/api/produtos',
  PRODUTO_BY_ID: (id: string) => `/api/produtos/${id}`,
  
  // Inscricoes
  INSCRICOES: '/api/inscricoes',
  INSCRICOES_EVENTO: '/api/inscricoes-evento',
  APROVAR_INSCRICAO: (id: string) => `/api/inscricoes/${id}/aprovar`,
  REJEITAR_INSCRICAO: (id: string) => `/api/inscricoes/${id}/rejeitar`,
  
  // Mensagens
  MENSAGENS: '/api/mensagens',
  MENSAGENS_BY_CHAT: (chatId: string) => `/api/mensagens/${chatId}`,
  
  // Chat
  CHATS: '/api/chats',
  PERMISSOES_CHAT: '/api/permissoes-chat',
  
  // Pedidos
  PEDIDOS: '/api/pedidos',
  CHECKOUT: '/api/checkout',
  PAGAMENTO: (pedidoId: string) => `/api/pedidos/${pedidoId}/payment`
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
} as const;

export const ROUTES = {
  // Public
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  
  // User
  USER_HOME: '/home',
  SHOP: '/shop',
  PRODUCT_DETAIL: (id: string) => `/shop/${id}`,
  CART: '/cart',
  CHECKOUT: '/cart/checkout',
  PAYMENT: '/cart/payment',
  CALENDAR: '/calendar',
  CHAT: '/chat',
  CHAT_DETAIL: (id: string) => `/chat/${id}`,
  EVENTS: '/events',
  EVENT_DETAIL: (id: string) => `/events/${id}`,
  SPORTS: '/sports',
  SPORT_DETAIL: (id: string) => `/sports/${id}`,
  PROFILE: '/profile',
  
  // Admin
  ADMIN_DASHBOARD: '/admin-dashboard',
  ADMIN_LOJA: '/admin-dashboard/loja',
  ADMIN_EVENTOS: '/admin-dashboard/eventos',
  ADMIN_USUARIOS: '/admin-dashboard/usuarios',
  ADMIN_ESPORTES: '/admin-dashboard/esportes'
} as const;
