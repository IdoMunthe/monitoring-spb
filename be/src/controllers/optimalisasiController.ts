import { Request, Response } from "express";
import { getOptimalisasiList } from "../services/optimalisasiService";

export async function fetchOptimalisasiData(req: Request, res: Response) {
  try {
    const data = await getOptimalisasiList()
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({message: 'Failed to fetch data:', error})
  }
}