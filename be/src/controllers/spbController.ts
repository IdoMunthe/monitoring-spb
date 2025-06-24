import { Request, Response } from 'express';
import { deleteSPBRecord, getSPBList } from '../services/spbService';

export async function getSPBHandler  (req: Request, res: Response) {
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

export async function handleDeleteSPB(req: Request, res: Response) {
  try {
    const {recordId} = req.body
    if (!recordId) {
      return res.status(400).json({message: 'recordid tidak ditemukan'})
    }

    await deleteSPBRecord(recordId)
    return res.status(200).json({message: 'data berhasil dibatalkan'})
  } catch (error: any) {
    console.error(error)
    return res.status(500).json({message: error.message})
  }
}