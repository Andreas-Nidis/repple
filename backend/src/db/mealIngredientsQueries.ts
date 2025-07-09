import { sql } from './db';

export async function getIngredientsInMeal(userId:string, mealId: string) {
    return await sql`
        SELECT mi.*, i.name AS ingredient_name, i.protein, i.fat, i.carbs
        FROM meal_ingredients mi
        JOIN ingredients i ON mi.ingredient_id = i.id
        JOIN meals m ON mi.meal_id = m.id
        WHERE mi.meal_id = ${mealId} AND m.user_id = ${userId}
    `;
}

export async function addIngredientToMeal(userId: string, mealId: string, ingredientId: string, quantity: number) {
    return await sql`
        INSERT INTO meal_ingredients (meal_id, ingredient_id, quantity)
        SELECT ${mealId}, ${ingredientId}, ${quantity}
        WHERE EXISTS (
            SELECT 1 FROM meals m WHERE m.id = ${mealId} AND m.user_id = ${userId}
        )
        ON CONFLICT (meal_id, ingredient_id) DO NOTHING
    `;
}

export async function updateIngredientInMeal(userId: string, mealId: string, ingredientId: string, quantity: number) {
    return await sql`
        UPDATE meal_ingredients
        SET quantity = ${quantity}
        WHERE meal_id = ${mealId} AND ingredient_id = ${ingredientId}
        AND EXISTS (
            SELECT 1 FROM meals m WHERE m.id = ${mealId} AND m.user_id = ${userId}
        )
    `;
}

export async function removeIngredientFromMeal(userId: string, mealId: string, ingredientId: string) {
    return await sql`
        DELETE FROM meal_ingredients
        WHERE meal_id = ${mealId} AND ingredient_id = ${ingredientId}
        AND EXISTS (
            SELECT 1 FROM meals m WHERE m.id = ${mealId} AND m.user_id = ${userId}
        )
    `;
}