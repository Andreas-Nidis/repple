"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateFirebase = authenticateFirebase;
const firebaseAdmin_1 = __importDefault(require("../utils/firebaseAdmin"));
const db_1 = require("../db/db");
const friendCode_1 = require("../utils/friendCode");
async function authenticateFirebase(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'No token provided' });
        return;
    }
    ;
    const token = authHeader.split(' ')[1];
    try {
        const decodedToken = await firebaseAdmin_1.default.auth().verifyIdToken(token);
        let result = await (0, db_1.sql) `SELECT id FROM users WHERE uid = ${decodedToken.uid}`;
        if (result.length === 0) {
            // User doesn't exist in DB — create them
            let friendCode;
            let inserted = false;
            while (!inserted) {
                friendCode = (0, friendCode_1.generateFriendCode)();
                try {
                    const insertResult = await (0, db_1.sql) `
                        INSERT INTO users (uid, email, name, picture, friend_code)
                        VALUES (${decodedToken.uid}, ${decodedToken.email}, ${decodedToken.name}, ${decodedToken.picture}, ${friendCode})
                        RETURNING id
                    `;
                    result = insertResult;
                    inserted = true;
                }
                catch (error) {
                    // Postgres unique violation = 23505
                    if (error.code === '23505') {
                        // Try again with a new friendCode
                        continue;
                    }
                    throw error;
                }
            }
        }
        else {
            // User exists — check if name or picture changed, update if needed
            const user = result[0];
            if (user.name !== decodedToken.name || user.picture !== decodedToken.picture) {
                const updateResult = await (0, db_1.sql) `
                    UPDATE users
                    SET name = ${decodedToken.name}, picture = ${decodedToken.picture}
                    WHERE uid = ${decodedToken.uid}
                    RETURNING id
                `;
                result = updateResult;
            }
        }
        req.user = {
            ...decodedToken,
            id: result[0].id, // the UUID from your users table
        };
        next();
    }
    catch (error) {
        console.error('Error verifying Firebase token:', error);
        res.status(401).json({ error: 'Invalid Firebase token' });
        return;
    }
    ;
}
;
