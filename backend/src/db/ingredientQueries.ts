import { sql } from './db';

export async function getAllIngredientsByUserId(userId: string) {
    return await sql`
        SELECT * FROM ingredients 
        WHERE user_id = ${userId}
    `;
}

export async function getIngredientById(ingredientId: number) {
    const [ingredient] = await sql`
        SELECT * FROM ingredients WHERE id = ${ingredientId}
    `;
    return ingredient;
}

export async function createIngredient(userId: string, name: string) {
    const [newIngredient] = await sql`
        INSERT INTO ingredients (user_id, name)
        VALUES (${userId}, ${name})
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

