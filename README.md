# Task Tracker - Laravel 12 + React + Vite

A modern full-stack task management application with Laravel 12 API backend and React 18 + TypeScript frontend.

## Features

### Backend (Laravel 12)
- 🔐 **Authentication** - Laravel Sanctum with rate limiting
- 📝 **CRUD Operations** - Complete task management (create, read, update, delete)
- 🔍 **Advanced Filtering** - Filter by status, priority, due date, with case-insensitive search
- 📊 **Task Statistics** - Dashboard analytics endpoint
- 🔒 **Authorization** - Policy-based access control
- 🧪 **Testing** - Comprehensive unit & feature tests (58 passing)
- 🗄️ **PostgreSQL** - Production-ready database with indexes
- 🎯 **Code Quality** - PHPStan level 5, Laravel Pint

### Frontend (React 18 + TypeScript)
- ⚡ **Vite** - Lightning-fast development server
- 🎨 **Shadcn UI** - Modern, accessible components with Tailwind CSS
- 🎯 **TypeScript** - Fully typed for type safety
- 🔄 **Optimistic Updates** - Instant UI feedback with rollback on error
- 📄 **Pagination** - Smart pagination with page number display
- 🔎 **Search & Filter** - Real-time search with highlighting, status tabs, priority filters
- 🎭 **Display Options** - Toggle task metadata visibility
- 📱 **Responsive Design** - Mobile-first approach
- 🧪 **Testing** - Vitest with jsdom (21 tests passing)
- 🪝 **Custom Hooks** - useAuth, useTasks, useOptimistic, useToast
- 🔧 **Code Quality** - ESLint, Prettier, Husky pre-commit hooks

## Tech Stack

**Backend:** Laravel 12, PostgreSQL, Sanctum, PHPUnit
**Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Vitest
**Tools:** Docker, Husky, ESLint, Prettier, PHPStan, Pint

## Quick Start

### Prerequisites
- PHP 8.3+
- Composer
- Node.js 20+
- PostgreSQL 16+

### Installation

```bash
# Clone repository
git clone <repository-url>
cd laravel-react-vite-task-tracker

# Backend setup
cd backend
composer install
cp .env.example .env
php artisan key:generate

# Configure .env with your database credentials
# Then run migrations and seed
php artisan migrate --seed
php artisan serve  # Runs on http://localhost:8000

# Frontend setup (in new terminal)
cd frontend
npm install
cp .env.example .env
npm run dev  # Runs on http://localhost:3000
```

### Docker Setup

```bash
docker-compose up -d --build
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
# API Docs: http://localhost:8000/docs/api
```

## Environment Configuration

### Backend `.env`
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=task_tracker
DB_USERNAME=postgres
DB_PASSWORD=your_password

FRONTEND_URL=http://localhost:3000
SANCTUM_STATEFUL_DOMAINS=localhost:3000
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:8000/api
VITE_API_BASE_URL=http://localhost:8000
```

## API Endpoints

### Authentication
```
POST   /api/register        # Register new user
POST   /api/login           # Login user
POST   /api/logout          # Logout user
GET    /api/user            # Get authenticated user
```

### Tasks
```
GET    /api/tasks           # List tasks (with filters)
POST   /api/tasks           # Create task
GET    /api/tasks/{id}      # Get task
PUT    /api/tasks/{id}      # Update task
DELETE /api/tasks/{id}      # Delete task
GET    /api/tasks/statistics # Get statistics
```

### Query Parameters
- `status`: pending, in_progress, completed
- `priority`: low, medium, high
- `search`: Case-insensitive text search
- `sort_by`: created_at, due_date, priority, status, title
- `sort_order`: asc, desc
- `page`: Page number
- `per_page`: Items per page (default: 15)

## Testing

```bash
# Backend tests
cd backend
php artisan test

# Frontend tests
cd frontend
npm run test

# Code quality
vendor/bin/pint           # Laravel Pint
vendor/bin/phpstan        # PHPStan
npm run lint              # ESLint
npm run format:check      # Prettier
```

## Project Structure

```
├── backend/              # Laravel 12 API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/  # TaskController, AuthController
│   │   │   ├── Requests/         # StoreTaskRequest, UpdateTaskRequest
│   │   │   └── Resources/        # TaskResource
│   │   ├── Models/               # Task, User
│   │   ├── Policies/             # TaskPolicy
│   │   └── Services/             # TaskService
│   ├── database/
│   │   ├── migrations/
│   │   ├── factories/
│   │   └── seeders/
│   └── tests/
├── frontend/             # React + TypeScript + Vite
│   ├── src/
│   │   ├── api/          # Axios client, API services
│   │   ├── components/   # Reusable components
│   │   ├── contexts/     # AuthContext, ToastContext
│   │   ├── hooks/        # useAuth, useTasks, useOptimistic
│   │   ├── pages/        # Dashboard, Login, Register
│   │   └── utils/        # Formatters, validators
│   └── tests/
└── docker-compose.yml
```

## Sample Credentials

After running `php artisan db:seed`:

```
Email: test@example.com
Password: password
```

## Troubleshooting

**CORS Issues:** Verify `FRONTEND_URL` in backend `.env`
**Database Connection:** Check PostgreSQL is running with `brew services list`
**Port Conflicts:** Use `php artisan serve --port=8001` or Vite will auto-increment
**Auth Issues:** Clear cache with `php artisan config:clear`

## License

Educational/Portfolio Project

---

Built with ❤️ using Laravel 12, React 18, TypeScript, and Vite
