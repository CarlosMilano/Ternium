import pool from "../dbConfig";
import { QueryResult } from "pg";

export async function deleteComentario(id_empleado: number, id_comentario: number): Promise<QueryResult> {
    const client = await pool.connect();

    try {
        const updateQuery = `
            DELETE FROM comentarios
            WHERE id_empleado = $1 AND id_comentario = $2
        `;

        const result: QueryResult = await client.query(updateQuery, [id_empleado, id_comentario]);
        return result;
    } finally {
        client.release();
    }
}
