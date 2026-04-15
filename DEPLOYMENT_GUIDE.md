# Deployment Guide

This guide provides instructions for deploying UnitTCMS in different environments.

## Deployment with Docker (Recommended)

Docker is the easiest way to deploy UnitTCMS in any environment (Staging, Production).

### 1. Prerequisites

- Docker and Docker Compose installed on the target server.

### 2. Configuration

Create a `docker-compose.yaml` (you can use the one in the root) and set the production environment variables:

```yaml
services:
  app:
    image: unittcms:latest
    environment:
      - PORT=8001
      - SECRET_KEY=generate_a_random_secure_key
      - DB_HOST=db
      - DB_NAME=unittcms
      - DB_USER=postgres
      - DB_PASS=strong_password
      - FRONTEND_ORIGIN=https://your-domain.com
    # ... other settings
```

### 3. Execution

```bash
docker-compose up -d
```

## Deployment on Bare Metal / VPS

### 1. Backend Deployment

- Use a process manager like **PM2** to keep the backend running.
- Use a reverse proxy like **Nginx** to handle SSL and forward requests to port 8001.

### 2. Frontend Deployment

- UnitTCMS uses Next.js. For production, you should build the app:
  ```bash
  cd frontend
  npm run build
  npm start
  ```
- Alternatively, you can deploy the frontend on Vercel or Netlify (ensure `NEXT_PUBLIC_BACKEND_ORIGIN` is correctly set).

## Environment Specifics

### Staging

- Use a dedicated staging database.
- Disable `IS_DEMO` if you don't want sample data.
- Enable detailed logging if needed.

### Production

- **Security**:
  - Change the default `SECRET_KEY`.
  - Use a strong password for PostgreSQL.
  - Ensure the database is not publicly accessible.
- **SSL**: Always use HTTPS via Nginx or a Load Balancer.
- **Backups**: Implement regular backups for the PostgreSQL database and the `backend/public/uploads` directory.

## Database Migration in Production

When updating the app, run migrations before starting the new version:

```bash
cd backend
npm run migrate
```
