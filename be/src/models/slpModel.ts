export interface SLPRecord {
  no: number;
  lokasi: string;
  plu: string;
  qtyctn: number;
  qtypcs: number;
  exp_date: string;
  tgl: string;
  slp_id: string;
  id_receiving: string;
  slp_flag: string;
}

import OracleDB from 'oracledb';
import { db } from '../db';
import { queryOracle } from '../utils/queryOracle';

export async function getSLPListFromDB(): Promise<SLPRecord[]> {
  const query = `
    SELECT ROW_NUMBER() OVER() AS no, a.* FROM (
      SELECT
        slp_koderak || '.' || slp_kodesubrak || '.' || slp_tiperak || '.' || slp_shelvingrak || '.' || slp_nourut AS lokasi,
        slp_prdcd || ' - ' || slp_deskripsi AS plu,
        slp_qtycrt AS qtyINctn,
        slp_qtypcs AS qtyINpcs,
        TO_CHAR(slp_expdate,'DD-MM-YYYY') AS exp_date,
        TO_CHAR(slp_create_dt,'DD-MM-YYYY') AS tgl,
        slp_id,
        slp_create_by AS id_receiving
      FROM tbtr_slp
      WHERE slp_flag IS NULL
      ORDER BY slp_create_dt DESC
    ) a
  `;
  const result = await db.query(query);
  return result.rows;
}

export async function getKodeToko(): Promise<number> {
  const res = await db.query('SELECT PRS_KODEIGR FROM TBMASTER_PERUSAHAAN');
  return res.rows[0].prs_kodeigr;
}


export async function insertOTP(
  hashedOtp: string,
  createdBy: string,
) {


  const kodeToko = await getKodeToko()
  
  const query = `
  INSERT INTO TBTEMP_OTP (
      OTP_RECORDID, OTP_KODETOKO, OTP_CODE1, OTP_VALID,
      OTP_KETERANGAN, OTP_CREATE_BY, OTP_CREATE_DT
    ) VALUES (
      '1', :kodeToko, :hashedOtp, CURRENT_TIMESTAMP,
      'BYPASS EXP DATE', :createdBy, CURRENT_TIMESTAMP
    )
  `;

  await queryOracle(query, {
    kodeToko: { val: kodeToko, dir: OracleDB.BIND_IN },
    hashedOtp: { val: hashedOtp, dir: OracleDB.BIND_IN },
    createdBy: { val: createdBy, dir: OracleDB.BIND_IN },
  });
}
