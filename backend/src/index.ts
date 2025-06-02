// src/index.ts
import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import userRoutes from './routes/userRoutes'; // optional now, but ready for later
import authRoutes from './routes/auth';

dotenv.config();

const app = express();
// Express is wrapped with an HTTP server (http.createServer) to use the same server for both HTTP and WebSocket.
const server = http.createServer(app);

// Initialize Socket.IO server
// Socket.IO server (new Server(server)) is configured with CORS allowing your app to connect.
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:19006'], // React Native Expo default origin or app URL
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Enable CORS middleware for REST API
app.use(cors({
  origin: ['http://localhost:19006'], // Same as above
  credentials: true,
}));

app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes); // Assuming you have auth routes set up

// Health check route
app.get('/', (req, res) => {
  res.send('🚀 Gym App Backend Running');
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A user connected, socket id:', socket.id);

  // You can listen for events here
  socket.on('ping', () => {
    socket.emit('pong');
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});