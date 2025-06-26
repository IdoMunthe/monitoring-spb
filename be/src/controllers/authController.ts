import { Request, Response } from 'express';
import { authenticateUser, fetchCabangName } from '../services/authService';

export const handleApprovalLogin = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const result = await authenticateUser(username, password, 2);
  console.log(result);

  if (result.status === 'invalid') {
    return res.status(401).json({ message: 'Username atau password salah' });
  } else if (result.status === 'insufficient') {
    return res
      .status(403)
      .json({ message: 'User tidak memiliki akses', user: result.user });
  }

  return res.status(200).json({
    status: result.status,
    userLevel: result.user.userlevel,
  });
};