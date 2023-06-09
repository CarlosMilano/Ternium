import { PoolClient, QueryResult } from "pg";
import pool from "../dbConfig";
import { TableResumen } from "@/utils/types/dbTables";

export default async function getResumenData(id_empleado: number): Promise<TableResumen[]> {
    let client: PoolClient | null = null;
    try {
        client = (await pool.connect()) as PoolClient;

        const query: string = `
            SELECT * FROM resumen
            WHERE id_empleado = ${id_empleado} 
            ORDER BY id_resumen
        `;

        const result: QueryResult = await client.query(query);
        const rows = result.rows as TableResumen[];

        return rows;
    } catch (err) {
        throw new Error("Failed to retrieve data from resumen.");
    } finally {
        if (client) {
            client.release();
        }
    }
}
