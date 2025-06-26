import { Pool } from 'pg';

export const db = new Pool({
  user: 'simckl',
  host: '192.168.249.193',
  database: 'simckl',
  password: 'simckl',
  port: 5432,
});

import oracledb from 'oracledb';

export const getOracleConnection = async () => {
  return await oracledb.getConnection({
    user: 'igrmktho',
    password: 'igrmktho',
    connectString: '172.20.28.24:1521/igrmktho',
  });
};
