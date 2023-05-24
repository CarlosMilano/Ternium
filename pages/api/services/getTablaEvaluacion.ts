import { PoolClient, QueryResult } from "pg";
import pool from "../dbConfig";
import { TableEvaluacion } from "@/utils/types/dbTables";

export default async function getEvaluacionData(): Promise<TableEvaluacion[]> {
    let client: PoolClient | null = null;
    try {
        client = (await pool.connect()) as PoolClient;

        const result: QueryResult = await client.query("SELECT * FROM evaluacion");
        return result.rows as TableEvaluacion[];
    } catch (err) {
        throw new Error("Failed to retrieve data from evaluacion.");
    } finally {
        if (client) {
            client.release();
        }
    }
}
