# Task Tracker - Laravel 12 + React + Vite

A full-stack task management application built with Laravel 12 (backend API) and React 18 with Vite (frontend).

## Features

- User authentication with Laravel Sanctum
- Complete CRUD operations for tasks
- Task filtering by status, priority, and due date
- Responsive UI with Tailwind CSS
- RESTful API architecture
- PostgreSQL database
- Docker support

## Documentation

Detailed development guides are available in the `docs/` folder (excluded from git):

- **claude.md** - Comprehensive coding standards for Laravel 12 API and React + Vite
- **git-workflow.md** - Git best practices and commit workflow strategy
- **context.md** - Project requirements and exam context

> Note: The `docs/` folder is gitignored to keep internal documentation separate from the codebase.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### macOS Installation

#### 1. Install Homebrew (if not already installed)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

#### 2. Install PHP 8.3

```bash
# Install PHP 8.3
brew install php@8.3

# Link PHP 8.3
brew link php@8.3

# Verify installation
php -v
# Should show: PHP 8.3.x
```

#### 3. Install Composer

```bash
# Download and install Composer
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php composer-setup.php
php -r "unlink('composer-setup.php');"
sudo mv composer.phar /usr/local/bin/composer

# Verify installation
composer -V
# Should show: Composer version 2.x.x
```

#### 4. Install Node.js and npm

```bash
# Install Node.js (includes npm)
brew install node@20

# Verify installation
node -v
# Should show: v20.x.x

npm -v
# Should show: 10.x.x
```

#### 5. Install PostgreSQL

```bash
# Install PostgreSQL
brew install postgresql@16

# Start PostgreSQL service
brew services start postgresql@16

# Verify installation
psql --version
# Should show: psql (PostgreSQL) 16.x
```

#### 6. Create Database

```bash
# Access PostgreSQL
psql postgres

# Create database
CREATE DATABASE task_tracker;

# Create user (optional, or use default postgres user)
CREATE USER task_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE task_tracker TO task_user;

# Exit
\q
```

### Windows Installation

#### Using Chocolatey

```powershell
# Install Chocolatey (if not installed)
# Run PowerShell as Administrator

# Install PHP
choco install php

# Install Composer
choco install composer

# Install Node.js
choco install nodejs-lts

# Install PostgreSQL
choco install postgresql
```

#### Manual Installation

1. **PHP**: Download from [php.net](https://windows.php.net/download/)
2. **Composer**: Download from [getcomposer.org](https://getcomposer.org/download/)
3. **Node.js**: Download from [nodejs.org](https://nodejs.org/)
4. **PostgreSQL**: Download from [postgresql.org](https://www.postgresql.org/download/windows/)

### Linux (Ubuntu/Debian) Installation

```bash
# Update package list
sudo apt update

# Install PHP 8.3 and extensions
sudo apt install -y php8.3 php8.3-cli php8.3-fpm php8.3-pgsql php8.3-mbstring \
    php8.3-xml php8.3-curl php8.3-zip php8.3-gd php8.3-bcmath

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

## Quick Start

### Option 1: Manual Setup

#### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure .env file with your database credentials
# DB_CONNECTION=pgsql
# DB_HOST=127.0.0.1
# DB_PORT=5432
# DB_DATABASE=task_tracker
# DB_USERNAME=postgres
# DB_PASSWORD=your_password

# Run migrations
php artisan migrate

# Seed database with sample data
php artisan db:seed

# Start development server
php artisan serve
# Backend will run on http://localhost:8000
```

#### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Configure .env file
# VITE_API_URL=http://localhost:8000/api
# VITE_API_BASE_URL=http://localhost:8000

# Start development server
npm run dev
# Frontend will run on http://localhost:3000
```

### Option 2: Docker Setup

```bash
# Build and start all services
docker-compose up -d --build

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000/api
# PostgreSQL: localhost:5432
```

## Project Structure

```
task-tracker/
├── backend/                 # Laravel 12 API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   └── Api/
│   │   │   │       ├── TaskController.php
│   │   │   │       └── AuthController.php
│   │   │   ├── Requests/
│   │   │   │   ├── StoreTaskRequest.php
│   │   │   │   └── UpdateTaskRequest.php
│   │   │   └── Resources/
│   │   │       └── TaskResource.php
│   │   ├── Models/
│   │   │   ├── Task.php
│   │   │   └── User.php
│   │   ├── Policies/
│   │   │   └── TaskPolicy.php
│   │   └── Services/
│   │       └── TaskService.php
│   ├── database/
│   │   ├── migrations/
│   │   ├── factories/
│   │   └── seeders/
│   └── routes/
│       └── api.php
├── frontend/                # React + Vite
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   └── tasks/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── utils/
│   └── package.json
├── docker-compose.yml
├── README.md
└── claude.md              # Development standards guide
```

## API Endpoints

### Authentication

```
POST   /api/login           # Login user
POST   /api/logout          # Logout user
GET    /api/user            # Get authenticated user
```

### Tasks

```
GET    /api/tasks           # Get all tasks (with filters)
POST   /api/tasks           # Create new task
GET    /api/tasks/{id}      # Get specific task
PUT    /api/tasks/{id}      # Update task
DELETE /api/tasks/{id}      # Delete task
GET    /api/tasks/statistics # Get task statistics
```

### Query Parameters (GET /api/tasks)

- `status`: pending, in_progress, completed, cancelled
- `priority`: 0 (low), 1 (medium), 2 (high)
- `due_date`: YYYY-MM-DD
- `overdue`: true/false
- `sort_by`: created_at, due_date, priority, status
- `sort_order`: asc, desc
- `per_page`: Number of items per page (default: 15)

## API Documentation

Interactive API documentation is automatically generated using **Scramble** and available at:

**http://localhost:8000/docs/api**

The documentation includes:
- All available endpoints with request/response examples
- Authentication requirements (Bearer token)
- Request body schemas (auto-detected from FormRequests)
- Response schemas (auto-detected from API Resources)
- Interactive "Try it out" feature to test endpoints directly in the browser

**Features:**
- Zero configuration - automatically scans routes, controllers, and Form Requests
- OpenAPI/Swagger standard format
- Sanctum authentication integration
- Real-time updates when code changes

**Example Usage:**
1. Start the Laravel server: `php artisan serve`
2. Open http://localhost:8000/docs/api in your browser
3. Explore endpoints and test them with the "Try it out" button

## Environment Variables

### Backend (.env)

```env
APP_NAME="Task Tracker"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=task_tracker
DB_USERNAME=postgres
DB_PASSWORD=your_password

FRONTEND_URL=http://localhost:3000

SANCTUM_STATEFUL_DOMAINS=localhost:3000,127.0.0.1:3000
SESSION_DRIVER=cookie
SESSION_DOMAIN=localhost
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:8000/api
VITE_API_BASE_URL=http://localhost:8000
```

## Testing

### Backend Tests

```bash
cd backend
php artisan test
```

### Frontend Tests

```bash
cd frontend
npm run test
```

## Troubleshooting

### CORS Errors

Ensure your Laravel `.env` has the correct `FRONTEND_URL` and that `config/cors.php` is properly configured.

### Database Connection Failed

- Verify PostgreSQL is running: `brew services list` (macOS)
- Check database credentials in `.env`
- Test connection: `psql -U postgres -d task_tracker`

### Port Already in Use

- Laravel: Change port with `php artisan serve --port=8001`
- React: Vite will auto-increment to next available port (e.g., 3001)

### Authentication Issues

- Clear Laravel cache: `php artisan config:clear`
- Ensure Sanctum is properly configured
- Check `withCredentials: true` in Axios configuration

## Development Resources

- [Laravel 12 Documentation](https://laravel.com/docs/12.x)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Laravel Sanctum](https://laravel.com/docs/12.x/sanctum)

## License

This project is for educational purposes.

## Sample Login Credentials

After seeding the database, you can use any of the generated users:

```
Email: test@example.com
Password: password
```

(Check `database/seeders/DatabaseSeeder.php` for more users)
