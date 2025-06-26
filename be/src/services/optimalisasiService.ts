import { getOptimalisasiListFromDB } from "../models/optimalisasiModel";

export async function getOptimalisasiList() {
  return await getOptimalisasiListFromDB()
}