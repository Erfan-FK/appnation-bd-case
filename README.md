# AppNation Backend Engineer Intern Case Study

Node.js/TypeScript backend service for weather data retrieval and user management.

Repository: [https://github.com/Erfan-FK/appnation-bd-case](https://github.com/Erfan-FK/appnation-bd-case)

## Table of Contents
- [Features](#features)
- [Architecture](#architecture)
- [Folder Structure](#folder-structure)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
- [Development Practices](#development-practices)

## Features
- User authentication (signup/login) with JWT
- Role-based authorization (User/Admin)
- Weather data retrieval and caching
- Historical weather queries for users
- Admin user management
- OpenAPI documentation (Swagger)

## Architecture

The Backend application follows a modular architecture with clear separations:

### Core Architectural Decisions

1. **Modular Structure**: The application is organized into feature modules (auth, user, weather, query) for better maintainability and scalability.

2. **Layered Architecture**: Each module follows a layered architecture pattern:
   - Controllers: Handle HTTP requests and responses
   - Services: Implement business logic
   - DTOs: Define data transfer objects for validation
   - Models: Defined using Prisma schema

3. **Middleware-Based Request Processing**: 
   - Authentication/Authorization: JWT-based security
   - Validation: Schema-based input validation
   - Error Handling: Centralized error processing

4. **Database Access**:
   - Prisma ORM for type-safe database operations
   - MySQL for relational data storage

5. **Caching Strategy**:
   - Redis for caching weather data to reduce external API calls
   - Improves performance and reduces third-party API usage

6. **Error Handling**:
   - Centralized error handling middleware
   - Structured error responses
   - Error logging for debugging

## Folder Structure

```
src/
├── app.ts                # Express application setup
├── server.ts             # Server initialization
├── config/               # Application configuration
├── docs/                 # API documentation
├── middleware/           # Application middleware
├── modules/              # Feature modules
│   ├── auth/             # Authentication
│   ├── user/             # User management
│   ├── weather/          # Weather service
│   └── query/            # Query history
├── prisma/               # Database client and models
└── utils/                # Utility functions
```

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Web Framework**: Express.js
- **Database**: MySQL
- **ORM**: Prisma
- **Caching**: Redis
- **Authentication**: JWT
- **Validation**: Zod
- **Documentation**: OpenAPI/Swagger
- **Containerization**: Docker
- **Package Manager**: PNPM

## Setup Instructions

### Prerequisites
- Docker and Docker Compose (for containerized setup)
- Node.js (v16+) and PNPM (for local development)

### Getting Started

1. **Clone the repository**:
   ```
   git clone https://github.com/Erfan-FK/appnation-bd-case.git
   cd appnation-bd-case
   ```

### Environment Configuration

1. **Create a `.env` file** in the root directory by copying the provided example:
   ```
   cp .env.example .env
   ```

2. **Configure environment variables**:
   ```
   # Server configuration
   PORT=3000
   NODE_ENV=development
   
   # Database and Redis URLs (for Docker setup)
   DATABASE_URL="mysql://root:root@mysql:3306/weather"
   REDIS_URL="redis://redis:6379"
   
   # API key for OpenWeatherMap
   API_KEY="your_openweather_api_key"  # Get from https://openweathermap.org/api
   
   # JWT Configuration
   JWT_SECRET="your_jwt_secret"  # Generate using the command below
   ```

3. **Generate a secure JWT secret** by running:
   ```
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

### Running with Docker

1. **Build and run the containers**:
   ```
   docker-compose up -d
   ```

2. **Check the running containers**:
   ```
   docker-compose ps
   ```

3. **Apply database migrations** (first time setup):
   ```
   docker-compose exec api npx prisma migrate deploy
   ```

4. **Access the API at**: `http://localhost:3000`

5. **Access API documentation at**: `http://localhost:3000/docs`

6. **Stop the containers**:
   ```
   docker-compose down
   ```

### Local Development Setup (without Docker)

1. **Install dependencies**:
   ```
   pnpm install
   ```

2. **Generate Prisma client**:
   ```
   pnpm prisma:generate
   ```

3. **Run database migrations**:
   ```
   pnpm prisma:migrate
   ```

4. **Start the development server**:
   ```
   pnpm run dev
   ```

### Available npm Scripts

The project includes several useful npm scripts:

- **Development**:
  - `pnpm run dev` - Run the server in development mode with hot reloading
  - `pnpm run build` - Build the TypeScript code to JavaScript
  - `pnpm run start` - Start the production server from built files

- **Database**:
  - `pnpm prisma:generate` - Generate Prisma client
  - `pnpm prisma:migrate` - Run database migrations
  - `pnpm prisma:studio` - Open Prisma Studio (database UI)

- **Documentation**:
  - `pnpm openapi:gen` - Generate OpenAPI documentation

- **Testing**:
  - `pnpm run test` - Run all tests
  - `pnpm run test:watch` - Run tests in watch mode
  - `pnpm run test:coverage` - Run tests with coverage report

## API Documentation

Detailed API documentation is available in two forms:

1. **Interactive Swagger UI**: Available at `/docs` endpoint when the server is running.

2. **Markdown Documentation**: Comprehensive API documentation can be found in the [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) file, which includes:
   - Authentication methods
   - Available endpoints
   - Request/response formats
   - Error handling information

### Key API Endpoints

- **Authentication**:
  - `/auth/signup` - Register a new user
  - `/auth/login` - Log in and receive JWT token

- **Weather**:
  - `/weather?city={cityName}` - Get current weather for a city
  - `/weather/history` - Get your weather search history

- **User Management (Admin)**:
  - `/users` - List all users
  - `/users/{id}` - Get, update, or delete a user

## Development Practices

### Error Handling

The application implements robust error handling:
- Service-level errors are caught and transformed into appropriate HTTP responses
- Controller routes use try/catch blocks to forward errors to the centralized error handler
- The error middleware formats errors consistently before sending responses

### Input Validation

All request inputs are validated using schema validation:
- DTOs define the shape of valid request data
- Validation middleware applies schemas to requests
- Early validation prevents invalid data from reaching business logic

### Authorization

Endpoints implement proper authorization:
- JWT-based authentication
- Role-based access control (User/Admin)
- Protected routes for sensitive operations
