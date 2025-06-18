import { Pool } from 'pg';

export const db = new Pool({
  user: 'simckl',
  host: '192.168.249.193',
  database: 'simckl',
  password: 'simckl',
  port: 5432,
});
