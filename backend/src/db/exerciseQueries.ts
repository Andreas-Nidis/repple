import { sql } from './db';

export async function getExercisesByUser(userId: string) {
    return await sql`
        SELECT * FROM exercises 
        WHERE user_id = ${userId}
    `;
}

export async function getExerciseById(exerciseId: string) {
    const exercise = await sql`
        SELECT * FROM exercises WHERE id = ${exerciseId}
    `;
    return exercise;
}

export async function createExercise(userId: string, name: string, category?: string, equipment?: string, description?: string, tutorial_url?: string) {
    const [newExercise] = await sql`
        INSERT INTO exercises (user_id, name, category, equipment, description, tutorial_url)
        VALUES (${userId}, ${name}, ${category}, ${equipment}, ${description}, ${tutorial_url})
        RETURNING *
    `;
    return newExercise;
}

export async function updateExercise(exerciseId: string, name?: string, category?: string, equipment?: string, description?: string, tutorial_url?: string) {
    const [updatedExercise] = await sql`
        UPDATE exercises
        SET
            name = COALESCE(${name}, name),
            category = COALESCE(${category}, category),
            equipment = COALESCE(${equipment}, equipment),
            description = COALESCE(${description}, description),
            tutorial_url = COALESCE(${tutorial_url}, tutorial_url)
        WHERE id = ${exerciseId}
        RETURNING *
    `;
    return updatedExercise;
}

export async function deleteExercise(exerciseId: string) {
    const [deletedExercise] = await sql`
        DELETE FROM exercises WHERE id = ${exerciseId} RETURNING *
    `;
    return deletedExercise;
}