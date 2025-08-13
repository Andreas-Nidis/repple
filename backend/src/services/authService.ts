import { findUser } from '../db/userQueries';

export function getCurrentUser(user: any) {
  if (!user) throw new Error('Unauthorized');
  return user;
}

export async function loginUser(user: any) {
  if (!user) throw new Error('Unauthorized');

  const { uid, email, name, picture } = user;
  if (!uid || !email) throw new Error('BadRequest');

  const foundUser = await findUser(uid);
  return foundUser;
}
