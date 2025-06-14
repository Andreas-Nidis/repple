"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExerciseByUser = getExerciseByUser;
exports.getExerciseById = getExerciseById;
exports.createExercise = createExercise;
exports.updateExercise = updateExercise;
exports.deleteExercise = deleteExercise;
const db_1 = require("./db");
async function getExerciseByUser(userId) {
    return await (0, db_1.sql) `
        SELECT * exercises WHERE user_id = ${userId}
        ORDER BY created_at DESC
    `;
}
async function getExerciseById(exerciseId) {
    const exercise = await (0, db_1.sql) `
        SELECT * FROM exercises WHERE id = ${exerciseId}
    `;
    return exercise;
}
async function createExercise(userId, name, category, equipment, description, tutorial_url) {
    const [newExercise] = await (0, db_1.sql) `
        INSERT INTO exercises (user_id, name, category, equipment, description, tutorial_url)
        VALUES (${userId}, ${name}, ${category}, ${equipment}, ${description}, ${tutorial_url})
        RETURNING *
    `;
    return newExercise;
}
async function updateExercise(exerciseId, name, category, equipment, description, tutorial_url) {
    const [updatedExercise] = await (0, db_1.sql) `
        UPDATE exercises
        SET
            name = COALESCE(${name}, name),
            category = COALESCE(${category}, category),
            equipment = COALESCE(${equipment}, equipment),
            description = COALESCE(${description}, description),
            tutorial_url = COALESCE(${tutorial_url}, tutorial_url)
        WHERE id = ${exerciseId}
        RETURNING *
    `;
    return updatedExercise;
}
async function deleteExercise(exerciseId) {
    const [deletedExercise] = await (0, db_1.sql) `
        DELETE FROM exercises WHERE id = ${exerciseId} RETURNING *
    `;
    return deletedExercise;
}
