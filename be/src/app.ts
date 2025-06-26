import express from 'express';
import cors from 'cors';
import router from './routes';
import * as dotenv from 'dotenv';
import oracledb from 'oracledb';

dotenv.config();

oracledb.initOracleClient({
  libDir: process.env.OCI_LIB_DIR,
});

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', router);

export default app;
