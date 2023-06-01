import pool from "../dbConfig";
import { QueryResult } from "pg";

export async function updateEmpleadoHabilitado(id_empleado: number, habilitado: boolean | null): Promise<QueryResult> {
    const client = await pool.connect();

    try {
        const updateQuery = `
            UPDATE empleado
            SET habilitado = COALESCE($1, habilitado)
            WHERE id_empleado = $2
        `;

        const result: QueryResult = await client.query(updateQuery, [habilitado, id_empleado]);
        return result;
    } finally {
        client.release();
    }
}
