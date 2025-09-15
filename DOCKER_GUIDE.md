# Docker Setup Guide

This guide explains how to use Docker Compose to run PostgreSQL and Redis for the Cornflea Social application.

## Quick Start

```bash
# Start PostgreSQL and Redis
docker-compose up -d

# Start with development tools (pgAdmin + Redis Commander)
docker-compose --profile dev up -d

# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: This will delete all data)
docker-compose down -v
```

## Services Included

### Core Services

#### PostgreSQL (Port 5432)
- **Image**: `postgres:15-alpine`
- **Database**: `cornflea_social`
- **Username**: `postgres`
- **Password**: `postgres`
- **Data persistence**: Named volume `postgres_data`

#### Redis (Port 6379)
- **Image**: `redis:7-alpine`
- **Configuration**: Custom config with persistence enabled
- **Data persistence**: Named volume `redis_data`

### Development Tools (Optional)

#### pgAdmin (Port 8080)
- **URL**: http://localhost:8080
- **Email**: admin@cornflea.com
- **Password**: admin
- **Profile**: `dev` (only starts with `--profile dev`)

#### Redis Commander (Port 8081)
- **URL**: http://localhost:8081
- **Profile**: `dev` (only starts with `--profile dev`)

## Usage Examples

### Basic Usage (Production-like)
```bash
# Start only PostgreSQL and Redis
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f postgres
docker-compose logs -f redis
```

### Development Usage (With GUI tools)
```bash
# Start all services including development tools
docker-compose --profile dev up -d

# Access pgAdmin at http://localhost:8080
# Access Redis Commander at http://localhost:8081
```

### Database Operations
```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U postgres -d cornflea_social

# Run SQL commands
docker-compose exec postgres psql -U postgres -d cornflea_social -c "SELECT version();"

# Backup database
docker-compose exec postgres pg_dump -U postgres cornflea_social > backup.sql

# Restore database
docker-compose exec -T postgres psql -U postgres cornflea_social < backup.sql
```

### Redis Operations
```bash
# Connect to Redis CLI
docker-compose exec redis redis-cli

# Monitor Redis commands
docker-compose exec redis redis-cli monitor

# Check Redis info
docker-compose exec redis redis-cli info
```

## Configuration Files

### docker-compose.yml
Main Docker Compose configuration with:
- Service definitions
- Network configuration
- Volume mappings
- Health checks
- Development profiles

### docker/postgres/init.sql
PostgreSQL initialization script that:
- Enables UUID extension
- Sets up initial database structure
- Can be customized for initial data

### docker/redis/redis.conf
Redis configuration with:
- Memory limits and policies
- Persistence settings
- Security configurations
- Performance tuning

## Data Persistence

All data is persisted using Docker named volumes:

- `postgres_data`: PostgreSQL database files
- `redis_data`: Redis data files
- `pgadmin_data`: pgAdmin configuration

### Backup Volumes
```bash
# Create backup of PostgreSQL data
docker run --rm -v cornflea-social_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup.tar.gz /data

# Restore PostgreSQL data
docker run --rm -v cornflea-social_postgres_data:/data -v $(pwd):/backup alpine tar xzf /backup/postgres_backup.tar.gz -C /
```

## Environment Variables

The application will automatically connect to the databases using these environment variables:

```env
# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=cornflea_social

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
```

## Troubleshooting

### Connection Issues
```bash
# Check if services are running
docker-compose ps

# Check service logs
docker-compose logs postgres
docker-compose logs redis

# Test PostgreSQL connection
docker-compose exec postgres pg_isready -U postgres

# Test Redis connection
docker-compose exec redis redis-cli ping
```

### Port Conflicts
If you have existing PostgreSQL or Redis installations:

```yaml
# Change ports in docker-compose.yml
services:
  postgres:
    ports:
      - "5433:5432"  # Use different host port
  redis:
    ports:
      - "6380:6379"  # Use different host port
```

Then update your `.env` file accordingly.

### Permission Issues
```bash
# Fix volume permissions (if needed)
docker-compose exec postgres chown -R postgres:postgres /var/lib/postgresql/data
```

## Production Considerations

For production deployment:

1. **Change default passwords**:
   ```yaml
   environment:
     POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
   ```

2. **Enable Redis authentication**:
   ```
   # In redis.conf
   requirepass your_secure_password
   ```

3. **Use external volumes**:
   ```yaml
   volumes:
     postgres_data:
       external: true
   ```

4. **Remove development profiles**:
   ```bash
   # Production compose file without dev tools
   docker-compose -f docker-compose.prod.yml up -d
   ```

5. **Add resource limits**:
   ```yaml
   deploy:
     resources:
       limits:
         memory: 1G
         cpus: '0.5'
   ```

## Integration with Application

After starting the services, your NestJS application will automatically connect to:
- PostgreSQL database for data persistence
- Redis for caching and job queues (when implemented)

Simply run your application:
```bash
npm run start:dev
```

The application will use the database and Redis instances provided by Docker Compose.
