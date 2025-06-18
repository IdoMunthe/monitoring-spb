import { Request, Response } from 'express';
import { getSPBList } from '../services/spb';

export const getSPBHandler = async (req: Request, res: Response) => {
  const kodeRak = (req.query.kodeRak as string) || 'ALL';
  const tipeRak = (req.query.tipeRak as string) || 'ALL';

  try {
    const data = await getSPBList(kodeRak, tipeRak);
    res.json(data);
  } catch (error) {
    console.error('SPB gagal fetching: ', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
