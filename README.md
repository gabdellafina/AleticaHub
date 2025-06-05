# AtleticaHub - Athletic Club Management Platform

A comprehensive management platform for athletic clubs built with Clean Architecture principles, featuring Next.js frontend and Express.js API backend.

## 🏗️ Architecture Overview

This project follows **Clean Architecture** principles with clear separation of concerns:

```
src/
├── layers/
│   ├── data/           # Data Layer - External data sources
│   │   └── datasources/    # Firebase implementations
│   ├── domain/         # Domain Layer - Business logic
│   │   ├── repositories/   # Repository interfaces & implementations
│   │   └── usecases/      # Business use cases
│   ├── infrastructure/ # Infrastructure Layer - External frameworks
│   │   ├── api/           # Controllers, routes, middlewares
│   │   └── controllers/   # HTTP request handlers
│   └── presentation/   # Presentation Layer - React components & hooks
│       ├── components/    # React components
│       └── hooks/        # Custom React hooks
├── core/              # Core utilities
│   ├── di/           # Dependency injection
│   └── logging/      # Logging infrastructure
├── shared/           # Shared utilities
│   └── types/       # TypeScript types & interfaces
└── server/          # Express.js server entry point
```

## 🚀 Features

### Core Features
- **User Management** - Registration, authentication, role-based access
- **Sports Management** - Create and manage different sports categories
- **Event Management** - Schedule and manage athletic events
- **Store Management** - Sell athletic merchandise and equipment
- **Registration System** - Handle event and team registrations
- **Chat System** - Real-time communication between members
- **Admin Dashboard** - Comprehensive administrative controls

### Technical Features
- **Clean Architecture** - Maintainable and testable code structure
- **Type Safety** - Full TypeScript implementation
- **Real-time Updates** - Firebase real-time database integration
- **Authentication** - Firebase Auth with role-based permissions
- **API Documentation** - Comprehensive REST API
- **Error Handling** - Robust error management and logging
- **Testing** - Unit and integration tests with Jest
- **Security** - Helmet, CORS, rate limiting, input validation

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with SSR/SSG
- **React 19** - Latest React features
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework
- **React Icons** - Comprehensive icon library

### Backend
- **Express.js** - Web application framework
- **Firebase** - Backend-as-a-Service (Auth, Firestore)
- **Winston** - Professional logging library
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API protection

### Development Tools
- **ESLint** - Code linting
- **Jest** - Testing framework
- **TSX** - TypeScript execution

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/atleticahub.git
   cd atleticahub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your Firebase configuration
   ```

4. **Firebase setup**
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Authentication and Firestore
   - Add your configuration to `.env`

## 🔧 Development

### Start the development server
```bash
# Frontend (Next.js)
npm run dev

# Backend API (Express.js)
npm run server:dev

# Both simultaneously
npm run dev & npm run server:dev
```

### Available Scripts
```bash
# Frontend
npm run dev          # Start Next.js development server
npm run build        # Build for production
npm run start        # Start production server

# Backend
npm run server       # Start Express.js server
npm run server:dev   # Start server with hot reload
npm run server:build # Build server for production

# Testing
npm run test         # Run all tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report

# Code Quality
npm run lint         # Run ESLint
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - List users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin only)

### Sports
- `GET /api/esportes` - List all sports
- `POST /api/esportes` - Create sport (admin only)
- `PUT /api/esportes/:id` - Update sport (admin only)
- `DELETE /api/esportes/:id` - Delete sport (admin only)

### Events
- `GET /api/eventos` - List all events
- `GET /api/eventos/:id` - Get event by ID  
- `POST /api/eventos` - Create event (admin/moderator)
- `PUT /api/eventos/:id` - Update event
- `DELETE /api/eventos/:id` - Delete event

### Store
- `GET /api/loja/produtos` - List products
- `GET /api/loja/produtos/:id` - Get product by ID
- `POST /api/loja/produtos` - Create product (admin only)
- `POST /api/loja/pedidos` - Create order
- `GET /api/loja/pedidos` - List user orders

### Registrations
- `GET /api/inscricoes` - List registrations
- `POST /api/inscricoes` - Create registration
- `PUT /api/inscricoes/:id/status` - Update registration status

### Chat
- `GET /api/chat/chats` - List user chats
- `POST /api/chat/chats` - Create chat
- `GET /api/chat/chats/:id/mensagens` - Get chat messages
- `POST /api/chat/chats/:id/mensagens` - Send message

## 🧪 Testing

Run the test suite:
```bash
npm run test
```

Generate coverage report:
```bash
npm run test:coverage
```

## 🔒 Security

### Authentication & Authorization
- Firebase Authentication integration
- JWT token-based sessions
- Role-based access control (user, moderator, admin)
- Protected routes and API endpoints

### API Security
- Helmet for security headers
- CORS configuration
- Rate limiting (100 requests per 15 minutes)
- Input validation and sanitization
- Error handling without information leakage

## 📊 Monitoring & Logging

### Logging System
- Winston-based structured logging
- Daily log rotation
- Different log levels (error, warn, info, debug)
- Separate access logs
- Performance monitoring

## 🚀 Deployment

### Production Build
```bash
# Build frontend
npm run build

# Build backend  
npm run server:build
```

### Environment Variables
Ensure all production environment variables are set in `.env`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

**AtleticaHub** - Empowering athletic communities with modern technology 🏃‍♂️⚽🏀
