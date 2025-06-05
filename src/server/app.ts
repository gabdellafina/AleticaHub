// filepath: c:\Users\julio\Downloads\AtleticaHub-FrontEnd\AleticaHub\src\server\app.ts
// Server Application Entry Point - Wire all layers with Clean Architecture

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { container } from '../core/di';
import { createAPIRoutes } from '../layers/infrastructure/routes';
import { errorHandler, notFound } from '../layers/infrastructure/middlewares/ErrorMiddleware';

class App {
  public app: express.Application;
  private port: number;

  constructor(port: number = 3001) {
    this.app = express();
    this.port = port;
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          imgSrc: ["'self'", "data:", "https:", "blob:"],
          scriptSrc: ["'self'"],
          connectSrc: ["'self'", "https://api.atleticahub.com"],
        },
      },
    }));

    // CORS configuration
    this.app.use(cors({
      origin: process.env.NODE_ENV === 'production' 
        ? ['https://atleticahub.com', 'https://www.atleticahub.com']
        : ['http://localhost:3000', 'http://127.0.0.1:3000'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    }));

    // Compression
    this.app.use(compression());

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: process.env.NODE_ENV === 'production' ? 100 : 1000, // limit each IP to 100/1000 requests per windowMs
      message: 'Too many requests from this IP, please try again later.',
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use('/api', limiter);

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
      });
    });

    // API documentation endpoint
    this.app.get('/api', (req, res) => {
      res.json({
        message: 'AtleticaHub API',
        version: '1.0.0',
        endpoints: {
          users: '/api/users',
          esportes: '/api/esportes',
          eventos: '/api/eventos',
          loja: '/api/loja',
          chat: '/api/chat',
          inscricoes: '/api/inscricoes'
        },
        documentation: '/api/docs'
      });
    });
  }

  private initializeRoutes(): void {
    // Initialize API routes with dependency injection
    const apiRoutes = createAPIRoutes(container);
    this.app.use('/api', apiRoutes);
  }

  private initializeErrorHandling(): void {
    // 404 handler
    this.app.use(notFound);

    // Global error handler
    this.app.use(errorHandler);
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      console.log(`🚀 AtleticaHub API Server running on port ${this.port}`);
      console.log(`📖 API Documentation: http://localhost:${this.port}/api`);
      console.log(`❤️  Health Check: http://localhost:${this.port}/health`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  }

  public getApp(): express.Application {
    return this.app;
  }
}

export default App;
