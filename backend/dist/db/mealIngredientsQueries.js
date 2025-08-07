"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIngredientsInMeal = getIngredientsInMeal;
exports.addIngredientToMeal = addIngredientToMeal;
exports.updateIngredientInMeal = updateIngredientInMeal;
exports.removeIngredientFromMeal = removeIngredientFromMeal;
const db_1 = require("./db");
async function getIngredientsInMeal(userId, mealId) {
    return await (0, db_1.sql) `
        SELECT mi.*, i.name AS ingredient_name, i.protein, i.fat, i.carbs
        FROM meal_ingredients mi
        JOIN ingredients i ON mi.ingredient_id = i.id
        JOIN meals m ON mi.meal_id = m.id
        WHERE mi.meal_id = ${mealId} AND m.user_id = ${userId}
    `;
}
async function addIngredientToMeal(userId, mealId, ingredientId, quantity) {
    return await (0, db_1.sql) `
        INSERT INTO meal_ingredients (meal_id, ingredient_id, quantity)
        SELECT ${mealId}, ${ingredientId}, ${quantity}
        WHERE EXISTS (
            SELECT 1 FROM meals m WHERE m.id = ${mealId} AND m.user_id = ${userId}
        )
        ON CONFLICT (meal_id, ingredient_id) DO NOTHING
    `;
}
async function updateIngredientInMeal(userId, mealId, ingredientId, quantity) {
    return await (0, db_1.sql) `
        UPDATE meal_ingredients
        SET quantity = ${quantity}
        WHERE meal_id = ${mealId} AND ingredient_id = ${ingredientId}
        AND EXISTS (
            SELECT 1 FROM meals m WHERE m.id = ${mealId} AND m.user_id = ${userId}
        )
    `;
}
async function removeIngredientFromMeal(userId, mealId, ingredientId) {
    return await (0, db_1.sql) `
        DELETE FROM meal_ingredients
        WHERE meal_id = ${mealId} AND ingredient_id = ${ingredientId}
        AND EXISTS (
            SELECT 1 FROM meals m WHERE m.id = ${mealId} AND m.user_id = ${userId}
        )
    `;
}
