#!/bin/bash

echo "🚀 Starting Solidity Visualizer services..."

# Check if docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Start database
echo "📦 Starting database..."
chmod +x start-database.sh
./start-database.sh

# Start server
echo "🖥️  Starting server..."
docker compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 5

# Initialize database schema
echo "🗄️  Initializing database schema..."
pnpm db:push

# Check if services are running
if docker compose ps | grep -q "Up"; then
    echo "✅ Server is running!"
    echo "🌐 Server is available at http://localhost:8000"
    echo "🗄️  Database is available at localhost:5432"
    echo "✅ Database schema initialized!"
else
    echo "❌ Something went wrong. Please check docker logs with: docker compose logs"
fi 