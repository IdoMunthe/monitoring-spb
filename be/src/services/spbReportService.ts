import { db } from '../db';
import { SPBRow } from '../models/spbModel';

export const getSPBReport = async (
  startDate: string,
  endDate: string,
  lokasi: string,
  jenis: string,
  status: string,
  order: string,
  sort: string,
): Promise<SPBRow[]> => {
  const params: any[] = [startDate, endDate];
  let query = `
    SELECT 
      SPB_RECORDID,
      SPB_LOKASIASAL,
      SPB_LOKASITUJUAN,
      SPB_PRDCD,
      PRD_DESKRIPSIPENDEK AS SPB_DESKRIPSI,
      SPB_JENIS,
      SPB_MINUS AS SPB_PCS,
      0 AS SPB_CTN,
      PRD_FRAC
    FROM TBTEMP_ANTRIANSPB, TBMASTER_PRODMAST
    WHERE SPB_PRDCD = PRD_PRDCD
      AND DATE_TRUNC('DAY', SPB_CREATE_DT) >= TO_DATE($1, 'DD-MM-YYYY')
      AND DATE_TRUNC('DAY', SPB_CREATE_DT) <= TO_DATE($2, 'DD-MM-YYYY')
      AND COALESCE(SPB_RECORDID, '0') <> '1'
  `;

  if (lokasi === 'Toko') {
    query += ` AND (SPB_LOKASITUJUAN NOT LIKE 'D%' AND SPB_LOKASITUJUAN NOT LIKE 'G%')`;
  } else if (lokasi === 'Gudang') {
    query += ` AND (SPB_LOKASITUJUAN LIKE 'D%' OR SPB_LOKASITUJUAN LIKE 'G%')`;
  }

  if (jenis === 'Otomatis') query += ` AND SPB_JENIS = 'OTOMATIS'`;
  else if (jenis === 'Manual') query += ` AND SPB_JENIS = 'MANUAL'`;
  else if (jenis === 'TAC') query += ` AND SPB_JENIS LIKE 'TAC%'`;

  if (status === 'Semua')
    query += ` AND (SPB_RECORDID IN ('1','2','3') OR SPB_RECORDID IS NULL)`;
  else if (status === 'Belum Diturunkan') query += ` AND SPB_RECORDID IS NULL`;
  else if (status === 'Belum Direalisasi') query += ` AND SPB_RECORDID = '3'`;
  else if (status === 'Batal') query += ` AND SPB_RECORDID = '2'`;

  if (order === 'Waktu Antrian') query += ` ORDER BY SPB_CREATE_DT ${sort}`;
  else if (order === 'Lokasi Tujuan')
    query += ` ORDER BY SPB_LOKASITUJUAN ${sort}`;
  else if (order === 'Lokasi Asal') query += ` ORDER BY SPB_LOKASIASAL ${sort}`;

  const result = await db.query(query, params);

  return result.rows.map((row) => {
    let pcs = Number(row.spb_pcs);
    let frac = Number(row.prd_frac);
    const ctn = Math.floor(pcs / frac);
    pcs = pcs - ctn * frac;

    return {
      ...row,
      spb_ctn: ctn,
      spb_pcs: pcs,
      spb_recordid:
        row.spb_recordid === '3'
          ? 'Belum Direalisasi'
          : row.spb_recordid === '2'
            ? 'Batal'
            : !row.spb_recordid
              ? 'Belum Diturunkan'
              : row.spb_recordid,
      spb_jenis: row.spb_jenis.startsWith('TAC')
        ? 'TAC'
        : row.spb_jenis === 'OTOMATIS'
          ? 'Otomatis'
          : row.spb_jenis === 'MANUAL'
            ? 'Manual'
            : row.spb_jenis,
    };
  });
};
