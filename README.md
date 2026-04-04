# Task Manager Backend

A robust Task Management API built with TypeScript, Node.js, Express, and Prisma. This project provides a complete backend for managing tasks, projects, and tags with JWT-based authentication.

## 🚀 Tech Stack

- **Languge**: TypeScript
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Containerization**: Docker & Docker Compose
- **Logging**: Winston & Morgan
- **Validation**: Zod
- **Authentication**: JWT & Bcryptjs

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18+)
- npm
- Docker & Docker Compose

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd task-manager
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Copy `.env.example` to `.env` (or create one) and configure your database and JWT settings.

4. Start the database:
   ```bash
   docker compose up -d
   ```

5. Run migrations:
   ```bash
   npx prisma migrate dev
   ```

### Running the App

- **Development Mode**:
  ```bash
  npm run dev
  ```
- **Production Mode**:
  ```bash
  npm run build
  npm start
  ```

## 🛣️ API Endpoints

### Authentication
- `POST /api/v1/user/register` - Create a new account
- `POST /api/v1/user/login` - Authenticate and get a JWT token

### Tasks
- `GET /api/v1/task` - Get all tasks (with filtering and pagination)
- `POST /api/v1/task` - Create a new task
- `GET /api/v1/task/:id` - Get task details
- `PATCH /api/v1/task/:id` - Update a task
- `DELETE /api/v1/task/:id` - Delete a task
- `PATCH /api/v1/task/:taskId/tags` - Add tags to a task
- `DELETE /api/v1/task/:taskId/tags/:tagId` - Remove a tag from a task

### Projects
- `GET /api/v1/project` - Get all projects
- `POST /api/v1/project` - Create a new project
- `GET /api/v1/project/:id` - Get project details
- `PATCH /api/v1/project/:id` - Update a project
- `DELETE /api/v1/project/:id` - Delete a project

### Tags
- `GET /api/v1/tags` - Get all tags
- `POST /api/v1/tags` - Create a new tag
- `DELETE /api/v1/tags/:id` - Delete a tag

## 📁 Project Structure

```text
src/
├── Config/      # Database, Cron, Winston configs
├── Controller/  # Request handlers
├── Error/       # Global error handler
├── Middleware/  # Auth, Validation middlewares
├── Router/      # Express routes
├── Schema/      # Zod validation schemas
├── services/    # Business logic
├── utils/       # Helpers (JWT, Email, etc.)
└── server.ts    # Entry point
```

## 📜 License

ISC
