.PHONY: help backend-up backend-up-no-elk backend-down backend-clean-all backend-logs backend-clear-data backend-seed-data backend-reset-data backend-rebuild backend-restart

# Directories
BACKEND_DIR = backend
FRONTEND_DIR = frontend

help:
	@echo "=== Backend Commands ==="
	@echo "  make backend-up              - Start all backend services (including ELK stack)"
	@echo "  make backend-up-no-elk       - Start backend without ELK stack (MySQL, Redis, Backend)"
	@echo "  make backend-down            - Stop all backend containers"
	@echo "  make backend-logs            - Show backend application logs"
	@echo "  make backend-clear-data      - Clear database data (reset to schema only)"
	@echo "  make backend-seed-data       - Run seeding data into database"
	@echo "  make backend-reset-data      - Reset database to fresh seeded state"
	@echo "  make backend-rebuild         - Rebuild backend service only"
	@echo "  make backend-restart         - Restart backend service"
	@echo "  make backend-clean-all       - Remove all backend containers, volumes, and networks"
	@echo ""
	@echo "=== Frontend Commands ==="
	@echo "  make frontend-dev            - Start frontend development server"
	@echo "  make frontend-build          - Build frontend for production"
	@echo "  make frontend-install        - Install frontend dependencies"

# ============ Backend Commands ============

# Start all backend services including ELK
backend-up:
	@echo "Starting all backend services (including ELK)..."
	cd $(BACKEND_DIR) && docker-compose --profile elk up -d --build

# Start backend services without ELK
backend-up-no-elk:
	@echo "Starting backend services without ELK..."
	cd $(BACKEND_DIR) && docker-compose up -d --build mysql_db redis backend

# Stop all backend containers
backend-down:
	@echo "Stopping all backend containers..."
	cd $(BACKEND_DIR) && docker-compose --profile elk down

# Show backend logs
backend-logs:
	@echo "Showing backend logs (Ctrl+C to exit)..."
	cd $(BACKEND_DIR) && docker-compose logs -f backend

# Clear database data (keep schema)
backend-clear-data:
	@echo "Clearing database data..."
	cd $(BACKEND_DIR) && docker-compose exec mysql_db mysql -uroot -pyour_root_password auction_db -e "SET FOREIGN_KEY_CHECKS = 0; \
		SELECT CONCAT('TRUNCATE TABLE ', table_name, ';') FROM information_schema.tables WHERE table_schema = 'auction_db' INTO OUTFILE '/tmp/truncate.sql'; \
		SOURCE /tmp/truncate.sql; \
		SET FOREIGN_KEY_CHECKS = 1;"
	@echo "Database cleared. Schema preserved."

# Seed data into database
backend-seed-data:
	@echo "Seeding database..."
	cd $(BACKEND_DIR) && docker-compose exec -T mysql_db mysql -uroot -pyour_root_password auction_db < seeding.sql
	@echo "Database seeded successfully."

# Reset data (clear + seed)
backend-reset-data: backend-clear-data backend-seed-data
	@echo "Database reset to fresh seeded state."

# Clean everything (remove containers, volumes, networks)
backend-clean-all:
	@echo "Removing all backend containers, volumes, and networks..."
	cd $(BACKEND_DIR) && docker-compose --profile elk down -v --remove-orphans
	@echo "Cleanup complete."

# Rebuild backend only
backend-rebuild:
	@echo "Rebuilding backend service..."
	cd $(BACKEND_DIR) && docker-compose up -d --build --no-deps backend
	@echo "Backend rebuilt."

# Restart backend
backend-restart:
	@echo "Restarting backend service..."
	cd $(BACKEND_DIR) && docker-compose restart backend
	@echo "Backend restarted."

# ============ Frontend Commands ============

# Start frontend development server
frontend-dev:
	@echo "Starting frontend development server..."
	cd $(FRONTEND_DIR) && npm run dev

# Build frontend for production
frontend-build:
	@echo "Building frontend for production..."
	cd $(FRONTEND_DIR) && npm run build

# Install frontend dependencies
frontend-install:
	@echo "Installing frontend dependencies..."
	cd $(FRONTEND_DIR) && npm install
