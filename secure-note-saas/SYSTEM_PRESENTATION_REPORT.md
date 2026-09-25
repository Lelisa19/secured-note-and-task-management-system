# SecureFlow: Secure Note and Task Management System

## 1. Executive Summary

SecureFlow is a SaaS web application for securely storing notes, organizing personal tasks, and collaborating with other users in shared workspaces. It combines private productivity tools with team project coordination and platform administration.

The system is designed around three needs:

1. **Personal organization:** users can create, search, tag, favorite, archive, restore, and delete notes; manage tasks; set reminders; and review activity.
2. **Secure collaboration:** users can create workspaces, invite members, create projects, share notes, assign tasks, manage files, and review workspace activity.
3. **Platform administration:** administrators can monitor users, workspaces, subscriptions, payments, support tickets, announcements, reports, and security logs.

The product name used in the backend is **SecureFlow**. The repository folder and project description refer to a secure note and task management system.

## 2. Problem Statement

People often keep notes, task lists, project information, and sensitive reminders in separate tools. This makes it difficult to maintain a consistent security model, understand work progress, and collaborate without exposing private information.

SecureFlow addresses this by providing one authenticated platform where:

- private notes and tasks remain associated with their owner;
- workspace data is visible only to authorized workspace members;
- tasks can be connected to projects and assigned to members;
- notes can be marked as encrypted and managed through lifecycle states;
- administrators can monitor the health and security of the platform.

## 3. Main Objectives

- Provide a simple dashboard for everyday productivity.
- Protect user accounts and API resources through authentication and authorization.
- Separate personal data from collaborative workspace data.
- Support structured teamwork through members, roles, projects, and assigned tasks.
- Track important actions through activity and security logs.
- Give administrators operational visibility over the SaaS platform.
- Provide a scalable separation between the React frontend, Express API, and relational database.

## 4. Target Users and Roles

### 4.1 Regular User

A regular user can:

- register and log in;
- manage their profile;
- create and maintain personal notes;
- create and manage personal tasks;
- mark notes or tasks as favorites;
- create or join workspaces;
- accept or reject invitations;
- collaborate with workspace members;
- view reminders, notifications, activity, and security history;
- manage subscription and billing information through the application UI.

### 4.2 Workspace Owner

The owner is the user who creates a workspace. The owner can:

- update workspace details;
- invite members by email;
- remove members;
- create projects;
- manage workspace roles;
- control workspace settings;
- view workspace notes, tasks, files, projects, analytics, and activity.

The backend enforces owner-only access for workspace updates. New workspaces receive default Owner, Member, and Guest roles.

### 4.3 Workspace Member

An active member can access the workspaces to which they belong. Their capabilities depend on their workspace role. The default Member role can create and edit notes and manage tasks, but cannot delete notes, manage members, or change settings.

### 4.4 Workspace Guest

The default Guest role is intended for limited visibility. It has no create, edit, delete, task-management, member-management, or settings-management permissions in the default role definition.

### 4.5 Platform Administrator

An administrator is a user whose global role is `ADMIN`. Admin API routes require both a valid JWT and the administrator role. Administrators can access:

- platform overview and statistics;
- user management and role changes;
- workspace management;
- subscription management;
- announcements;
- support tickets;
- payment records;
- security logs;
- analytics, reports, and system settings through the admin interface.

## 5. Dashboard Purposes

### 5.1 User Dashboard

The user dashboard is the main personal productivity area. It summarizes:

- total active personal notes;
- completed personal tasks;
- upcoming tasks;
- the number of active workspace memberships;
- recently created notes;
- upcoming tasks;
- recent user activity.

The dashboard also provides access to reminders, favorites, notifications, profile, security, billing, subscription, and settings pages.

### 5.2 Notes Dashboard

The Notes area is used to manage personal notes. It supports:

- grid and list views;
- text search across note titles and content;
- folder-style filters such as All Notes, Work, Personal, and Favorites;
- tag filtering;
- note creation and editing;
- tags;
- favorite toggling;
- moving notes to trash;
- archive and restore lifecycle operations;
- an encrypted-note flag.

Notes have the statuses `ACTIVE`, `ARCHIVED`, and `TRASHED`. Personal notes are distinguished from workspace notes by a nullable workspace relationship.

### 5.3 Task Dashboard

The Tasks area is used to create, update, delete, and organize tasks. A task can contain:

- title and description;
- priority: Low, Medium, or High;
- status: To Do, In Progress, Done, or Archived;
- due date;
- optional workspace;
- optional project;
- optional assignee;
- reminders and favorites.

### 5.4 Workspace Dashboard

A workspace dashboard is the collaboration area for a team, class, department, or project group. It brings together:

- workspace overview and statistics;
- workspace notes;
- team tasks;
- projects;
- members;
- roles and permissions;
- shared notes;
- files;
- activity logs;
- workspace analytics;
- workspace billing and settings.

Workspace access is checked by ownership or active membership. This prevents a user from reading another workspace simply by knowing its identifier.

### 5.5 Admin Dashboard

The admin dashboard is the platform operations center. Its pages cover:

- overall platform overview;
- users management;
- workspaces management;
- analytics;
- reports;
- announcements;
- subscriptions;
- payments;
- support tickets;
- security logs;
- system settings.

This dashboard is intended for supervision of the SaaS product rather than day-to-day personal note-taking.

## 6. Main User Workflows

### 6.1 Registration and Login

1. A new user registers with an email address, full name, and password.
2. The backend hashes passwords with `bcryptjs` before storing them.
3. The user logs in through the authentication API.
4. The API returns a JWT containing the authenticated identity and role.
5. The frontend stores the authentication state and sends the token in the `Authorization: Bearer` header.
6. Protected routes use the token to load the current user and workspaces.

The frontend also includes screens for email verification, password recovery, and two-factor authentication. The current backend route list exposes registration, login, and current-user lookup; these additional screens should be treated as part of the product interface and verified against the final backend implementation before claiming them as fully operational.

### 6.2 Creating a Personal Note

1. The user opens Notes and selects Create Note.
2. The user enters a title, content, tags, and optionally enables the encrypted-note flag.
3. The frontend sends `POST /api/notes`.
4. The backend validates and stores the note under the authenticated user.
5. The note appears in the active notes list and can later be edited, favorited, archived, trashed, or restored.

### 6.3 Creating and Completing a Task

1. The user creates a task with a title, description, priority, and optional due date.
2. The task is stored as `TODO` by default.
3. The user can move it to `IN_PROGRESS` and then `DONE`.
4. A task can be linked to a workspace, project, assignee, reminder, or favorite.
5. Completed tasks contribute to the personal dashboard statistics.

### 6.4 Creating a Workspace

1. An authenticated user submits a workspace name and optional description.
2. The backend creates the workspace and associates the current user as owner and active member.
3. Default Owner, Member, and Guest roles are created.
4. The workspace becomes available in the context switcher.
5. The owner can invite members, create projects, and manage workspace resources.

### 6.5 Inviting a Member

1. The workspace owner or authorized user enters another user's email address.
2. The backend creates an inactive workspace membership.
3. The invited user sees the invitation in the workspace invitation area.
4. The user can accept the invitation, which activates membership, or reject it, which removes the pending membership.
5. Joining a workspace creates an activity record.

### 6.6 Collaborating on a Project

1. A workspace member with appropriate access creates a project.
2. Tasks are linked to the project and may be assigned to workspace members.
3. Workspace notes, tasks, projects, files, and activity are displayed together in the workspace dashboard.
4. The activity log provides a recent record of workspace actions.

## 7. Functional Modules

### Authentication and Identity

- Registration and login.
- Current-user lookup.
- JWT bearer authentication.
- Password hashing with bcrypt.
- User roles: `USER` and `ADMIN`.
- Verification and two-factor-related frontend screens.

### Notes

- Create, read, update, and delete.
- Active, archived, and trashed states.
- Tags and search.
- Favorites.
- Workspace association.
- Note sharing data model with optional share links and expiry dates.
- Encrypted-note indicator.

### Tasks

- Create, read, update, and delete.
- Priority and status management.
- Due dates and completion dates.
- Project, workspace, and assignee relationships.
- Favorites and reminders.

### Workspaces

- Workspace creation and listing.
- Owner and active-member access control.
- Invitations and membership lifecycle.
- Members and roles.
- Projects.
- Workspace notes and tasks.
- Files.
- Activity logs.
- Workspace settings and analytics interfaces.

### Notifications and Reminders

- User notifications with read/unread state.
- Task-linked reminders with scheduled times.
- Dashboard endpoints for listing, creating, deleting, and marking notifications read.

### Administration and SaaS Operations

- User and workspace oversight.
- Subscription plans: Free, Basic, Pro, and Enterprise.
- Payments.
- Announcements.
- Support tickets.
- Security logs.
- Platform analytics and reports.

## 8. Technical Architecture

```text
React + TypeScript + Vite frontend
              |
              | HTTP/JSON with JWT Bearer token
              v
Express 5 + TypeScript REST API
              |
              | Prisma ORM
              v
MySQL/MariaDB relational database
```

### Frontend

The frontend is a React 19 application written in TypeScript and built with Vite. React Router provides routes for public pages, protected user dashboards, workspace dashboards, and admin pages. Tailwind CSS is used for styling.

Important frontend areas include:

- `App.tsx`: top-level route configuration;
- `AppContext.tsx`: current user, workspaces, invitations, loading, and logout state;
- `components/layout`: dashboard, workspace, admin, and context-switching layouts;
- `pages/dashboard`: personal productivity pages;
- `pages/workspace`: collaborative workspace pages;
- `pages/admin`: platform administration pages;
- `lib/api.ts`: API request and authentication integration.

### Backend

The backend is an Express 5 REST API written in TypeScript. It uses a layered structure:

- **Routes:** define HTTP endpoints and middleware.
- **Controllers:** translate HTTP requests into service calls and responses.
- **Services:** contain business logic and database operations.
- **Middleware:** authenticates JWTs and applies authorization checks.
- **Prisma client:** provides typed database access.
- **Validation utilities:** validate incoming data with Zod schemas.

### Database

Prisma models represent users, workspaces, members, roles, notes, note shares, tasks, projects, files, reminders, notifications, favorites, activity, security logs, subscriptions, payments, announcements, and support tickets.

Important relationships include:

- one user can own multiple workspaces;
- workspaces can have many members, roles, projects, notes, tasks, files, and activities;
- tasks can belong to projects and can be assigned to users;
- notes and tasks can be favorited;
- reminders can be linked to tasks;
- users can have one subscription and many payments or support tickets.

## 9. API Overview

Base URL during development: `http://localhost:5000/api`

### Authentication

- `POST /auth/register` - create an account
- `POST /auth/login` - authenticate a user
- `GET /auth/me` - return the current authenticated user

### Notes

- `GET /notes`
- `GET /notes/:id`
- `POST /notes`
- `PUT /notes/:id`
- `DELETE /notes/:id`
- `PATCH /notes/:id/archive`
- `PATCH /notes/:id/trash`
- `PATCH /notes/:id/restore`
- `POST /notes/:id/favorite`

### Tasks

- `GET /tasks`
- `GET /tasks/:id`
- `POST /tasks`
- `PUT /tasks/:id`
- `DELETE /tasks/:id`

### Dashboard

- `GET /dashboard/stats`
- `GET /dashboard/reminders`
- `POST /dashboard/reminders`
- `DELETE /dashboard/reminders/:id`
- `GET /dashboard/favorites`
- `GET /dashboard/notifications`
- `PATCH /dashboard/notifications/:id/read`
- `GET /dashboard/security-logs`
- `PUT /dashboard/profile`

### Workspaces

- `GET /workspaces`
- `GET /workspaces/:id`
- `POST /workspaces`
- `PUT /workspaces/:id`
- `GET /workspaces/invitations`
- `POST /workspaces/invitations/:membershipId/accept`
- `POST /workspaces/invitations/:membershipId/reject`
- `POST /workspaces/:workspaceId/members`
- `DELETE /workspaces/:workspaceId/members/:memberId`
- `GET/POST /workspaces/:workspaceId/projects`
- `GET /workspaces/:workspaceId/notes`
- `GET /workspaces/:workspaceId/tasks`
- `GET /workspaces/:workspaceId/activity`
- `GET/POST /workspaces/:workspaceId/roles`
- `GET/POST /workspaces/:workspaceId/files`
- `DELETE /workspaces/:workspaceId/files/:fileId`

### Admin

All admin endpoints require authentication and the `ADMIN` role:

- `GET /admin/stats`
- `GET /admin/users`
- `PATCH /admin/users/:id/role`
- `GET /admin/workspaces`
- `GET /admin/subscriptions`
- `GET /admin/announcements`
- `POST /admin/announcements`
- `GET /admin/tickets`
- `GET /admin/security-logs`
- `GET /admin/payments`

## 10. Security Design

The backend includes several security controls:

- JWT authentication for protected API routes.
- Database lookup during authentication so deleted users cannot continue using a valid token.
- bcrypt password hashing.
- Admin authorization middleware.
- Workspace owner/member access checks.
- Zod validation for selected input models.
- Helmet security headers.
- CORS configured for the frontend origin.
- Global rate limiting of up to 1,000 requests per 15-minute window.
- JSON request-size limit of 10 MB.
- Security log data containing user, action, IP address, user agent, and metadata.
- Cascading database relationships to keep related data consistent when owners or workspaces are removed.

Important presentation clarification: the note model stores an `isEncrypted` flag, which communicates that a note is intended to be protected, but the inspected code does not demonstrate client-side or server-side content encryption. For a security-focused presentation, describe this as an encryption feature indicator unless actual encryption/decryption logic is added and verified.

## 11. Development Setup

### Prerequisites

- Node.js 18 or newer.
- npm.
- MySQL or MariaDB database.
- Environment variables for database connection, JWT secret, and frontend URL.

### Backend

```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run dev
```

The API runs on port `5000` by default.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The Vite frontend normally runs on port `5173`.

### Optional database commands

```bash
npm run db:migrate
npm run db:seed
npm run db:studio
```

The seed script creates example administrator and regular-user accounts, subscriptions, workspaces, members, notes, tasks, a project, an announcement, a support ticket, a security log, and activity data. The seed file contains development credentials, so these credentials must never be used in production.

## 12. Suggested Presentation Demonstration

1. Open the landing page and explain the product goal.
2. Register or log in as a regular user.
3. Show the personal dashboard statistics and recent activity.
4. Create a note, add tags, mark it as encrypted, and favorite it.
5. Create a task, set its priority and due date, and move it through its statuses.
6. Create a workspace and explain the separation between personal and shared data.
7. Create a project and a workspace task.
8. Show members, invitations, roles, files, and activity logs.
9. Switch to an administrator account.
10. Demonstrate user management, subscriptions, support tickets, payments, announcements, and security logs.
11. Close by explaining how JWT, role checks, workspace access checks, rate limiting, Helmet, and bcrypt protect the system.

## 13. Strengths of the System

- Combines note-taking, task management, and collaboration in one product.
- Clearly separates personal data and workspace data.
- Uses role-based access at both platform and workspace levels.
- Includes a broad SaaS administration model.
- Uses a maintainable frontend/backend/database separation.
- Records activity and security events for accountability.
- Supports a realistic workspace workflow with invitations, projects, assignees, files, and permissions.

## 14. Current Limitations and Presentation Notes

The repository contains both functional API-backed pages and frontend pages that currently use local sample data or placeholder interactions. In particular, some administration and workspace settings screens appear to be interface prototypes rather than complete API integrations. The backend route list is the best source for confirmed server capabilities.

The following items should be verified or completed before presenting them as production-ready:

- actual encryption and decryption of note content;
- email verification, password reset, and two-factor backend flows;
- persistent functionality for every admin dashboard action;
- persistent functionality for workspace settings, roles, and billing UI controls;
- file upload storage and download handling;
- automated tests and production deployment configuration;
- production secrets, database credentials, CORS origins, and rate-limit tuning.

These limitations do not change the system's overall architecture. They identify the difference between the current working foundation, the implemented API capabilities, and frontend screens that still need integration.

## 15. Conclusion

SecureFlow is a secure productivity and collaboration platform built for users who need to manage sensitive notes and tasks while working individually or in teams. Its architecture supports a clear separation of responsibilities: React provides the user experience, Express exposes protected REST APIs, Prisma manages relational data, and MySQL/MariaDB stores the system records.

For a presentation, the central message is:

> SecureFlow brings secure personal knowledge management, task planning, workspace collaboration, and SaaS administration into one controlled platform.
