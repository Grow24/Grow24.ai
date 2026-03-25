#!/bin/bash

# Excel Viewer Quick Start Script
# This script starts the Microsoft Graph Excel Viewer application

echo "🚀 Starting Microsoft Graph Excel Viewer..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

echo "✅ Starting server on http://localhost:5173"
echo ""
echo "📊 Available pages:"
echo "   - Home:        http://localhost:5173"
echo "   - Dashboard:   http://localhost:5173/dashboard.html"
echo "   - Excel Viewer: http://localhost:5173/excel.html"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the server
node server.js
