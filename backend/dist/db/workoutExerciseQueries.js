"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExercisesInWorkout = getExercisesInWorkout;
exports.getExerciseInWorkout = getExerciseInWorkout;
exports.addExerciseToWorkout = addExerciseToWorkout;
exports.updateExerciseInWorkout = updateExerciseInWorkout;
exports.removeExerciseFromWorkout = removeExerciseFromWorkout;
const db_1 = require("./db");
async function getExercisesInWorkout(workoutId) {
    return await (0, db_1.sql) `
        SELECT we.*, e.name, e.category, e.equipment, e.description, e.tutorial_url, w.name AS workout_name
        FROM workout_exercises we
        JOIN exercises e ON we.exercise_id = e.id
        JOIN workouts w ON we.workout_id = w.id
        WHERE we.workout_id = ${workoutId}
    `;
}
async function getExerciseInWorkout(workoutId, exerciseId) {
    const [exercise] = await (0, db_1.sql) `
        SELECT we.*, e.name, e.category, e.equipment, e.description, e.tutorial_url
        FROM workout_exercises we
        JOIN exercises e ON we.exercise_id = e.id
        WHERE we.workout_id = ${workoutId} AND we.exercise_id = ${exerciseId}
    `;
    return exercise;
}
async function addExerciseToWorkout(workoutId, exerciseId, sets, reps, restSeconds) {
    const [workoutExercise] = await (0, db_1.sql) `
        INSERT INTO workout_exercises (workout_id, exercise_id, sets, reps, rest_seconds)
        VALUES (${workoutId}, ${exerciseId}, ${sets}, ${reps}, ${restSeconds})
        RETURNING *
    `;
    return workoutExercise;
}
async function updateExerciseInWorkout(workoutId, exerciseId, sets, reps, restSeconds) {
    const [updatedExercise] = await (0, db_1.sql) `
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
async function removeExerciseFromWorkout(workoutId, exerciseId) {
    const [removedExercise] = await (0, db_1.sql) `
        DELETE FROM workout_exercises WHERE workout_id = ${workoutId} AND exercise_id = ${exerciseId} RETURNING *
    `;
    return removedExercise;
}
