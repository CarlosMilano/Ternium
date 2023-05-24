import { PoolClient, QueryResult } from "pg";
import pool from "../dbConfig";
import { TableResumen } from "@/utils/types/dbTables";

export default async function getResumenData(): Promise<TableResumen[]> {
    let client: PoolClient | null = null;
    try {
        client = (await pool.connect()) as PoolClient;

        const result: QueryResult = await client.query("SELECT * FROM resumen");
        return result.rows as TableResumen[];
    } catch (err) {
        throw new Error("Failed to retrieve data from resumen.");
    } finally {
        if (client) {
            client.release();
        }
    }
}
