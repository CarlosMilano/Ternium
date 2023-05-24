import pool from '../dbConfig';
import { QueryResult } from 'pg';

export async function updateTablaResumen(
  resumen_perfil: string | null,
  id_empleado: number
): Promise<QueryResult> {
  const client = await pool.connect();

  try {
    const updateQuery = `
      UPDATE resumen
      SET
      resumen_perfil = COALESCE($1, resumen_perfil),
      WHERE id_empleado = $2
    `;

    const values = [
      resumen_perfil,
      id_empleado,
    ];

    const result: QueryResult = await client.query(updateQuery, values);
    return result;
  } finally {
    client.release();
  }
}