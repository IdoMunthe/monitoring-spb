import { db } from "../db";


export async function getUserByCredentials(username: string, password: string) {
  const result = await db.query(
    `SELECT userid, username, userlevel FROM tbmaster_user WHERE userid = $1 AND userpassword = $2`,
    [username, password],
  );
  return result.rows[0]; // returns undefined if not found
}
