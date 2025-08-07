"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = getUsers;
exports.getUser = getUser;
exports.findUser = findUser;
exports.getUserIdByFirebaseId = getUserIdByFirebaseId;
const db_1 = require("./db");
async function getUsers(userId) {
    const users = await (0, db_1.sql) `
    SELECT DISTINCT ON (u.id)
      u.id,
      u.name,
      u.picture,
      u.friend_code,
      f.status,
      f.user_id AS request_sender_id
    FROM users u
    LEFT JOIN friendships f
      ON (
        (f.user_id = ${userId} AND f.friend_id = u.id)
        OR
        (f.friend_id = ${userId} AND f.user_id = u.id)
      )
    WHERE u.id != ${userId};
  `;
    return users;
}
async function getUser(userId) {
    const existingUser = await (0, db_1.sql) `
    SELECT * FROM users WHERE id = ${userId}
  `;
    if (existingUser.length > 0) {
        const row = existingUser[0];
        const user = {
            id: row.id,
            uid: row.uid,
            email: row.email,
            name: row.name,
            picture: row.picture,
            friend_code: row.friend_code,
        };
        return user;
    }
    else {
        console.log('User missing in userQueries');
    }
}
async function findUser(uid) {
    // Check if user exists
    const existingUser = await (0, db_1.sql) `
    SELECT * FROM users WHERE uid = ${uid}
  `;
    if (existingUser.length > 0) {
        const row = existingUser[0];
        const user = {
            id: row.id,
            uid: row.uid,
            email: row.email,
            name: row.name,
            picture: row.picture,
            friend_code: row.friend_code,
        };
        return user;
    }
    else {
        console.log('User missing in userQueries');
    }
}
async function getUserIdByFirebaseId(uid) {
    const rows = await (0, db_1.sql) `
    SELECT id FROM users WHERE uid = ${uid}
  `;
    if (rows.length > 0 && rows[0].id) {
        return rows[0].id;
    }
    return null;
}
