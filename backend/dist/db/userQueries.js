"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOrCreateUser = findOrCreateUser;
const db_1 = require("./db");
async function findOrCreateUser(googleSub, email, picture, name) {
    // Check if user exists
    const existingUser = await (0, db_1.sql) `
    SELECT * FROM users WHERE google_sub = ${googleSub}
  `;
    if (existingUser.length > 0)
        return existingUser[0]; // Return the first matching user
    // Create new user if not found
    const newUser = await (0, db_1.sql) `
    INSERT INTO users (google_sub, email, picture, name)
    VALUES (${googleSub}, ${email}, ${picture}, ${name})
    RETURNING *
  `;
    return newUser[0]; // Return the newly created user
}
