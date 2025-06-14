"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const googleAuth_1 = require("../auth/googleAuth");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userQueries_1 = require("../db/userQueries");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get('/me', authMiddleware_1.authenticateToken, async (req, res) => {
    const { user } = req;
    res.json({ user });
});
router.post('/google-login', async (req, res) => {
    const { idToken } = req.body;
    if (!idToken) {
        res.status(400).json({ error: 'Missing idToken' });
        return;
    }
    ;
    try {
        const googleUser = await (0, googleAuth_1.verifyGoogleToken)(idToken);
        if (!googleUser.sub || !googleUser.email || !googleUser.picture || !googleUser.name) {
            res.status(400).json({ error: 'Invalid Google user data' });
            return;
        }
        // Check if user exists in DB, create if not
        const user = await (0, userQueries_1.findOrCreateUser)(googleUser.sub, googleUser.email, googleUser.picture, googleUser.name);
        // Create JWT for your app (adjust secret & payload)
        const token = jsonwebtoken_1.default.sign({ email: googleUser.email, sub: googleUser.sub }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
        res.json({ token, user: googleUser });
    }
    catch (error) {
        console.error(error);
        res.status(401).json({ error: 'Invalid Google token' });
    }
});
exports.default = router;
