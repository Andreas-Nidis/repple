import {
  getWeightEntries,
  createWeightEntry,
  updateWeightEntry,
  deleteWeightEntries
} from '../db/weightQueries';

export async function listWeightEntries(userId: string) {
  if (!userId) throw new Error('Unauthorized');
  return getWeightEntries(userId);
}

export async function addWeightEntry(userId: string, entryDate: string, weight: number) {
  if (!userId) throw new Error('Unauthorized');
  if (!entryDate || !weight) throw new Error('BadRequest');
  
  return createWeightEntry(userId, entryDate, weight);
}

export async function modifyWeightEntry(userId: string, entryDate: string, weight: number) {
  if (!userId) throw new Error('Unauthorized');
  if (!entryDate || !weight) throw new Error('BadRequest');
  
  return updateWeightEntry(userId, entryDate, weight);
}

export async function removeWeightEntry(userId: string, entryDate: string) {
  if (!userId) throw new Error('Unauthorized');
  if (!entryDate) throw new Error('BadRequest');
  
  return deleteWeightEntries(userId, entryDate);
}