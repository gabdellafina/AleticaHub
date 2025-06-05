// filepath: c:\Users\julio\Downloads\AtleticaHub-FrontEnd\AleticaHub\src\core\di\Container.ts
// Dependency Injection Container - Manages all service dependencies following Clean Architecture

import {
  IUserDataSource,
  IEsporteDataSource,
  IEventoDataSource,
  IProdutoDataSource,
  IPedidoDataSource,
  IInscricaoDataSource,
  IMensagemDataSource,
  IChatDataSource,
  FirebaseUserDataSource,
  FirebaseEsporteDataSource,
  FirebaseEventoDataSource,
  FirebaseProdutoDataSource,
  FirebasePedidoDataSource,
  FirebaseInscricaoDataSource,
  FirebaseMensagemDataSource,
  FirebaseChatDataSource
} from '../../layers/data/datasources';

import {
  IUserRepository,
  IEsporteRepository,
  IEventoRepository,
  IProdutoRepository,
  IPedidoRepository,
  IInscricaoRepository,
  IMensagemRepository,
  IChatRepository,
  UserRepositoryImpl,
  EsporteRepositoryImpl,
  EventoRepositoryImpl,
  ProdutoRepositoryImpl,
  PedidoRepositoryImpl,
  InscricaoRepositoryImpl,
  MensagemRepositoryImpl,
  ChatRepositoryImpl
} from '../../layers/domain/repositories';

import {
  IUserUseCase,
  IEsporteUseCase,
  IEventoUseCase,
  IProdutoUseCase,
  IPedidoUseCase,
  IInscricaoUseCase,
  IMensagemUseCase,
  IChatUseCase,
  UserUseCaseImpl,
  EsporteUseCaseImpl,
  EventoUseCaseImpl,
  ProdutoUseCaseImpl,
  PedidoUseCaseImpl,
  InscricaoUseCaseImpl,
  MensagemUseCaseImpl,
  ChatUseCaseImpl
} from '../../layers/domain/usecases';

import {
  UserController,
  EsporteController,
  EventoController,
  LojaController,
  ChatController,
  InscricaoController
} from '../../layers/infrastructure/controllers';

class DIContainer {
  private static instance: DIContainer;
  
  // Data Sources
  private _userDataSource?: IUserDataSource;
  private _esporteDataSource?: IEsporteDataSource;
  private _eventoDataSource?: IEventoDataSource;
  private _produtoDataSource?: IProdutoDataSource;
  private _pedidoDataSource?: IPedidoDataSource;
  private _inscricaoDataSource?: IInscricaoDataSource;
  private _mensagemDataSource?: IMensagemDataSource;
  private _chatDataSource?: IChatDataSource;

  // Repositories
  private _userRepository?: IUserRepository;
  private _esporteRepository?: IEsporteRepository;
  private _eventoRepository?: IEventoRepository;
  private _produtoRepository?: IProdutoRepository;
  private _pedidoRepository?: IPedidoRepository;
  private _inscricaoRepository?: IInscricaoRepository;
  private _mensagemRepository?: IMensagemRepository;
  private _chatRepository?: IChatRepository;

  // Use Cases
  private _userUseCase?: IUserUseCase;
  private _esporteUseCase?: IEsporteUseCase;
  private _eventoUseCase?: IEventoUseCase;
  private _produtoUseCase?: IProdutoUseCase;
  private _pedidoUseCase?: IPedidoUseCase;
  private _inscricaoUseCase?: IInscricaoUseCase;
  private _mensagemUseCase?: IMensagemUseCase;
  private _chatUseCase?: IChatUseCase;

  // Controllers
  private _userController?: UserController;
  private _esporteController?: EsporteController;
  private _eventoController?: EventoController;
  private _lojaController?: LojaController;
  private _chatController?: ChatController;
  private _inscricaoController?: InscricaoController;

  private constructor() {}

  static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  // Data Sources Getters
  get userDataSource(): IUserDataSource {
    if (!this._userDataSource) {
      this._userDataSource = new FirebaseUserDataSource();
    }
    return this._userDataSource;
  }

  get esporteDataSource(): IEsporteDataSource {
    if (!this._esporteDataSource) {
      this._esporteDataSource = new FirebaseEsporteDataSource();
    }
    return this._esporteDataSource;
  }

  get eventoDataSource(): IEventoDataSource {
    if (!this._eventoDataSource) {
      this._eventoDataSource = new FirebaseEventoDataSource();
    }
    return this._eventoDataSource;
  }

  get produtoDataSource(): IProdutoDataSource {
    if (!this._produtoDataSource) {
      this._produtoDataSource = new FirebaseProdutoDataSource();
    }
    return this._produtoDataSource;
  }

  get pedidoDataSource(): IPedidoDataSource {
    if (!this._pedidoDataSource) {
      this._pedidoDataSource = new FirebasePedidoDataSource();
    }
    return this._pedidoDataSource;
  }

  get inscricaoDataSource(): IInscricaoDataSource {
    if (!this._inscricaoDataSource) {
      this._inscricaoDataSource = new FirebaseInscricaoDataSource();
    }
    return this._inscricaoDataSource;
  }

  get mensagemDataSource(): IMensagemDataSource {
    if (!this._mensagemDataSource) {
      this._mensagemDataSource = new FirebaseMensagemDataSource();
    }
    return this._mensagemDataSource;
  }

  get chatDataSource(): IChatDataSource {
    if (!this._chatDataSource) {
      this._chatDataSource = new FirebaseChatDataSource();
    }
    return this._chatDataSource;
  }

  // Repository Getters
  get userRepository(): IUserRepository {
    if (!this._userRepository) {
      this._userRepository = new UserRepositoryImpl(this.userDataSource);
    }
    return this._userRepository;
  }

  get esporteRepository(): IEsporteRepository {
    if (!this._esporteRepository) {
      this._esporteRepository = new EsporteRepositoryImpl(this.esporteDataSource);
    }
    return this._esporteRepository;
  }

  get eventoRepository(): IEventoRepository {
    if (!this._eventoRepository) {
      this._eventoRepository = new EventoRepositoryImpl(this.eventoDataSource);
    }
    return this._eventoRepository;
  }

  get produtoRepository(): IProdutoRepository {
    if (!this._produtoRepository) {
      this._produtoRepository = new ProdutoRepositoryImpl(this.produtoDataSource);
    }
    return this._produtoRepository;
  }

  get pedidoRepository(): IPedidoRepository {
    if (!this._pedidoRepository) {
      this._pedidoRepository = new PedidoRepositoryImpl(this.pedidoDataSource);
    }
    return this._pedidoRepository;
  }

  get inscricaoRepository(): IInscricaoRepository {
    if (!this._inscricaoRepository) {
      this._inscricaoRepository = new InscricaoRepositoryImpl(this.inscricaoDataSource);
    }
    return this._inscricaoRepository;
  }

  get mensagemRepository(): IMensagemRepository {
    if (!this._mensagemRepository) {
      this._mensagemRepository = new MensagemRepositoryImpl(this.mensagemDataSource);
    }
    return this._mensagemRepository;
  }

  get chatRepository(): IChatRepository {
    if (!this._chatRepository) {
      this._chatRepository = new ChatRepositoryImpl(this.chatDataSource);
    }
    return this._chatRepository;
  }

  // Use Case Getters
  get userUseCase(): IUserUseCase {
    if (!this._userUseCase) {
      this._userUseCase = new UserUseCaseImpl(this.userRepository);
    }
    return this._userUseCase;
  }

  get esporteUseCase(): IEsporteUseCase {
    if (!this._esporteUseCase) {
      this._esporteUseCase = new EsporteUseCaseImpl(this.esporteRepository);
    }
    return this._esporteUseCase;
  }

  get eventoUseCase(): IEventoUseCase {
    if (!this._eventoUseCase) {
      this._eventoUseCase = new EventoUseCaseImpl(this.eventoRepository);
    }
    return this._eventoUseCase;
  }

  get produtoUseCase(): IProdutoUseCase {
    if (!this._produtoUseCase) {
      this._produtoUseCase = new ProdutoUseCaseImpl(this.produtoRepository);
    }
    return this._produtoUseCase;
  }

  get pedidoUseCase(): IPedidoUseCase {
    if (!this._pedidoUseCase) {
      this._pedidoUseCase = new PedidoUseCaseImpl(this.pedidoRepository);
    }
    return this._pedidoUseCase;
  }

  get inscricaoUseCase(): IInscricaoUseCase {
    if (!this._inscricaoUseCase) {
      this._inscricaoUseCase = new InscricaoUseCaseImpl(this.inscricaoRepository);
    }
    return this._inscricaoUseCase;
  }

  get mensagemUseCase(): IMensagemUseCase {
    if (!this._mensagemUseCase) {
      this._mensagemUseCase = new MensagemUseCaseImpl(this.mensagemRepository);
    }
    return this._mensagemUseCase;
  }

  get chatUseCase(): IChatUseCase {
    if (!this._chatUseCase) {
      this._chatUseCase = new ChatUseCaseImpl(this.chatRepository);
    }
    return this._chatUseCase;
  }

  // Controller Getters
  get userController(): UserController {
    if (!this._userController) {
      this._userController = new UserController(this.userUseCase);
    }
    return this._userController;
  }

  get esporteController(): EsporteController {
    if (!this._esporteController) {
      this._esporteController = new EsporteController(this.esporteUseCase);
    }
    return this._esporteController;
  }

  get eventoController(): EventoController {
    if (!this._eventoController) {
      this._eventoController = new EventoController(this.eventoUseCase);
    }
    return this._eventoController;
  }

  get lojaController(): LojaController {
    if (!this._lojaController) {
      this._lojaController = new LojaController(
        this.produtoUseCase,
        this.pedidoUseCase
      );
    }
    return this._lojaController;
  }

  get chatController(): ChatController {
    if (!this._chatController) {
      this._chatController = new ChatController(
        this.chatUseCase,
        this.mensagemUseCase
      );
    }
    return this._chatController;
  }

  get inscricaoController(): InscricaoController {
    if (!this._inscricaoController) {
      this._inscricaoController = new InscricaoController(this.inscricaoUseCase);
    }
    return this._inscricaoController;
  }

  // Method to reset container (useful for testing)
  reset(): void {
    // Reset all private instances to undefined
    this._userDataSource = undefined;
    this._esporteDataSource = undefined;
    this._eventoDataSource = undefined;
    this._produtoDataSource = undefined;
    this._pedidoDataSource = undefined;
    this._inscricaoDataSource = undefined;
    this._mensagemDataSource = undefined;
    this._chatDataSource = undefined;

    this._userRepository = undefined;
    this._esporteRepository = undefined;
    this._eventoRepository = undefined;
    this._produtoRepository = undefined;
    this._pedidoRepository = undefined;
    this._inscricaoRepository = undefined;
    this._mensagemRepository = undefined;
    this._chatRepository = undefined;

    this._userUseCase = undefined;
    this._esporteUseCase = undefined;
    this._eventoUseCase = undefined;
    this._produtoUseCase = undefined;
    this._pedidoUseCase = undefined;
    this._inscricaoUseCase = undefined;
    this._mensagemUseCase = undefined;
    this._chatUseCase = undefined;

    this._userController = undefined;
    this._esporteController = undefined;
    this._eventoController = undefined;
    this._lojaController = undefined;
    this._chatController = undefined;
    this._inscricaoController = undefined;
  }
}

// Export singleton instance
export const container = DIContainer.getInstance();
export default container;
