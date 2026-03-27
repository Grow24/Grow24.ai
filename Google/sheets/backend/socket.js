import { Server } from 'socket.io';
import { pubsub } from './pubsub.js';

/**
 * Initialize Socket.IO server and connect it to the pub/sub system
 * @param {object} httpServer - HTTP server instance from Express
 * @returns {object} Socket.IO server instance
 */
export function initializeSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: ["http://localhost:5175", "http://localhost:5176"],
      methods: ["GET", "POST"],
      credentials: true
    },
    transports: ['websocket', 'polling']
  });

  // Track connected clients
  let connectedClients = 0;

  io.on('connection', (socket) => {
    connectedClients++;
    console.log(`🔌 Client connected (${connectedClients} total) - Socket ID: ${socket.id}`);

    // Send welcome message
    socket.emit('connection:success', {
      message: 'Connected to HBMP Sheets real-time server',
      timestamp: new Date().toISOString()
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      connectedClients--;
      console.log(`❌ Client disconnected (${connectedClients} remaining)`);
    });

    // Allow clients to request immediate data refresh for a specific sheet
    socket.on('sheet:refresh', (data) => {
      console.log(`🔄 Client requested refresh for sheet: ${data.spreadsheetId}`);
      // Broadcast to all clients including sender
      io.emit('sheet.updated', {
        spreadsheetId: data.spreadsheetId,
        source: 'manual-refresh',
        timestamp: new Date().toISOString()
      });
    });
  });

  // Subscribe to pub/sub events and broadcast to all Socket.IO clients
  pubsub.onSheetUpdate((data) => {
    console.log(`📡 Broadcasting sheet.updated to ${connectedClients} client(s): ${data.spreadsheetId}`);
    io.emit('sheet.updated', data);
  });

  console.log('✅ Socket.IO server initialized with real-time pub/sub bridge');
  
  return io;
}
