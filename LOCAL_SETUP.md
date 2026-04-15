# Local Development Setup Guide

This guide will help you set up and run UnitTCMS locally for development.

## Prerequisites

- **Node.js**: v20 or higher (v22.11.0 recommended)
- **PostgreSQL**: v15 or higher
- **npm**: v10 or higher

## Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd unittcms
```

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   Create a `.env` file in the `backend` folder (or update the existing one):
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=unittcms
   DB_USER=postgres
   DB_PASS=your_password
   SECRET_KEY=your_secret_key
   ```
4. Run migrations and seed the database:
   ```bash
   npm run migrate
   npm run seed
   ```
5. Start the backend server:
   ```bash
   npm start
   ```
   The backend will be running at `http://localhost:8001`.

### 3. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_BACKEND_ORIGIN=http://localhost:8001
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:8000`.

## Docker Alternative

If you prefer using Docker, you can start everything with a single command:

```bash
docker-compose up --build
```

This will start both the PostgreSQL database and the application.

## Troubleshooting

- **Port already in use**: If you see `EADDRINUSE`, ensure no other process is running on port 8000 (frontend) or 8001 (backend).
- **Database Connection**: Ensure your PostgreSQL server is running and the credentials in `.env` match your local setup.
- **ESM Errors**: The project uses ES Modules. All migrations and seeders under `backend/migrations` and `backend/seeders` should have the `.cjs` extension to work with the Sequelize CLI.
