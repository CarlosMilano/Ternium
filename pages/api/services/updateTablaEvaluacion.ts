import pool from '../dbConfig';
import { QueryResult } from 'pg';

export async function updateTablaEvaluacion(
  curva: string | null,
  año: number | null,
  performance: number | null,
  potencial: number | null,
  id_empleado: number
): Promise<QueryResult> {
  const client = await pool.connect();

  try {
    const updateQuery = `
      UPDATE evaluacion
      SET
        año = COALESCE($1, año),
        performance = COALESCE($2, performance),
        potencial = COALESCE($3, potencial),
        curva = COALESCE($4, curva)
      WHERE id_empleado = $5
    `;

    const values = [
      curva,
      año,
      performance,
      potencial,
      id_empleado,
    ];

    const result: QueryResult = await client.query(updateQuery, values);
    return result;
  } finally {
    client.release();
  }
}