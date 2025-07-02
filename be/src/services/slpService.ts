import {
  getKodeToko,
  getSLPListFromDB,
  insertOTP,
  SLPRecord,
} from '../models/slpModel';
import md5Hash from '../utils/otpHashing';

export async function getSLPList() {
  return await getSLPListFromDB();
}

export async function createOtp(rawCode: string, user: string) {
  const now = new Date();
  const tgl = now.getDate().toString().padStart(2, '0');
  const bln = (now.getMonth() + 1).toString().padStart(2, '0');
  const thn = now.getFullYear().toString();

  const combined = md5Hash(
    md5Hash(String(tgl)) +
      md5Hash(String(bln)) +
      md5Hash(String(thn)) +
      md5Hash(String(rawCode)),
  );

  console.log(combined);

  const kodeToko = await getKodeToko();

  await insertOTP(combined, user);
  return { message: 'OTP Created', data: { combined, kodeToko, user } };
}
