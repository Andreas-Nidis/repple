import { sql } from './db';

export async function getMealsByUser(userId: number) {
    return await sql`
        SELECT * FROM meals WHERE user_id = ${userId}
        ORDER BY created_at DESC
    `;
}

export async function getMealById(mealId: number) {
    const [meal] = await sql`
        SELECT * FROM meals WHERE id = ${mealId}
    `;
    return meal;
}

export async function createMeal(userId: number, name: string, ingredients: { ingredientId: number, quantity: number, unit: string }[]) {
    const [newMeal] = await sql`
        INSERT INTO meals (user_id, name, ingredients)
        VALUES (${userId}, ${name}, ${JSON.stringify(ingredients)})
        RETURNING *
    `;
    return newMeal;
}

export async function updateMeal(mealId: number, name?: string, ingredients?: { ingredientId: number, quantity: number, unit: string }[]) {
    const [updatedMeal] = await sql`
        UPDATE meals
        SET
            name = COALESCE(${name}, name),
            ingredients = COALESCE(${JSON.stringify(ingredients)}, ingredients)
        WHERE id = ${mealId}
        RETURNING *
    `;
    return updatedMeal;
}

export async function deleteMeal(mealId: number) {
    const [deletedMeal] = await sql`
        DELETE FROM meals WHERE id = ${mealId} RETURNING *
    `;
    return deletedMeal;
}

export async function getMealIngredients(mealId: number) {
    return await sql`
        SELECT i.*, mi.quantity, mi.unit
        FROM meal_ingredients mi
        JOIN ingredients i ON mi.ingredient_id = i.id
        WHERE mi.meal_id = ${mealId}
        ORDER BY i.name
    `;
}

export async function addIngredientToMeal(mealId: number, ingredientId: number, quantity: number, unit: string) {
    const [newIngredient] = await sql`
        INSERT INTO meal_ingredients (meal_id, ingredient_id, quantity, unit)
        VALUES (${mealId}, ${ingredientId}, ${quantity}, ${unit})
        RETURNING *
    `;
    return newIngredient;
}

export async function removeIngredientFromMeal(mealId: number, ingredientId: number) {
    const [deletedIngredient] = await sql`
        DELETE FROM meal_ingredients WHERE meal_id = ${mealId} AND ingredient_id = ${ingredientId} RETURNING *
    `;
    return deletedIngredient;
}

export async function updateMealIngredient(mealId: number, ingredientId: number, quantity?: number, unit?: string) {
    const [updatedIngredient] = await sql`
        UPDATE meal_ingredients
        SET
            quantity = COALESCE(${quantity}, quantity),
            unit = COALESCE(${unit}, unit)
        WHERE meal_id = ${mealId} AND ingredient_id = ${ingredientId}
        RETURNING *
    `;
    return updatedIngredient;
}

export async function getMealSummary(mealId: number) {
    const [summary] = await sql`
        SELECT
            SUM(i.calories * mi.quantity) AS total_calories,
            SUM(i.protein * mi.quantity) AS total_protein,
            SUM(i.carbs * mi.quantity) AS total_carbs,
            SUM(i.fat * mi.quantity) AS total_fat
        FROM meal_ingredients mi
        JOIN ingredients i ON mi.ingredient_id = i.id
        WHERE mi.meal_id = ${mealId}
    `;
    return summary;
}

