"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllIngredientsByUserId = getAllIngredientsByUserId;
exports.getIngredientById = getIngredientById;
exports.createIngredient = createIngredient;
exports.updateIngredient = updateIngredient;
exports.deleteIngredient = deleteIngredient;
const db_1 = require("./db");
async function getAllIngredientsByUserId(userId) {
    return await (0, db_1.sql) `
        SELECT * FROM ingredients 
        WHERE user_id = ${userId}
    `;
}
async function getIngredientById(userId, ingredientId) {
    const [ingredient] = await (0, db_1.sql) `
        SELECT * FROM ingredients WHERE id = ${ingredientId} AND user_id = ${userId}
    `;
    return ingredient;
}
async function createIngredient(userId, name) {
    const [newIngredient] = await (0, db_1.sql) `
        INSERT INTO ingredients (user_id, name)
        VALUES (${userId}, ${name})
        RETURNING *
    `;
    return newIngredient;
}
async function updateIngredient(userId, ingredientId, protein, carbs, fat) {
    const [updatedIngredient] = await (0, db_1.sql) `
        UPDATE ingredients
        SET
            protein = COALESCE(${protein}, protein),
            carbs = COALESCE(${carbs}, carbs),
            fat = COALESCE(${fat}, fat)
        WHERE id = ${ingredientId} AND user_id = ${userId}
        RETURNING *
    `;
    return updatedIngredient;
}
async function deleteIngredient(ingredientId) {
    const [deletedIngredient] = await (0, db_1.sql) `
        DELETE FROM ingredients WHERE id = ${ingredientId} RETURNING *
    `;
    return deletedIngredient;
}
