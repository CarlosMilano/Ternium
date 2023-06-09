import { PoolClient, QueryResult } from "pg";
import pool from "../dbConfig";
import { TableComentarios } from "@/utils/types/dbTables";

export default async function getComentariosData(id_empleado: number): Promise<TableComentarios[]> {
    let client: PoolClient | null = null;
    try {
        client = (await pool.connect()) as PoolClient;

        const query: string = `
            SELECT * FROM comentarios
            WHERE id_empleado = ${id_empleado} 
            ORDER BY id_comentario
        `;

        const result: QueryResult = await client.query(query);
        const rows = result.rows as TableComentarios[];

        return rows;
    } catch (err) {
        throw new Error("Failed to retrieve data from comentarios.");
    } finally {
        if (client) {
            client.release();
        }
    }
}
