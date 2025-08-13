import {
  getExercisesInWorkout,
  getExerciseInWorkout,
  addExerciseToWorkout,
  updateExerciseInWorkout,
  removeExerciseFromWorkout
} from '../db/workoutExerciseQueries';

export async function listExercises(userId: string, workoutId: string) {
  if (!userId) throw new Error('Unauthorized');
  return getExercisesInWorkout(workoutId);
}

export async function getSingleExercise(userId: string, workoutId: string, exerciseId: string) {
  if (!userId) throw new Error('Unauthorized');

  const exercise = await getExerciseInWorkout(workoutId, exerciseId);
  if (!exercise || exercise.user_id !== userId) throw new Error('NotFound');
  
  return exercise;
}

export async function addNewExercise(userId: string, workoutId: string, exerciseId: string, sets: number, reps: number, restSeconds?: number) {
  if (!userId) throw new Error('Unauthorized');
  if (!exerciseId || !sets || !reps) throw new Error('BadRequest');

  return addExerciseToWorkout(workoutId, exerciseId, sets, reps, restSeconds);
}

export async function updateExerciseDetails(userId: string, workoutId: string, exerciseId: string, sets?: number, reps?: number, restSeconds?: number) {
  if (!userId) throw new Error('Unauthorized');
  if (!sets || !reps) throw new Error('BadRequest');

  const updated = await updateExerciseInWorkout(workoutId, exerciseId, sets, reps, restSeconds);
  if (!updated) throw new Error('NotFound');

  return updated;
}

export async function removeExerciseById(userId: string, workoutId: string, exerciseId: string) {
  if (!userId) throw new Error('Unauthorized');

  const removed = await removeExerciseFromWorkout(workoutId, exerciseId);
  if (!removed) throw new Error('NotFound');

  return removed;
}