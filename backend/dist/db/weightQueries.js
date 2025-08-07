"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeightEntries = getWeightEntries;
exports.createWeightEntry = createWeightEntry;
exports.updateWeightEntry = updateWeightEntry;
exports.deleteWeightEntries = deleteWeightEntries;
const db_1 = require("./db");
async function getWeightEntries(userId) {
    return await db_1.sql.query(`
        SELECT to_char(entry_date, 'YYYY-MM-DD') AS entry_date, weight FROM weight_logs 
        WHERE user_id = $1
        ORDER BY entry_date ASC
    `, [userId]);
}
async function createWeightEntry(userId, entryDate, weight) {
    await db_1.sql.query(`
        INSERT INTO weight_logs (user_id, entry_date, weight)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id, entry_date)
        DO UPDATE SET weight = EXCLUDED.weight
    `, [userId, entryDate, weight]);
}
;
async function updateWeightEntry(userId, entryDate, weight) {
    await db_1.sql.query(`
        UPDATE weight_logs 
        SET weight = $3
        WHERE user_id = $1 AND entry_date = $2
    `, [userId, entryDate, weight]);
}
;
async function deleteWeightEntries(userId, entryDate) {
    await db_1.sql.query(`
        DELETE FROM weight_logs WHERE user_id = $1 AND entry_date = $2
    `, [userId, entryDate]);
}
