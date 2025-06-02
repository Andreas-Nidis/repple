// src/index.ts
import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import userRoutes from './routes/userRoutes'; 
import authRoutes from './routes/auth';
import exerciseRoutes from './routes/exerciseRoutes';
import { setupSocketIO } from './socket';

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
app.use('/api/auth', authRoutes); 
app.use('/api/exercises', exerciseRoutes);

// Health check route
app.get('/', (req, res) => {
  res.send('🚀 Gym App Backend Running');
});

// Socket.IO connection handling
setupSocketIO(io);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});