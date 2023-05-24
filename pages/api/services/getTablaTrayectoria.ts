import pool from '../dbConfig';

export async function getTrayectoriaData() {
  const client = await pool.connect();

  try {
    const result = await client.query('SELECT * FROM trayectoria');
    return result.rows;
  } finally {
    client.release();
  }
}
