import mysql from 'mysql2/promise';
import { config } from '../config/config.js';
import { formatDate } from '../utils/dateFormatter.js';

const { database } = config;

const createPool = (dbConfig) => {
  const pool = mysql.createPool({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.name,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  const originalQuery = pool.query;
  pool.query = (sql, params) => {
    const date = new Date();
    console.log(
      `[${formatDate(date)}] Executing query: ${sql} ${
        params ? `, ${JSON.stringify(params)}` : ``
      }`,
    );
    return originalQuery.call(pool, sql, params);
  };

  return pool;
};

const pools = {
  USER_DB: createPool(database.USER_DB),
  GAME_DB: createPool(database.GAME_DB),
};

const getConnection = async () => {
  try {
    const conn = await pools.USER_DB.getConnection();
    return conn;
  } catch (err) {
    if (conn) {
      conn.rollback();
    }

    console.error(err);
    return null;
  } finally {
    if (conn) {
      await conn.release();
    }
  }
};

const transaction = async (queries) => {
  let conn = null;
  try {
    conn = await getConnection();
    await conn.beginTransaction();

    const result = await queries();

    await conn.commit();
    return result;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export default pools;
