#!/bin/bash

echo "🛑 Stopping Solidity Visualizer services..."

# Stop server containers
echo "🖥️  Stopping server..."
docker compose down

# Stop database container
echo "📦 Stopping database..."
docker stop postgres-db 2>/dev/null || true
docker rm postgres-db 2>/dev/null || true

echo "✅ All services stopped successfully!" 