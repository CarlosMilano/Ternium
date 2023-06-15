import pool from "../dbConfig";
import { QueryResult } from "pg";

export async function updateTablaEmpleados(
    nombre: string | null,
    edad: number | null,
    antiguedad: number | null,
    universidad: string | null,
    area_manager: string | null,
    direccion: string | null,
    puesto: string | null,
    pc_cat: string | null,
    habilitado: boolean | null,
    id_empleado: number,
    estructura3: string | null,
    estructura4: string | null,
    estructura5: string | null,
    key_talent: boolean | null,
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
        pc_cat = COALESCE($8, pc_cat),
        habilitado = COALESCE($9, habilitado),
        estructura3 = COALESCE($10, estructura3),
        estructura4 = COALESCE($11, estructura4),
        estructura5 = COALESCE($12, estructura5),
        key_talent = COALESCE($13, key_talent)
      WHERE id_empleado = $14
    `;

        const values = [nombre, edad, antiguedad, universidad, area_manager, direccion, puesto, pc_cat, habilitado, estructura3, estructura4,estructura5,key_talent, id_empleado];

        const result: QueryResult = await client.query(updateQuery, values);
        return result;
    } finally {
        client.release();
    }
}
