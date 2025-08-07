"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
router.get('/me', authMiddleware_1.authenticateFirebase, authController_1.getCurrentUserController);
router.post('/login', authMiddleware_1.authenticateFirebase, authController_1.loginController);
exports.default = router;
