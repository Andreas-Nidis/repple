import { getUsers } from '../db/userQueries';

export async function listUsers(userId: string) {
  if (!userId) throw new Error('Unauthorized');
  return await getUsers(userId);
}