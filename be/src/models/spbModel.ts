import { db } from '../db';

export interface SPBRow {
  spb_recordid: string;
  spb_lokasiasal: string;
  spb_lokasitujuan: string;
  spb_prdcd: string;
  spb_deskripsi: string;
  spb_jenis: string;
  spb_pcs: number;
  spb_ctn: number;
  prd_frac: number;
}

export interface SPB {
  spb_id: number;
  spb_prdcd: string;
  spb_lokasiasal: string;
  spb_lokasitujuan: string;
  spb_jenis: string;
  spb_create_by: string;
  spb_create_dt: string;
  spb_modify_by: string;
  spb_modify_dt: string;
  spb_qty: number;
  spb_minus: number;
  spb_deskripsi: string;
  spb_recordid: string | null;
  spb_kodespi: string;
  spb_minusctn: number;
  spb_minuspcs: number;
}

export async function cancelSPB(spbId: string) {
  const queries = [
    `UPDATE TBTEMP_ANTRIANSPB SET spb_recordid = '2' WHERE spb_id = $1`,
    `UPDATE TBTR_ANTRIANSPB SET spb_recordid = '2' WHERE spb_id = $1`,
  ];

  for (const query of queries) {
    await db.query(query, [spbId]);
  }
}
