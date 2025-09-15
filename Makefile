# Cornflea Social - Docker Commands

.PHONY: help up down dev logs clean backup restore

# Default target
help:
	@echo "Cornflea Social Docker Commands"
	@echo "==============================="
	@echo "up       - Start PostgreSQL and Redis"
	@echo "down     - Stop all services"
	@echo "dev      - Start with development tools (pgAdmin + Redis Commander)"
	@echo "logs     - Show service logs"
	@echo "clean    - Stop and remove all data (WARNING: destructive)"
	@echo "backup   - Backup PostgreSQL database"
	@echo "restore  - Restore PostgreSQL database"
	@echo "ps       - Show running services"
	@echo "shell-pg - Connect to PostgreSQL shell"
	@echo "shell-redis - Connect to Redis shell"

# Start core services
up:
	docker-compose up -d
	@echo "✅ PostgreSQL and Redis are starting..."
	@echo "   PostgreSQL: localhost:5432"
	@echo "   Redis: localhost:6379"

# Stop all services
down:
	docker-compose down
	@echo "✅ All services stopped"

# Start with development tools
dev:
	docker-compose --profile dev up -d
	@echo "✅ All services starting including development tools..."
	@echo "   PostgreSQL: localhost:5432"
	@echo "   Redis: localhost:6379"
	@echo "   pgAdmin: http://localhost:8080 (admin@cornflea.com / admin)"
	@echo "   Redis Commander: http://localhost:8081"

# Show logs
logs:
	docker-compose logs -f

# Clean everything (destructive)
clean:
	@echo "⚠️  WARNING: This will delete all data!"
	@read -p "Are you sure? (y/N): " confirm && [ "$$confirm" = "y" ]
	docker-compose down -v
	docker-compose down --rmi local
	@echo "✅ All services and data removed"

# Show running services
ps:
	docker-compose ps

# PostgreSQL shell
shell-pg:
	docker-compose exec postgres psql -U postgres -d cornflea_social

# Redis shell
shell-redis:
	docker-compose exec redis redis-cli

# Backup database
backup:
	@mkdir -p backups
	docker-compose exec postgres pg_dump -U postgres cornflea_social > backups/cornflea_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "✅ Database backed up to backups/ directory"

# Restore database (requires BACKUP_FILE variable)
restore:
	@if [ -z "$(BACKUP_FILE)" ]; then echo "❌ Please specify BACKUP_FILE=path/to/backup.sql"; exit 1; fi
	docker-compose exec -T postgres psql -U postgres cornflea_social < $(BACKUP_FILE)
	@echo "✅ Database restored from $(BACKUP_FILE)"

# Health check
health:
	@echo "Checking service health..."
	@docker-compose exec postgres pg_isready -U postgres && echo "✅ PostgreSQL: Healthy" || echo "❌ PostgreSQL: Unhealthy"
	@docker-compose exec redis redis-cli ping > /dev/null && echo "✅ Redis: Healthy" || echo "❌ Redis: Unhealthy"
