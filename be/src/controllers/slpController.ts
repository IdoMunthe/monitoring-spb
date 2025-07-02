import { Request, Response } from "express";
import { createOtp, getSLPList } from "../services/slpService";

export async function fetchSLPData(req: Request, res: Response) {
  try {
    const data = await getSLPList()
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({message: 'Gagal mengambil data SLP', error: error})
  }
}

export async function generateOtp(req: Request, res: Response) {
  try {
    const {code, username} = req.body

    const result = await createOtp(code, username)
    res.status(201).json({message: result.message, data: result.data})

    
  } catch (error) {
    console.error('OTP generation failed', error)
    return res.status(500).json({message: 'Internal server error'})
  }
}