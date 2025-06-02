import { sql } from './db';

export async function findOrCreateUser(googleSub: string, email: string, picture: string, name: string) {
  // Check if user exists
  const existingUser = await sql`
    SELECT * FROM users WHERE google_sub = ${googleSub}
  `;

  if (existingUser.length > 0) return existingUser[0]; // Return the first matching user

  // Create new user if not found
  const newUser = await sql`
    INSERT INTO users (google_sub, email, picture, name)
    VALUES (${googleSub}, ${email}, ${picture}, ${name})
    RETURNING *
  `;

  return newUser[0]; // Return the newly created user
}