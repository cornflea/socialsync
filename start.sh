#!/bin/bash

# Cornflea Social - Quick Start Script
# This script sets up the development environment with Docker

set -e

echo "🚀 Setting up Cornflea Social development environment..."
echo

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "   Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is available
if ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not available. Please update Docker."
    exit 1
fi

echo "✅ Docker is installed and ready"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created. Please review and update it if needed."
fi

# Start the services
echo "🐳 Starting PostgreSQL and Redis..."
docker compose up -d

echo "⏳ Waiting for services to be ready..."

# Wait for PostgreSQL
echo -n "   Waiting for PostgreSQL"
until docker compose exec postgres pg_isready -U postgres -d cornflea_social &> /dev/null; do
    echo -n "."
    sleep 2
done
echo " ✅"

# Wait for Redis
echo -n "   Waiting for Redis"
until docker compose exec redis redis-cli ping &> /dev/null; do
    echo -n "."
    sleep 1
done
echo " ✅"

echo
echo "🎉 Development environment is ready!"
echo
echo "Services running:"
echo "  📊 PostgreSQL: localhost:5432"
echo "  🔴 Redis: localhost:6379"
echo
echo "Next steps:"
echo "  1. Install dependencies: npm install"
echo "  2. Start the application: npm run start:dev"
echo
echo "Useful commands:"
echo "  • View logs: docker compose logs -f"
echo "  • Stop services: docker compose down"
echo "  • PostgreSQL shell: docker compose exec postgres psql -U postgres -d cornflea_social"
echo "  • Redis shell: docker compose exec redis redis-cli"
echo

# Install npm dependencies if package.json exists and node_modules doesn't
if [ -f package.json ] && [ ! -d node_modules ]; then
    echo "📦 Installing npm dependencies..."
    npm install
    echo "✅ Dependencies installed"
    echo
fi

echo "🚀 Ready to start developing!"
echo "   Run: npm run start:dev"
