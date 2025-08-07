"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersHandler = getUsersHandler;
const userQueries_1 = require("../db/userQueries");
async function getUsersHandler(req, res, next) {
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    try {
        const result = await (0, userQueries_1.getUsers)(userId);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
}
