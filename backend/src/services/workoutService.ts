import {
  getWorkoutsByUser,
  getWorkoutById,
  createWorkout,
  updateWorkout,
  deleteWorkout
} from '../db/workoutQueries';

export async function listWorkouts(userId: string) {
  if (!userId) throw new Error('Unauthorized');
  return await getWorkoutsByUser(userId);
}

export async function getSingleWorkout(userId: string, workoutId: string) {
  if (!userId) throw new Error('Unauthorized');
  
  const workoutArr = await getWorkoutById(workoutId);
  const workout = workoutArr[0];
  if (!workout || workout.user_id !== userId) throw new Error('NotFound');
  
  return workout;
}

export async function createNewWorkout(userId: string, name: string, category?: string) {
    if (!userId) throw new Error('Unauthorized');
    if (!name) throw new Error('BadRequest');
    return await createWorkout(userId, name, category);
}

export async function updateWorkoutDetails(userId: string, workoutId: string, name: string) {
    if (!userId) throw new Error('Unauthorized');
    if (!name) throw new Error('BadRequest');
    
    const updatedWorkout = await updateWorkout(workoutId, name);
    if (!updatedWorkout || updatedWorkout.user_id !== userId) throw new Error('NotFound');
    
    return updatedWorkout;
}

export async function deleteWorkoutById(userId: string, workoutId: string) {
  if (!userId) throw new Error('Unauthorized');
  
  const deletedWorkout = await deleteWorkout(workoutId);
  if (!deletedWorkout || deletedWorkout.user_id !== userId) throw new Error('NotFound');
  
  return deletedWorkout;
}