import { sql } from './db';

export async function getIngredientsByMealId(mealId: number) {
    return await sql`
        SELECT i.*, mi.quantity, mi.unit
        FROM meal_ingredients mi
        JOIN ingredients i ON mi.ingredient_id = i.id
        WHERE mi.meal_id = ${mealId}
        ORDER BY i.name
    `;
}

export async function getIngredientById(ingredientId: number) {
    const [ingredient] = await sql`
        SELECT * FROM ingredients WHERE id = ${ingredientId}
    `;
    return ingredient;
}

export async function createIngredient(name: string, calories: number, protein: number, carbs: number, fat: number) {
    const [newIngredient] = await sql`
        INSERT INTO ingredients (name, calories, protein, carbs, fat)
        VALUES (${name}, ${calories}, ${protein}, ${carbs}, ${fat})
        RETURNING *
    `;
    return newIngredient;
}

export async function updateIngredient(ingredientId: number, name?: string, calories?: number, protein?: number, carbs?: number, fat?: number) {
    const [updatedIngredient] = await sql`
        UPDATE ingredients
        SET
            name = COALESCE(${name}, name),
            calories = COALESCE(${calories}, calories),
            protein = COALESCE(${protein}, protein),
            carbs = COALESCE(${carbs}, carbs),
            fat = COALESCE(${fat}, fat)
        WHERE id = ${ingredientId}
        RETURNING *
    `;
    return updatedIngredient;
}

export async function deleteIngredient(ingredientId: number) {
    const [deletedIngredient] = await sql`
        DELETE FROM ingredients WHERE id = ${ingredientId} RETURNING *
    `;
    return deletedIngredient;
}

