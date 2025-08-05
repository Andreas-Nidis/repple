import { sql } from './db';

export async function getMealsByUser(userId: string) {
    return await sql`
        SELECT * FROM meals 
        WHERE user_id = ${userId} 
    `;
}

export async function getMealById(userId: string, mealId: string) {
    const meal = await sql`
        SELECT * FROM meals 
        WHERE id = ${mealId} AND user_id = ${userId}
    `;
    return meal;
}

export async function createMeal(userId: string, name: string) {
    const [newMeal] = await sql`
        INSERT INTO meals (user_id, name)
        VALUES (${userId}, ${name})
        RETURNING *
    `;
    return newMeal;
}

export async function updateMeal(userId: string, mealId: string, total_protein?: number, total_carbs?: number, total_fat?: number, selected?: boolean) {
    const [updatedMeal] = await sql`
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

export async function deleteMeal(userId: string, mealId: string) {
    const [deletedMeal] = await sql`
        DELETE FROM meals 
        WHERE id = ${mealId} AND user_id = ${userId}
        RETURNING *
    `;
    return deletedMeal;
}