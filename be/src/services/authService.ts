import { getUserByCredentials } from '../models/authModel';

export async function authenticateUser(
  username: string,
  password: string,
  minUserLevel: number,
) {
  const user = await getUserByCredentials(username, password);
  if (!user) return { status: 'invalid' };

  if (user.userlevel > minUserLevel) return { status: 'insufficient', user };
  return { status: 'valid', user };
}
