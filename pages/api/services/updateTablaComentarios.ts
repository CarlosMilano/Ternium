import pool from '../dbConfig';
import { QueryResult } from 'pg';

export async function updateTablaComentarios(
  comentario: string | null,
  nota: number | null,
  promedio_notas: number | null,
  id_empleado: number
): Promise<QueryResult> {
  const client = await pool.connect();

  try {
    const updateQuery = `
      UPDATE comentarios
      SET
        nota = COALESCE($1, nota),
        promedio_notas = COALESCE($2, promedio_notas),
        comentario = COALESCE($3, comentario)
      WHERE id_empleado = $4
    `;

    const values = [
      comentario,
      nota,
      promedio_notas,
      id_empleado,
    ];

    const result: QueryResult = await client.query(updateQuery, values);
    return result;
  } finally {
    client.release();
  }
}