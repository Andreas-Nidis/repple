"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExercisesByUser = getExercisesByUser;
exports.getExerciseById = getExerciseById;
exports.createExercise = createExercise;
exports.updateExercise = updateExercise;
exports.deleteExercise = deleteExercise;
const db_1 = require("./db");
async function getExercisesByUser(userId) {
    return await (0, db_1.sql) `
        SELECT * FROM exercises 
        WHERE user_id = ${userId}
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
