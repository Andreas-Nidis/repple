import { sql } from './db';

export type User = {
  id: string;
  uid: string;
  email: string;
  name: string;
  picture: string;
  // Add more fields if needed
};

export async function findUser(uid: string): Promise<User | undefined>  {
  // Check if user exists
  const existingUser = await sql`
    SELECT * FROM users WHERE uid = ${uid}
  `;

  if (existingUser.length > 0) {
    const row = existingUser[0];
    const user: User = {
      id: row.id,
      uid: row.uid,
      email: row.email,
      name: row.name,
      picture: row.picture,
    };
    return user;
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