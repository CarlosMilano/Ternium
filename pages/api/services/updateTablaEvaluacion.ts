import pool from "../dbConfig";
import { QueryResult } from "pg";

export async function updateTablaEvaluacion(
    id_evaluacion: number,
    curva: string | null,
    año: number | null,
    performance: number | null,
    potencial: string | null,
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
        WHERE id_empleado = $5 AND id_evaluacion = $6
        `;

        const result: QueryResult = await client.query(updateQuery, [
            año,
            performance,
            potencial,
            curva,
            id_empleado,
            id_evaluacion,
        ]);
        return result;
    } finally {
        client.release();
    }
}
