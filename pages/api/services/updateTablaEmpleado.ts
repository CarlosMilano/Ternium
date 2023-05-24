import pool from '../dbConfig';
import { QueryResult } from 'pg';

export async function updateTablaEmpleados(
  nombre: string | null,
  edad: number | null,
  antiguedad: number | null,
  universidad: string | null,
  area_manager: string | null,
  direccion: string | null,
  puesto: string | null,
  pc_cat: string | null,
  id_empleado: number
): Promise<QueryResult> {
  const client = await pool.connect();

  try {
    const updateQuery = `
      UPDATE empleado
      SET
        nombre = COALESCE($1, nombre),
        edad = COALESCE($2, edad),
        antiguedad = COALESCE($3, antiguedad),
        universidad = COALESCE($4, universidad),
        area_manager = COALESCE($5, area_manager),
        direccion = COALESCE($6, direccion),
        puesto = COALESCE($7, puesto),
        pc_cat = COALESCE($8, pc_cat)
      WHERE id_empleado = $9
    `;

    const values = [
      nombre,
      edad,
      antiguedad,
      universidad,
      area_manager,
      direccion,
      puesto,
      pc_cat,
      id_empleado,
    ];

    const result: QueryResult = await client.query(updateQuery, values);
    return result;
  } finally {
    client.release();
  }
}