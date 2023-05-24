import pool from '../dbConfig';

export async function getExampleData() {
  const client = await pool.connect();

  try {
    const result = await client.query('SELECT * FROM empleado');
    return result.rows;
  } finally {
    client.release();
  }
}
