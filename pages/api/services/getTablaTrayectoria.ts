import { PoolClient, QueryResult } from "pg";
import pool from "../dbConfig";
import { TableTrayectoria } from "@/utils/types/dbTables";

export default async function getTrayectoriaData(): Promise<TableTrayectoria[]> {
    let client: PoolClient | null = null;
    try {
        client = (await pool.connect()) as PoolClient;

        const result: QueryResult = await client.query("SELECT * FROM trayectoria");
        return result.rows as TableTrayectoria[];
    } catch (err) {
        throw new Error("Failed to retrieve data from trayectoria.");
    } finally {
        if (client) {
            client.release();
        }
    }
}
