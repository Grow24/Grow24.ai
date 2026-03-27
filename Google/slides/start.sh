#!/bin/bash

echo "🚀 Starting HBMP Slides Backend and Frontend..."
echo ""

# Start backend
echo "📡 Starting Backend Server (Port 3002)..."
cd backend
npm install
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 2

# Start frontend
echo "🎨 Starting Frontend Server (Port 5176)..."
cd frontend
npm install
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Both servers are starting..."
echo "📡 Backend: http://localhost:3002"
echo "🎨 Frontend: http://localhost:5176"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
