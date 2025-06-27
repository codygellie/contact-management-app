const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const { initDatabase } = require('./src/config/database');
const contactRoutes = require('./src/routes/contact');

const app = express();
const server = http.createServer(app);

// Fixed CORS configuration for Socket.IO
const io = socketIo(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:5173", // Vite default port
      "http://localhost:4173", // Vite preview port
      process.env.CLIENT_URL
    ].filter(Boolean), // Remove any undefined values
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

const PORT = process.env.PORT || 5000;

app.use(helmet());

// Fixed CORS for Express
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:5173", // Vite default port
    "http://localhost:4173", // Vite preview port
    process.env.CLIENT_URL
  ].filter(Boolean),
  credentials: true
}));

app.use(express.json());

// Attach socket.io to request object
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Root route - API info
app.get('/', (req, res) => {
  res.json({
    message: 'Contact Management API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      contacts: '/api/contacts'
    },
    timestamp: new Date().toISOString(),
    connectedClients: io.engine.clientsCount
  });
});

// Routes
app.use('/api/contacts', contactRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    connectedClients: io.engine.clientsCount
  });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    availableRoutes: [
      'GET /',
      'GET /api/health',
      'GET /api/contacts',
      'POST /api/contacts',
      'PUT /api/contacts/:id',
      'DELETE /api/contacts/:id'
    ]
  });
});

app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Improved Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id} (Total: ${io.engine.clientsCount})`);
  
  // Send welcome message to confirm connection
  socket.emit('welcome', { 
    message: 'Connected to real-time updates',
    clientId: socket.id 
  });
  
  socket.on('disconnect', (reason) => {
    console.log(`Client disconnected: ${socket.id} (Reason: ${reason}) (Total: ${io.engine.clientsCount})`);
  });

  socket.on('error', (error) => {
    console.error(`Socket error for ${socket.id}:`, error);
  });
});

// Start server
async function startServer() {
  try {
    await initDatabase();
    
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API available at: http://localhost:${PORT}`);
      console.log(`Socket.io enabled for real-time updates`);
      console.log(`CORS enabled for frontend connections`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();