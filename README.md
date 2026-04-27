# Users Service

REST API for user management. Test task implementation for a Junior Node.js Developer position.

## Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express
- **Database:** PostgreSQL 16
- **ORM:** TypeORM (with migrations)
- **Auth:** JWT (jsonwebtoken) + bcrypt
- **Validation:** class-validator + class-transformer
- **Container:** Docker Compose

## Features

- User registration and authentication
- JWT-based authorization
- Role-based access control (admin / user)
- Ownership check (users can only manage their own data)
- User blocking (by admin or self)
- Input validation via DTOs
- Database migrations
- Global error handler

## Project Structure

```
src/
├── common/              Shared components
│   ├── exceptions/      Custom HTTP exceptions
│   ├── middleware/      Auth, role, validation, error-handler
│   └── utils/           Shared utilities
├── config/              Configuration (env, TypeORM DataSource)
├── database/
│   └── migrations/      TypeORM migrations
├── modules/             Feature-based modules
│   ├── auth/            Registration / login logic
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── services/
│   └── users/           User management
│       ├── controllers/
│       ├── dto/
│       ├── entities/
│       ├── enums/
│       ├── repositories/
│       ├── routes/
│       └── services/
├── composition.ts       Composition root (manual DI)
└── main.ts              Entry point
```

## Getting Started

### Prerequisites

- Node.js 20+
- Docker + Docker Compose

### Steps

```bash
# 1. Clone the repository
git clone <repo-url>
cd users-service-test

# 2. Install dependencies
npm ci

# 3. Create .env file (defaults are suitable for local development)
cp .env.example .env

# 4. Start PostgreSQL via Docker
docker compose up -d

# 5. Run migrations
npm run migration:run

# 6. Start the dev server
npm run dev
```

The server runs at `http://localhost:3000`.

Health check: `GET http://localhost:3000/health`

## Endpoints

All endpoints are prefixed with `/api`.

### Auth

| Method | Endpoint            | Auth | Description                          |
|--------|---------------------|------|--------------------------------------|
| POST   | /api/auth/register  | —    | Register a new user                  |
| POST   | /api/auth/login     | —    | Log in, returns a JWT                |

### Users

| Method | Endpoint              | Auth          | Description                       |
|--------|-----------------------|---------------|-----------------------------------|
| GET    | /api/users            | admin         | List all users                    |
| GET    | /api/users/:id        | admin or self | Get a user by ID                  |
| PATCH  | /api/users/:id/block  | admin or self | Block a user                      |

JWT must be provided in the `Authorization` header: `Bearer <token>`.

## Request Examples

### Register

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Islam Velikhanli",
    "birthDate": "1995-05-15",
    "email": "islam@test.com",
    "password": "SecurePass123"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "islam@test.com",
    "password": "SecurePass123"
  }'
```

### Get user by ID

```bash
curl http://localhost:3000/api/users/<user-id> \
  -H "Authorization: Bearer <token>"
```

### List all users (admin only)

```bash
curl http://localhost:3000/api/users \
  -H "Authorization: Bearer <admin-token>"
```

### Block a user

```bash
curl -X PATCH http://localhost:3000/api/users/<user-id>/block \
  -H "Authorization: Bearer <token>"
```

## Architecture Notes

### Feature-based structure

Modules are organized by feature (`auth`, `users`) rather than by technical layer. Each module is self-contained and includes its own controllers, services, repositories, and DTOs. This makes navigation simpler and the project easier to scale.

### Layers within a module

```
Route → Middleware → Controller → Service → Repository → DB
```

- **Controller** — thin layer that parses the request and delegates to the service
- **Service** — contains all business logic, validation rules, and ownership checks
- **Repository** — the only layer aware of TypeORM
- **DTO** — describes input data with validation decorators

### Authorization

Authorization is implemented at two levels:

1. **Role-based** — handled by the `authorizeRoles(...)` middleware. Used for simple rules like "admin only".
2. **Ownership-based** — handled inside the service via `assertOwnershipOrAdmin()`. Used for rules like "admin or resource owner", which require access to the entity itself.

### Password security

- Hashing via bcrypt (10 rounds by default)
- The `password` field on the entity has `select: false`, so it isn't returned by default queries
- Login uses a dedicated `findByEmailWithPassword` method with explicit `addSelect`
- Password comparison uses `bcrypt.compare` (constant-time, protects against timing attacks)
- Identical "Invalid credentials" message for both non-existent email and wrong password (mitigates user enumeration)

### Dependency Injection

DI is implemented manually via a composition root (`src/composition.ts`). This keeps the dependency graph explicit and makes services easier to unit-test. In a production project, this would typically be replaced by a DI framework (e.g. tsyringe or InversifyJS), but for a test task a manual setup is sufficient and arguably more transparent.

### Migrations

`synchronize: false` is set on the TypeORM DataSource. All schema changes go through migrations — the production-grade approach.

## Scripts

```bash
npm run dev               # Run in dev mode with auto-reload
npm run build             # Compile to dist/
npm run start             # Run compiled output

npm run migration:generate -- src/database/migrations/<Name>
npm run migration:run
npm run migration:revert

npm run format            # Format with Prettier
```
