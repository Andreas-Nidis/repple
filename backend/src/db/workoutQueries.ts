import { sql } from './db';

// Queries for managing workouts in the database
// These functions allow you to create, read, update, and delete workouts for users.
export async function getWorkoutsByUser(userId: string) {
    return await sql`
        SELECT * FROM workouts WHERE user_id = ${userId}
        ORDER BY created_at DESC
    `;
}

export async function getWorkoutById(workoutId: string) {
    const workout = await sql`
        SELECT * FROM workouts WHERE id = ${workoutId}
    `;
    return workout;
}

export async function createWorkout(userId: string, name: string, category?: string) {
    const [newWorkout] = await sql`
        INSERT INTO workouts (user_id, name, category)
        VALUES (${userId}, ${name}, ${category})
        RETURNING *
    `;
    return newWorkout;
}

export async function updateWorkout(workoutId: string, name?: string) {
    const [updatedWorkout] = await sql`
        UPDATE workouts
        SET
            name = COALESCE(${name}, name)
        WHERE id = ${workoutId}
        RETURNING *
    `;
    return updatedWorkout;
}

export async function deleteWorkout(workoutId: string) {
    const [deletedWorkout] = await sql`
        DELETE FROM workouts WHERE id = ${workoutId} RETURNING *
    `;
    return deletedWorkout;
}