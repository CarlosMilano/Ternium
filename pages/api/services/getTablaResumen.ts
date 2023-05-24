import pool from '../dbConfig';

export async function getResumenData() {
  const client = await pool.connect();

  try {
    const result = await client.query('SELECT * FROM resumen');
    return result.rows;
  } finally {
    client.release();
  }
}
