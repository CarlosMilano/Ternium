import pool from "../dbConfig";
import { QueryResult } from "pg";

export async function deleteEmpleado(id_empleado: number): Promise<QueryResult> {
    const client = await pool.connect();

    try {
        const updateQuery = `
            DELETE FROM empleado
            WHERE id_empleado = $1
        `;

        const result: QueryResult = await client.query(updateQuery, [id_empleado]);
        return result;
    } finally {
        client.release();
    }
}
