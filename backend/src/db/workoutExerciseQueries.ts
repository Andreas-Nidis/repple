import { sql } from './db';

export async function getExercisesInWorkout(workoutId: number) {
    return await sql`
        SELECT we.*, e.name, e.category, e.equipment, e.description, e.tutorial_url
        FROM workout_exercises we
        JOIN exercises e ON we.exercise_id = e.id
        WHERE we.workout_id = ${workoutId}
        ORDER BY we.created_at DESC
    `;
}

export async function getExerciseInWorkout(workoutId: number, exerciseId: number) {
    const [exercise] = await sql`
        SELECT we.*, e.name, e.category, e.equipment, e.description, e.tutorial_url
        FROM workout_exercises we
        JOIN exercises e ON we.exercise_id = e.id
        WHERE we.workout_id = ${workoutId} AND we.exercise_id = ${exerciseId}
    `;
    return exercise;
}

export async function addExerciseToWorkout(workoutId: number, exerciseId: number, sets: number, reps: number, restSeconds?: number) {
    const [workoutExercise] = await sql`
        INSERT INTO workout_exercises (workout_id, exercise_id, sets, reps, rest_seconds)
        VALUES (${workoutId}, ${exerciseId}, ${sets}, ${reps}, ${restSeconds})
        RETURNING *
    `;
    return workoutExercise;
}

export async function updateExerciseInWorkout(workoutId: number, exerciseId: number, sets?: number, reps?: number, restSeconds?: number) {
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

export async function removeExerciseFromWorkout(workoutId: number, exerciseId: number) {
    const [removedExercise] = await sql`
        DELETE FROM workout_exercises WHERE workout_id = ${workoutId} AND exercise_id = ${exerciseId} RETURNING *
    `;
    return removedExercise;
}