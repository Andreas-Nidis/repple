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

// export async function getMealIngredients(userId: string, mealId: string) {
//     return await sql`
//         SELECT i.*, mi.quantity, mi.unit
//         FROM meal_ingredients mi
//         JOIN ingredients i ON mi.ingredient_id = i.id
//         WHERE mi.meal_id = ${mealId} AND i.user_id = ${userId}
//         ORDER BY i.name
//     `;
// }

// export async function addIngredientToMeal(userID: string, mealId: string, ingredientId: string, quantity: number, unit: string) {
//     const [newIngredient] = await sql`
//         INSERT INTO meal_ingredients (meal_id, ingredient_id, quantity, unit)
//         VALUES (${mealId}, ${ingredientId}, ${quantity}, ${unit})
//         WHERE user_id = ${userID}
//         RETURNING *
//     `;
//     return newIngredient;
// }

// export async function removeIngredientFromMeal(userId: string, mealId: number, ingredientId: number) {
//     const [deletedIngredient] = await sql`
//         DELETE FROM meal_ingredients 
//         WHERE meal_id = ${mealId} AND ingredient_id = ${ingredientId} AND user_id = ${userId}
//         RETURNING *
//     `;
//     return deletedIngredient;
// }

// export async function updateMealIngredient(userId: string, mealId: string, ingredientId: string, quantity?: number, unit?: string) {
//     const [updatedIngredient] = await sql`
//         UPDATE meal_ingredients
//         SET
//             quantity = COALESCE(${quantity}, quantity),
//             unit = COALESCE(${unit}, unit)
//         WHERE meal_id = ${mealId} AND ingredient_id = ${ingredientId} AND user_id = ${userId}
//         RETURNING *
//     `;
//     return updatedIngredient;
// }

// export async function getMealSummary(userId: string, mealId: string) {
//     const [summary] = await sql`
//         SELECT
//             SUM(i.calories * mi.quantity) AS total_calories,
//             SUM(i.protein * mi.quantity) AS total_protein,
//             SUM(i.carbs * mi.quantity) AS total_carbs,
//             SUM(i.fat * mi.quantity) AS total_fat
//         FROM meal_ingredients mi
//         JOIN ingredients i ON mi.ingredient_id = i.id
//         WHERE mi.meal_id = ${mealId} AND i.user_id = ${userId}
//     `;
//     return summary;
// }

