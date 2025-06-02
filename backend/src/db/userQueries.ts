import { sql } from './db';

export async function findOrCreateUser(googleSub: string, email: string) {
  // Check if user exists
  const existingUser = await sql`
    SELECT * FROM users WHERE google_sub = ${googleSub}
  `;

  if (existingUser.length > 0) return existingUser[0]; // Return the first matching user

  // Create new user if not found
  const newUser = await sql`
    INSERT INTO users (google_sub, email)
    VALUES (${googleSub}, ${email})
    RETURNING *
  `;

  return newUser[0]; // Return the newly created user
}