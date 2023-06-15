import pool from "../dbConfig";
import { QueryResult } from "pg";

export async function addComentario(id_empleado: number, nota: number, comentario: string): Promise<number> {
    const client = await pool.connect();

    try {
        const insertQuery = `
            INSERT INTO comentarios (id_empleado, nota, comentario)
            VALUES ($1, $2, $3) RETURNING id_comentario;
        `;

        const result: QueryResult = await client.query(insertQuery, [id_empleado, nota, comentario]);
        const rows = result.rows;
        console.log(rows);
        const id_comentario: number = rows[0].id_comentario;
        return id_comentario;
    } catch (err) {
        throw new Error(`Failed to insert a new comment: ${err}`);
    } finally {
        client.release();
    }
}
