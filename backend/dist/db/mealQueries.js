"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMealsByUser = getMealsByUser;
exports.getMealById = getMealById;
exports.createMeal = createMeal;
exports.updateMeal = updateMeal;
exports.deleteMeal = deleteMeal;
const db_1 = require("./db");
async function getMealsByUser(userId) {
    return await (0, db_1.sql) `
        SELECT * FROM meals 
        WHERE user_id = ${userId} 
    `;
}
async function getMealById(userId, mealId) {
    const meal = await (0, db_1.sql) `
        SELECT * FROM meals 
        WHERE id = ${mealId} AND user_id = ${userId}
    `;
    return meal;
}
async function createMeal(userId, name) {
    const [newMeal] = await (0, db_1.sql) `
        INSERT INTO meals (user_id, name)
        VALUES (${userId}, ${name})
        RETURNING *
    `;
    return newMeal;
}
async function updateMeal(userId, mealId, total_protein, total_carbs, total_fat, selected) {
    const [updatedMeal] = await (0, db_1.sql) `
        UPDATE meals
        SET
            total_protein = COALESCE(${total_protein}, total_protein),
            total_carbs = COALESCE(${total_carbs}, total_carbs),
            total_fat = COALESCE(${total_fat}, total_fat),
            selected = COALESCE(${selected}, selected)
        WHERE id = ${mealId} AND user_id = ${userId}
        RETURNING *
    `;
    return updatedMeal;
}
async function deleteMeal(userId, mealId) {
    const [deletedMeal] = await (0, db_1.sql) `
        DELETE FROM meals 
        WHERE id = ${mealId} AND user_id = ${userId}
        RETURNING *
    `;
    return deletedMeal;
}
