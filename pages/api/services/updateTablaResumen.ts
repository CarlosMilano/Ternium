import pool from "../dbConfig";
import { QueryResult } from "pg";

export async function updateTablaResumen(
    id_resumen: number,
    resumen_perfil: string | null,
    id_empleado: number
): Promise<QueryResult> {
    const client = await pool.connect();

    try {
        const updateQuery = `
            UPDATE resumen
            SET
                resumen_perfil = COALESCE($1, resumen_perfil)
            WHERE id_empleado = $2 AND id_resumen = $3
        `;

        const result: QueryResult = await client.query(updateQuery, [resumen_perfil, id_empleado, id_resumen]);
        return result;
    } finally {
        client.release();
    }
}
