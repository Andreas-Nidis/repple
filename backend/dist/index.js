"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
// src/index.ts
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const exerciseRoutes_1 = __importDefault(require("./routes/exerciseRoutes"));
const friendsRoutes_1 = __importDefault(require("./routes/friendsRoutes"));
const ingredientRoutes_1 = __importDefault(require("./routes/ingredientRoutes"));
const mealRoutes_1 = __importDefault(require("./routes/mealRoutes"));
const workoutRoutes_1 = __importDefault(require("./routes/workoutRoutes"));
const workoutExerciseRoutes_1 = __importDefault(require("./routes/workoutExerciseRoutes"));
const calenderRoutes_1 = __importDefault(require("./routes/calenderRoutes"));
const weightRoutes_1 = __importDefault(require("./routes/weightRoutes"));
const mealIngredientsRoutes_1 = __importDefault(require("./routes/mealIngredientsRoutes"));
const socket_1 = require("./socket");
const errorMiddleware_1 = require("./middleware/errorMiddleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
// Express is wrapped with an HTTP server (http.createServer) to use the same server for both HTTP and WebSocket.
const server = http_1.default.createServer(app);
// Initialize Socket.IO server
// Socket.IO server (new Server(server)) is configured with CORS allowing your app to connect.
exports.io = new socket_io_1.Server(server, {
    cors: {
        origin: '*', // React Native Expo default origin or app URL
        methods: ['GET', 'POST'],
        credentials: false,
    },
});
// CORS middleware for rejecting anything web based
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps)
        if (!origin) {
            return callback(null, true);
        }
        // Reject browser-based requests from unknown origins (dev/debug)
        return callback(new Error('CORS policy: This origin is not allowed'));
    },
    credentials: false, // Usually false unless you're sending cookies
}));
app.use(express_1.default.json());
// Routes
app.use('/api/users', userRoutes_1.default);
app.use('/api/auth', authRoutes_1.default);
app.use('/api/exercises', exerciseRoutes_1.default);
app.use('/api/friends', friendsRoutes_1.default);
app.use('/api/ingredients', ingredientRoutes_1.default);
app.use('/api/meals', mealRoutes_1.default);
app.use('/api/meal-ingredients', mealIngredientsRoutes_1.default);
app.use('/api/workouts', workoutRoutes_1.default);
app.use('/api/workout-exercises', workoutExerciseRoutes_1.default);
app.use('/api/calendar', calenderRoutes_1.default);
app.use('/api/weights', weightRoutes_1.default);
app.use(errorMiddleware_1.errorHandler);
// Health check route
app.get('/', (req, res) => {
    res.send('🚀 Gym App Backend Running');
});
// Socket.IO connection handling
(0, socket_1.setupSocketIO)(exports.io);
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Socket server running on http://0.0.0.0:${PORT}`);
});
