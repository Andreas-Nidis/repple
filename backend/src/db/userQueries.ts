import { sql } from './db';

export type User = {
  id: string;
  uid: string;
  email: string;
  name: string;
  picture: string;
  friend_code: string;
};

export async function getUsers(userId: string) {
  const users = await sql`
    SELECT DISTINCT ON (u.id)
      u.id,
      u.name,
      u.picture,
      u.friend_code,
      f.status,
      f.user_id AS request_sender_id
    FROM users u
    LEFT JOIN friendships f
      ON (
        (f.user_id = ${userId} AND f.friend_id = u.id)
        OR
        (f.friend_id = ${userId} AND f.user_id = u.id)
      )
    WHERE u.id != ${userId};
  `;
  return users;
}

export async function getUser(userId: string) {
  const existingUser = await sql`
    SELECT * FROM users WHERE id = ${userId}
  `;

  if (existingUser.length > 0) {
    const row = existingUser[0];
    const user: User = {
      id: row.id,
      uid: row.uid,
      email: row.email,
      name: row.name,
      picture: row.picture,
      friend_code: row.friend_code,
    };
    return user;
  } else {
    console.log('User missing in userQueries');
  }
}

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
      friend_code: row.friend_code,
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