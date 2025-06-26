import oracledb from 'oracledb';

export const queryOracle = async (sql: string, params: any = {}) => {
  const connection = await oracledb.getConnection({
    user: 'igrmktho',
    password: 'igrmktho',
    connectString: '172.20.28.24:1521/igrmktho', 
  });

  try {
    const result = await connection.execute(sql, params, { autoCommit: true });
    return result;
  } finally {
    await connection.close();
  }
};
