export interface OptimalisasiRecord {
  no: number;
  lokasi: string;
  plu: string;
  qty: number;
  exp_dt: Date;
  max_palette: number;
  frac: number;
}

import { db } from '../db';

export async function getOptimalisasiListFromDB(): Promise<OptimalisasiRecord[]> {
  const query = `
  SELECT ROW_NUMBER() OVER() AS ROWNUM, f.* 
FROM (
  SELECT d.* 
  FROM (
    SELECT plu, COUNT(plu) cnt 
    FROM (
      SELECT 
        lks_koderak || '.' || lks_kodesubrak || '.' || lks_tiperak || '.' || 
        lks_shelvingrak || '.' || lks_nourut AS lokasi, 
        lks_prdcd || '-' || prd_deskripsipendek AS plu, 
        lks_expdate AS exp_date, 
        lks_qty AS qty, 
        (mpt_maxqty * prd_frac) AS maximal, 
        prd_frac 
      FROM tbmaster_lokasi, tbmaster_prodmast, tbmaster_maxpalet 
      WHERE 
        lks_tiperak = 'S' 
        AND lks_prdcd IS NOT NULL 
        AND lks_kodeigr = prd_kodeigr 
        AND lks_prdcd = prd_prdcd 
        AND lks_prdcd = mpt_prdcd 
        AND (
          lks_koderak LIKE 'D%' OR 
          lks_koderak LIKE 'G%'
        ) 
        AND lks_qty <= (mpt_maxqty * prd_frac) * 50 / 100
    ) AS A 
    GROUP BY plu 
    HAVING COUNT(*) > 1
  ) c, 
  (
    SELECT 
      lks_koderak || '.' || lks_kodesubrak || '.' || lks_tiperak || '.' || 
      lks_shelvingrak || '.' || lks_nourut AS lokasi, 
      lks_prdcd || '-' || prd_deskripsipendek AS plu, 
      lks_expdate AS exp_date, 
      lks_qty AS qty, 
      (mpt_maxqty * prd_frac) AS maximal, 
      prd_frac 
    FROM tbmaster_lokasi, tbmaster_prodmast, tbmaster_maxpalet 
    WHERE 
      lks_tiperak = 'S' 
      AND lks_prdcd IS NOT NULL 
      AND lks_kodeigr = prd_kodeigr 
      AND lks_prdcd = prd_prdcd 
      AND lks_prdcd = mpt_prdcd 
      AND (
        lks_koderak LIKE 'D%' OR 
        lks_koderak LIKE 'G%'
      ) 
      AND lks_qty < (mpt_maxqty * prd_frac) * 50 / 100
  ) d 
  WHERE c.plu = d.plu 
  ORDER BY d.plu, d.lokasi, d.exp_date
) f
  `;

  const result = await db.query(query);
  return result.rows;
}
