import { PoolClient, QueryResult } from "pg";
import pool from "../dbConfig";
import { TableComentarios } from "@/utils/types/dbTables";

export default async function getComentariosData(): Promise<TableComentarios[]> {
    let client: PoolClient | null = null;
    try {
        client = (await pool.connect()) as PoolClient;

        const result: QueryResult = await client.query("SELECT * FROM comentarios");
        return result.rows as TableComentarios[];
    } catch (err) {
        throw new Error("Failed to retrieve data from comentarios.");
    } finally {
        if (client) {
            client.release();
        }
    }
}
