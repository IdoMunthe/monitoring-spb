import { Router } from 'express';
import { getSPBHandler } from '../controllers/spb';


const router = Router();

router.get('/spb', getSPBHandler)

export default router;
