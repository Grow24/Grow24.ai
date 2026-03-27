#!/bin/bash

# HBMP Tools - Forms Module Startup Script
# Starts both backend (port 3002) and frontend (port 5176)

set -e  # Exit on any error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend"
FRONTEND_DIR="$SCRIPT_DIR/frontend"

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}   HBMP Tools - Forms Module Startup${NC}"
echo -e "${BLUE}================================================${NC}\n"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo -e "${YELLOW}Please install Node.js from https://nodejs.org/${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js detected: $(node --version)${NC}"
echo -e "${GREEN}✓ npm detected: $(npm --version)${NC}\n"

# Function to check if port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  Port $port is already in use${NC}"
        echo -e "${YELLOW}   Kill the process using: lsof -ti:$port | xargs kill -9${NC}"
        return 1
    fi
    return 0
}

# Check ports
echo -e "${BLUE}Checking ports...${NC}"
check_port 3002 || exit 1
check_port 5176 || exit 1
echo -e "${GREEN}✓ Ports 3002 and 5176 are available${NC}\n"

# Check backend dependencies
echo -e "${BLUE}Checking backend dependencies...${NC}"
cd "$BACKEND_DIR"

if [ ! -f ".env" ]; then
    echo -e "${RED}❌ Backend .env file not found${NC}"
    echo -e "${YELLOW}Please create .env file from .env.example and add your credentials${NC}"
    exit 1
fi

if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing backend dependencies...${NC}"
    npm install
else
    echo -e "${GREEN}✓ Backend dependencies found${NC}"
fi

# Check frontend dependencies
echo -e "\n${BLUE}Checking frontend dependencies...${NC}"
cd "$FRONTEND_DIR"

if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing frontend dependencies...${NC}"
    npm install
else
    echo -e "${GREEN}✓ Frontend dependencies found${NC}"
fi

# Create log directory
LOG_DIR="$SCRIPT_DIR/logs"
mkdir -p "$LOG_DIR"

# Start backend
echo -e "\n${BLUE}Starting backend server on port 3002...${NC}"
cd "$BACKEND_DIR"
npm start > "$LOG_DIR/backend.log" 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}✓ Backend started (PID: $BACKEND_PID)${NC}"

# Wait for backend to be ready
echo -e "${YELLOW}Waiting for backend to be ready...${NC}"
sleep 3

# Check if backend is running
if ! ps -p $BACKEND_PID > /dev/null; then
    echo -e "${RED}❌ Backend failed to start${NC}"
    echo -e "${YELLOW}Check logs at: $LOG_DIR/backend.log${NC}"
    tail -n 20 "$LOG_DIR/backend.log"
    exit 1
fi

# Start frontend
echo -e "\n${BLUE}Starting frontend server on port 5176...${NC}"
cd "$FRONTEND_DIR"
npm run dev > "$LOG_DIR/frontend.log" 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}✓ Frontend started (PID: $FRONTEND_PID)${NC}"

# Wait for frontend to be ready
echo -e "${YELLOW}Waiting for frontend to be ready...${NC}"
sleep 3

# Check if frontend is running
if ! ps -p $FRONTEND_PID > /dev/null; then
    echo -e "${RED}❌ Frontend failed to start${NC}"
    echo -e "${YELLOW}Check logs at: $LOG_DIR/frontend.log${NC}"
    tail -n 20 "$LOG_DIR/frontend.log"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# Success message
echo -e "\n${GREEN}================================================${NC}"
echo -e "${GREEN}   ✓ Forms Module Started Successfully!${NC}"
echo -e "${GREEN}================================================${NC}\n"

echo -e "${BLUE}Backend:${NC}  http://localhost:3002"
echo -e "${BLUE}Frontend:${NC} http://localhost:5176"
echo -e "${BLUE}Logs:${NC}     $LOG_DIR\n"

echo -e "${YELLOW}Backend PID:  $BACKEND_PID${NC}"
echo -e "${YELLOW}Frontend PID: $FRONTEND_PID${NC}\n"

echo -e "${BLUE}To stop the servers:${NC}"
echo -e "  kill $BACKEND_PID $FRONTEND_PID\n"

echo -e "${BLUE}Or use:${NC}"
echo -e "  pkill -f 'node.*server.js'"
echo -e "  pkill -f 'vite.*forms/frontend'\n"

echo -e "${GREEN}Opening browser...${NC}"
sleep 2

# Open browser (macOS)
if command -v open &> /dev/null; then
    open http://localhost:5176
elif command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:5176
else
    echo -e "${YELLOW}Please open http://localhost:5176 in your browser${NC}"
fi

# Keep script running and show logs
echo -e "\n${BLUE}Showing live logs (Ctrl+C to stop):${NC}\n"
trap "echo -e '\n${YELLOW}Stopping servers...${NC}'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM

# Tail both logs
tail -f "$LOG_DIR/backend.log" "$LOG_DIR/frontend.log"
