# SecureFlow Backend API

A secure, RESTful backend API for managing notes, tasks, and workspaces.

## Tech Stack

- Node.js
- Express 5
- TypeScript
- Prisma ORM
- MySQL (or your database of choice)
- JWT Authentication
- bcrypt for password hashing
- Helmet for security
- CORS enabled
- Rate limiting

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL (or another database supported by Prisma)
- npm or yarn

### Installation

1. Navigate to the backend directory
   ```bash
   cd backend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   - Copy `.env.example` to `.env`
   - Update the database URL and JWT secret
   ```bash
   cp .env.example .env
   ```

4. Set up the database
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Start the development server
   ```bash
   npm run dev
   ```

## API Documentation

### Base URL
`http://localhost:5000/api`

### Authentication

All endpoints except `/auth/register` and `/auth/login` require a valid JWT token in the Authorization header:
```
Authorization: Bearer YOUR_TOKEN
```

### Endpoints

#### Auth
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login a user
- `GET /auth/me` - Get current user

#### Notes
- `GET /notes` - Get all notes
- `GET /notes/:id` - Get note by ID
- `POST /notes` - Create note
- `PUT /notes/:id` - Update note
- `DELETE /notes/:id` - Delete note
- `PATCH /notes/:id/archive` - Archive note
- `PATCH /notes/:id/trash` - Move to trash
- `PATCH /notes/:id/restore` - Restore from trash

#### Tasks
- `GET /tasks` - Get all tasks
- `GET /tasks/:id` - Get task by ID
- `POST /tasks` - Create task
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task

#### Workspaces
- `GET /workspaces` - Get all workspaces
- `GET /workspaces/:id` - Get workspace by ID
- `POST /workspaces` - Create workspace
- `POST /workspaces/:workspaceId/projects` - Create project in workspace

#### Dashboard
- `GET /dashboard/stats` - Get dashboard statistics

## Project Structure

```
backend/
├── src/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── lib/
│   ├── generated/
│   └── server.ts
├── prisma/
│   └── schema.prisma
├── .env
├── package.json
└── tsconfig.json
```
