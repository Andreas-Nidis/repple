import {
  getExercisesByUser,
  getExerciseById,
  createExercise,
  updateExercise,
  deleteExercise,
} from '../db/exerciseQueries';

export async function listExercises(userId: string) {
  if (!userId) throw new Error('Unauthorized');
  return await getExercisesByUser(userId);
}

export async function getSingleExercise(exerciseId: string) {
  const exercise = await getExerciseById(exerciseId);
  if (!exercise) throw new Error('NotFound');
  return exercise;
}

export async function createNewExercise(
  userId: string,
  name: string,
  category?: string,
  equipment?: string,
  description?: string,
  tutorial_url?: string
) {
  if (!userId) throw new Error('Unauthorized');
  if (!name || typeof name !== 'string') throw new Error('BadRequest');

  return await createExercise(userId, name, category, equipment, description, tutorial_url);
}

export async function updateExistingExercise(
  id: string,
  name?: string,
  category?: string,
  equipment?: string,
  description?: string,
  tutorial_url?: string
) {
  const updated = await updateExercise(id, name, category, equipment, description, tutorial_url);
  if (!updated) throw new Error('NotFound');
  return updated;
}

export async function deleteExistingExercise(id: string) {
  await deleteExercise(id);
}
