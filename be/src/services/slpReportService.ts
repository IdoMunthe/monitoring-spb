import { db } from '../db';
import { SLPRecord } from '../models/slpModel';

function mapOrderLabelToColumn(order: string): string {
  switch (order.toLowerCase()) {
    case 'SLP ID':
      return 'slp_id';
    case 'lokasi':
      return 'lokasi';
    case 'plu':
      return 'plu';
    default:
      return 'slp_id';
  }
}

export async function getSLPReport(
  tanggal: string,
  status: string,
  order: string,
  asc: string,
): Promise<SLPRecord[]> {
  let query = `
    SELECT ROW_NUMBER() OVER () AS no,
      slp_id,
      slp_koderak || '.' || slp_kodesubrak || '.' || slp_tiperak || '.' || slp_shelvingrak || '.' || slp_nourut AS lokasi,
      slp_prdcd || ' - ' || slp_deskripsi AS plu,
      slp_qtycrt AS qtyctn,
      slp_qtypcs - (slp_qtycrt * slp_frac) AS qtypcs,
      TO_CHAR(slp_expdate, 'DD-MM-YYYY') AS exp_date,
      TO_CHAR(slp_create_dt, 'DD-MM-YYYY') AS tgl,
      COALESCE(slp_flag, 'B') AS slp_flag
    FROM tbtr_slp
    WHERE DATE_TRUNC('DAY', slp_create_dt) = TO_DATE($1, 'DD-MM-YYYY')
  `;

  if (status === 'All') {
    query += ` AND (slp_flag IN ('P', 'C') OR slp_flag IS NULL) `;
  } else if (status === 'Belum Direalisasi') {
    query += ` AND slp_flag IS NULL `;
  } else if (status === 'Batal') {
    query += ` AND slp_flag = 'C' `;
  }


  const dbOrderField = mapOrderLabelToColumn(order);

  query += ` ORDER BY ${dbOrderField} ${asc}`;

  const result = await db.query(query, [tanggal]);
  return result.rows;
}
