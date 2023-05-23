import pool from '../dbConfig';

export async function getComentariosData() {
  const client = await pool.connect();

  try {
    const result = await client.query('SELECT * FROM comentarios');
    return result.rows;
  } finally {
    client.release();
  }
}
