#!/bin/bash

# HBMP Keep Start Script
echo "🎵 Starting HBMP Keep (Google Keep Notes)..."

# Check if both backend and frontend directories exist
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Error: backend or frontend directory not found"
    exit 1
fi

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping HBMP Keep..."
    kill $(jobs -p) 2>/dev/null
    exit
}

trap cleanup SIGINT SIGTERM

# Start backend
echo "🚀 Starting backend on port 3004..."
cd backend
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi
node server.js &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 2

# Start frontend
echo "🎨 Starting frontend on port 5178..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✨ HBMP Keep is running!"
echo "📱 Frontend: http://localhost:5178"
echo "🔌 Backend: http://localhost:3004"
echo "🎨 Theme: Yellow (#F59E0B)"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for background processes
wait
