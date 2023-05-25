import { PoolClient, QueryResult } from "pg";
import pool from "../dbConfig";
import { TableEmpleado } from "@/utils/types/dbTables";

export default async function getEmpleados(): Promise<TableEmpleado[]> {
    let client: PoolClient | null = null;
    try {
        client = (await pool.connect()) as PoolClient;
        const query: string = `SELECT * FROM empleado`;

        const result: QueryResult = await client.query(query);
        const rows = result.rows as TableEmpleado[];
        return rows;
    } catch (err) {
        throw new Error("Failed to retrieve data from table empleado.");
    } finally {
        if (client) {
            client.release();
        }
    }
}
