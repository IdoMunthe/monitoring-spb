import { Router } from 'express';
import { getSPBHandler, handleDeleteSPB } from '../controllers/spbController';
import { handleApprovalLogin } from '../controllers/authController';
import { handlePrintSPBReport } from '../controllers/spbReportController';

const router = Router();

router.get('/spb', getSPBHandler);
// @ts-ignore
router.post('/approval', handleApprovalLogin);
// @ts-ignore
router.post('/cancel', handleDeleteSPB);
router.get('/report/spb', handlePrintSPBReport);

export default router;
