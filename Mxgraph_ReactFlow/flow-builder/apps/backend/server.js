const express = require('express');
const cors = require('cors');
const { createServer } = require('http');

const app = express();
const server = createServer(app);

// Middleware
app.use(express.json());
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:5173'] }));

// Setup Socket.io for real-time collaboration
try {
  const { Server } = require('socket.io');
  
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  const activeUsers = new Map();

  // Create namespaces for different collaboration types
  const flowNamespace = io.of('/flow');
  const whiteboardNamespace = io.of('/whiteboard');
  const docsNamespace = io.of('/docs');

  // Flow collaboration
  flowNamespace.on('connection', (socket) => {
    console.log('✅ Flow user connected:', socket.id);

    socket.on('user_join', ({ roomId, user }) => {
      console.log(`👤 User ${user.name} joined flow ${roomId}`);
      socket.join(roomId);
      
      if (!activeUsers.has(roomId)) {
        activeUsers.set(roomId, new Map());
      }
      
      activeUsers.get(roomId).set(socket.id, user);
      socket.to(roomId).emit('user_join', user);
      
      const currentUsers = Array.from(activeUsers.get(roomId).values());
      socket.emit('presence', currentUsers);
      socket.to(roomId).emit('presence', currentUsers);
    });

    socket.on('cursor', ({ roomId, cursor }) => {
      socket.to(roomId).emit('cursor', { socketId: socket.id, cursor });
    });

    socket.on('selection', ({ roomId, selection }) => {
      socket.to(roomId).emit('selection', { socketId: socket.id, selection });
    });

    socket.on('change', ({ roomId, payload }) => {
      socket.to(roomId).emit('change', payload);
    });

    socket.on('disconnect', () => {
      console.log('❌ Flow user disconnected:', socket.id);
      for (const [roomId, users] of activeUsers.entries()) {
        if (users.has(socket.id)) {
          const user = users.get(socket.id);
          users.delete(socket.id);
          socket.to(roomId).emit('user_leave', user);
          const remainingUsers = Array.from(users.values());
          socket.to(roomId).emit('presence', remainingUsers);
        }
      }
    });
  });

  // Whiteboard collaboration
  whiteboardNamespace.on('connection', (socket) => {
    console.log('✅ Whiteboard user connected:', socket.id);
    // Similar handlers for whiteboard
  });

  // Docs collaboration
  docsNamespace.on('connection', (socket) => {
    console.log('✅ Docs user connected:', socket.id);
    // Similar handlers for docs
  });

  console.log('✅ Socket.io server with namespaces initialized');
} catch (error) {
  console.log('⚠️ Socket.io not available:', error.message);
}

// Setup Yjs WebSocket server for document collaboration
try {
  const { setupWSConnection } = require('y-websocket/bin/utils');
  const WebSocket = require('ws');
  
  const wss = new WebSocket.Server({ 
    port: 3002,
    perMessageDeflate: {
      zlibDeflateOptions: {
        threshold: 1024,
        concurrencyLimit: 10,
      },
      threshold: 1024,
    }
  });
  
  wss.on('connection', setupWSConnection);
  console.log('✅ Yjs WebSocket server running on port 3002');
} catch (error) {
  console.log('⚠️ Yjs WebSocket server not available:', error.message);
}

// Basic API routes
app.get('/api/flows', (req, res) => {
  res.json([]);
});

app.post('/api/flows', (req, res) => {
  const flow = {
    id: Date.now(),
    name: req.body.name || 'Untitled Flow',
    nodes: req.body.nodes || [],
    edges: req.body.edges || []
  };
  res.status(201).json(flow);
});

app.get('/api/flows/:id', (req, res) => {
  res.json({
    id: parseInt(req.params.id),
    name: 'Test Flow',
    nodes: [],
    edges: []
  });
});

app.put('/api/flows/:id', (req, res) => {
  res.json({
    id: parseInt(req.params.id),
    name: req.body.name,
    nodes: req.body.nodes,
    edges: req.body.edges
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔌 WebSocket server running on ws://localhost:${PORT}`);
});