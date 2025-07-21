// src/index.ts
import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
// import userRoutes from './routes/userRoutes'; 
import authRoutes from './routes/authRoutes';
import exerciseRoutes from './routes/exerciseRoutes';
import friendRoutes from './routes/friendsRoutes';
import ingredientRoutes from './routes/ingredientRoutes';
import mealRoutes from './routes/mealRoutes';
import workoutRoutes from './routes/workoutRoutes';
import workoutExerciseRoutes from './routes/workoutExerciseRoutes';
import calendarRoutes from './routes/calenderRoutes';
import weightRoutes from './routes/weightRoutes';
import mealIngredientsRoutes from './routes/mealIngredientsRoutes';
import { setupSocketIO } from './socket';
import { errorHandler } from './middleware/errorMiddleware';

dotenv.config();

const app = express();
// Express is wrapped with an HTTP server (http.createServer) to use the same server for both HTTP and WebSocket.
const server = http.createServer(app);

// Initialize Socket.IO server
// Socket.IO server (new Server(server)) is configured with CORS allowing your app to connect.
export const io = new Server(server, {
  cors: {
    origin: '*', // React Native Expo default origin or app URL
    methods: ['GET', 'POST'],
    credentials: false,
  },
});

// Enable CORS middleware for REST API
app.use(cors({
  origin: '*', // Same as above
  credentials: false,
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes); 
app.use('/api/exercises', exerciseRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/ingredients', ingredientRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/meal-ingredients', mealIngredientsRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/workout-exercises', workoutExerciseRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/weights', weightRoutes);

app.use(errorHandler)

// Health check route
app.get('/', (req, res) => {
  res.send('🚀 Gym App Backend Running');
});

// Socket.IO connection handling
setupSocketIO(io);

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Socket server running on http://0.0.0.0:${PORT}`);
});