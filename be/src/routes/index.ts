import { Router } from 'express';
import { getSPBHandler, handleDeleteSPB } from '../controllers/spbController';
import { handleApprovalLogin } from '../controllers/authController';
import { handlePrintSPBReport } from '../controllers/spbReportController';
import { fetchSLPData, generateOtp } from '../controllers/slpController';
import { handlePrintSLPReport } from '../controllers/slpReportController';
import { fetchOptimalisasiData } from '../controllers/optimalisasiController';

const router = Router();

router.get('/spb', getSPBHandler);
// @ts-ignore
router.post('/approval', handleApprovalLogin);
// @ts-ignore
router.post('/cancel', handleDeleteSPB);
router.get('/report/spb', handlePrintSPBReport);

router.get('/slp', fetchSLPData);
router.get('/report/slp', handlePrintSLPReport);
// TODO: Run http://localhost:3001/api/otp on postman and look at the error.
// @ts-ignore
router.post('/otp', generateOtp);

router.get('/optimalisasi', fetchOptimalisasiData);

export default router;

































import oracledb from 'oracledb';

// @ts-ignore
async function testConnection(req, res) {
  try {
    const conn = await oracledb.getConnection({
      user: 'igrmktho',
      password: 'igrmktho',
      connectString: '172.20.28.24:1521/igrmktho',
    });
    console.log('✅ Connected!');
    res.json({message: "successfully conntected"})
    await conn.close();
  } catch (err) {
    console.error('❌ Connection failed:', err);
  }
}

router.get('/test', testConnection)
