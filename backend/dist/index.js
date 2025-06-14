"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const auth_1 = __importDefault(require("./routes/auth"));
const exerciseRoutes_1 = __importDefault(require("./routes/exerciseRoutes"));
const socket_1 = require("./socket");
dotenv_1.default.config();
const app = (0, express_1.default)();
// Express is wrapped with an HTTP server (http.createServer) to use the same server for both HTTP and WebSocket.
const server = http_1.default.createServer(app);
// Initialize Socket.IO server
// Socket.IO server (new Server(server)) is configured with CORS allowing your app to connect.
const io = new socket_io_1.Server(server, {
    cors: {
        origin: ['http://localhost:19006'], // React Native Expo default origin or app URL
        methods: ['GET', 'POST'],
        credentials: true,
    },
});
// Enable CORS middleware for REST API
app.use((0, cors_1.default)({
    origin: ['http://localhost:19006'], // Same as above
    credentials: true,
}));
app.use(express_1.default.json());
// Routes
app.use('/api/users', userRoutes_1.default);
app.use('/api/auth', auth_1.default);
app.use('/api/exercises', exerciseRoutes_1.default);
// Health check route
app.get('/', (req, res) => {
    res.send('🚀 Gym App Backend Running');
});
// Socket.IO connection handling
(0, socket_1.setupSocketIO)(io);
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
