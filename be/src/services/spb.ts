import { db } from '../db';
import { SPB } from '../models/spb.model';

export const getSPBList = async (
  kodeRak: string,
  tipeRak: string,
): Promise<SPB[]> => {
  let querySPB = `
  SELECT SPB_RECORDID, SPB_PRDCD, SPB_LOKASIASAL, SPB_LOKASITUJUAN,
          SPB_JENIS, SPB_CREATE_BY, SPB_CREATE_DT, SPB_MODIFY_BY,
          SPB_MODIFY_DT, SPB_QTY, SPB_MINUS, SPB_DESKRIPSI, SPB_ID,
          FLOOR(SPB_MINUS/PRD_FRAC) AS SPB_MINUSCTN,
          MOD(SPB_MINUS::numeric, PRD_FRAC::numeric) AS SPB_MINUSPCS,
          SPB_KODESPI
    FROM TBTEMP_ANTRIANSPB
    LEFT JOIN TBMASTER_PRODMAST ON SPB_PRDCD = PRD_PRDCD
    WHERE (SPB_RECORDID IS NULL OR SPB_RECORDID = '3')
  `;

  const params: any[] = [];

  if (kodeRak !== 'ALL') {
    querySPB += ` AND SPB_LOKASITUJUAN LIKE $${params.length + 1}`;
    params.push(`${kodeRak}%`);
  }

  if (tipeRak !== 'ALL') {
    querySPB += ` AND SPB_LOKASITUJUAN LIKE $${params.length + 1}`;
    params.push(`%.%.${tipeRak}.%`);
  }

  querySPB += ` ORDER BY SPB_CREATE_DT ASC`;

  const result = await db.query(querySPB, params);
  return result.rows;
};
