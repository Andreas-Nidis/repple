"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = void 0;
const db_1 = require("../db/db");
const getUsers = async (req, res) => {
    try {
        const result = await db_1.sql.query('SELECT id, username FROM users');
        res.json(result);
    }
    catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getUsers = getUsers;
