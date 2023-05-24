import pool from '../dbConfig';

export async function getEvaluacionData() {
  const client = await pool.connect();

  try {
    const result = await client.query('SELECT * FROM evaluacion');
    return result.rows;
  } finally {
    client.release();
  }
}
