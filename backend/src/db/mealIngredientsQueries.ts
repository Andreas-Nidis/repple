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

export async function getExerciseInWorkout(workoutId: string, exerciseId: string) {
    const [exercise] = await sql`
        SELECT we.*, e.name, e.category, e.equipment, e.description, e.tutorial_url
        FROM workout_exercises we
        JOIN exercises e ON we.exercise_id = e.id
        WHERE we.workout_id = ${workoutId} AND we.exercise_id = ${exerciseId}
    `;
    return exercise;
}

export async function addExerciseToWorkout(workoutId: string, exerciseId: string, sets: number, reps: number, restSeconds?: number) {
    const [workoutExercise] = await sql`
        INSERT INTO workout_exercises (workout_id, exercise_id, sets, reps, rest_seconds)
        VALUES (${workoutId}, ${exerciseId}, ${sets}, ${reps}, ${restSeconds})
        RETURNING *
    `;
    return workoutExercise;
}

export async function updateExerciseInWorkout(workoutId: string, exerciseId: string, sets?: number, reps?: number, restSeconds?: number) {
    const [updatedExercise] = await sql`
        UPDATE workout_exercises
        SET
            sets = COALESCE(${sets}, sets),
            reps = COALESCE(${reps}, reps),
            rest_seconds = COALESCE(${restSeconds}, rest_seconds)
        WHERE workout_id = ${workoutId} AND exercise_id = ${exerciseId}
        RETURNING *
    `;
    return updatedExercise;
}

export async function removeExerciseFromWorkout(workoutId: string, exerciseId: string) {
    const [removedExercise] = await sql`
        DELETE FROM workout_exercises WHERE workout_id = ${workoutId} AND exercise_id = ${exerciseId} RETURNING *
    `;
    return removedExercise;
}