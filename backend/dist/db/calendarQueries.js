"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEntriesForWeek = getEntriesForWeek;
exports.createCalendarEntry = createCalendarEntry;
exports.toggleCompletion = toggleCompletion;
exports.deleteCalendarEntry = deleteCalendarEntry;
const db_1 = require("./db");
async function getEntriesForWeek(userId, startDate, endDate) {
    const result = await db_1.sql.query(`SELECT * FROM calendar_entries
        WHERE user_id = $1 AND scheduled_date BETWEEN $2 AND $3
        ORDER BY scheduled_date`, [userId, startDate, endDate]);
    return result;
}
async function createCalendarEntry(userId, workoutId, scheduledDate) {
    const result = await db_1.sql.query(`INSERT INTO calendar_entries (user_id, workout_id, scheduled_date)
        VALUES ($1, $2, $3)
        RETURNING *`, [userId, workoutId, scheduledDate]);
    return result;
}
async function toggleCompletion(userId, scheduledDate) {
    const result = await db_1.sql.query(`UPDATE calendar_entries
        SET is_completed = NOT is_completed
        WHERE user_id = $1 AND scheduled_date = $2
        RETURNING *`, [userId, scheduledDate]);
    return result;
}
async function deleteCalendarEntry(userId, id) {
    const result = await db_1.sql.query(`DELETE FROM calendar_entries
        WHERE user_id = $1 AND id = $2
        RETURNING *`, [userId, id]);
    return result;
}
