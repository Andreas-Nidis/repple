import { sql } from './db';

export async function getAllIngredientsByUserId(userId: string) {
    return await sql`
        SELECT * FROM ingredients 
        WHERE user_id = ${userId}
    `;
}

export async function getIngredientById(userId: string, ingredientId: string) {
    const [ingredient] = await sql`
        SELECT * FROM ingredients WHERE id = ${ingredientId} AND user_id = ${userId}
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

export async function updateIngredient(userId: string, ingredientId: string, protein?: number, carbs?: number, fat?: number) {
    const [updatedIngredient] = await sql`
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

export async function deleteIngredient(ingredientId: string) {
    const [deletedIngredient] = await sql`
        DELETE FROM ingredients WHERE id = ${ingredientId} RETURNING *
    `;
    return deletedIngredient;
}

