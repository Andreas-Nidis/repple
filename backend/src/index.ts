// src/index.ts
import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes'; // optional now, but ready for later

dotenv.config();

const app = express();
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);

// Health check route
app.get('/', (req, res) => {
  res.send('🚀 Gym App Backend Running');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});