import { sql } from './db';

export async function findUser(uid: string, email: string, picture: string, name: string) {
  // Check if user exists
  const existingUser = await sql`
    SELECT * FROM users WHERE uid = ${uid}
  `;

  if (existingUser.length > 0) {
    return existingUser[0]; // Return the first matching user
  } else {
    console.log('User missing in userQueries');
  }
  
}

export async function getUserIdByFirebaseId(uid: string) {
  const rows = await sql`
    SELECT id FROM users WHERE uid = ${uid}
  `;
  if (rows.length > 0 && rows[0].id) {
    return rows[0].id;
  }
  return null;
}