import { sql } from './db';

export async function findOrCreateUser(uid: string, email: string, picture: string, name: string) {
  // Check if user exists
  const existingUser = await sql`
    SELECT * FROM users WHERE uid = ${uid}
  `;

  if (existingUser.length > 0) return existingUser[0]; // Return the first matching user

  // Create new user if not found
  const newUser = await sql`
    INSERT INTO users (uid, email, picture, name)
    VALUES (${uid}, ${email}, ${picture}, ${name})
    RETURNING *
  `;

  return newUser[0]; // Return the newly created userr
}