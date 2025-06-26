import crypto from 'crypto';

export default function md5Hash(value: string): string {
  return crypto.createHash('md5').update(value).digest('hex');
}

// const otpHash = getMD5Hash(
//   getMD5Hash(day) + getMD5Hash(month) + getMD5Hash(year) + getMD5Hash(code),
// );
