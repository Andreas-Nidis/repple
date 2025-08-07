"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorkoutsByUser = getWorkoutsByUser;
exports.getWorkoutById = getWorkoutById;
exports.createWorkout = createWorkout;
exports.updateWorkout = updateWorkout;
exports.deleteWorkout = deleteWorkout;
const db_1 = require("./db");
// Queries for managing workouts in the database
// These functions allow you to create, read, update, and delete workouts for users.
async function getWorkoutsByUser(userId) {
    return await (0, db_1.sql) `
        SELECT * FROM workouts WHERE user_id = ${userId}
        ORDER BY created_at DESC
    `;
}
async function getWorkoutById(workoutId) {
    const workout = await (0, db_1.sql) `
        SELECT * FROM workouts WHERE id = ${workoutId}
    `;
    return workout;
}
async function createWorkout(userId, name, category) {
    const [newWorkout] = await (0, db_1.sql) `
        INSERT INTO workouts (user_id, name, category)
        VALUES (${userId}, ${name}, ${category})
        RETURNING *
    `;
    return newWorkout;
}
async function updateWorkout(workoutId, name) {
    const [updatedWorkout] = await (0, db_1.sql) `
        UPDATE workouts
        SET
            name = COALESCE(${name}, name)
        WHERE id = ${workoutId}
        RETURNING *
    `;
    return updatedWorkout;
}
async function deleteWorkout(workoutId) {
    const [deletedWorkout] = await (0, db_1.sql) `
        DELETE FROM workouts WHERE id = ${workoutId} RETURNING *
    `;
    return deletedWorkout;
}
