"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUserController = getCurrentUserController;
exports.loginController = loginController;
const userQueries_1 = require("../db/userQueries");
async function getCurrentUserController(req, res, next) {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'User not authenticated' });
            return;
        }
        res.json({ user: req.user });
    }
    catch (error) {
        next(error);
    }
}
async function loginController(req, res, next) {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'User not authenticated' });
            return;
        }
        const { uid, email, name, picture } = req.user;
        if (!uid || !email) {
            res.status(400).json({ error: 'Invalid Firebase user data' });
            return;
        }
        const user = await (0, userQueries_1.findUser)(uid);
        res.json({ user });
    }
    catch (error) {
        next(error);
    }
}
