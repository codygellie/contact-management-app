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
    origin: '*',},
});

const PORT = process.env.PORT || 4001;

app.use(helmet());

// Fixed CORS for Express
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:5173", 
    "http://localhost:4173", 
    "http://10.10.8.27:5000",
    "http://10.10.8.27:3000",
    "http://10.10.8.27:5173",
    /^http:\/\/10\.\d+\.\d+\.\d+:\d+$/,
    /^https:\/\/.*\.ngrok-free\.app$/,
    /^https:\/\/.*\.ngrok\.io$/,
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
    
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Socket.io enabled for real-time updates`);
      console.log(`CORS enabled for frontend connections (including network IPs)`);
      console.log(`Server listening on all network interfaces (0.0.0.0)`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();