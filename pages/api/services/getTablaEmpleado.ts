import { PoolClient, QueryResult } from "pg";
import pool from "../dbConfig";
import { TableEmpleado } from "@/utils/types/dbTables";

export default async function getEmpleadoData(): Promise<TableEmpleado[]> {
    let client: PoolClient | null = null;
    try {
        client = (await pool.connect()) as PoolClient;

        const result: QueryResult = await client.query("SELECT * FROM empleado");
        return result.rows as TableEmpleado[];
    } catch (err) {
        throw new Error("Failed to retrieve data from empleado.");
    } finally {
        if (client) {
            client.release();
        }
    }
}
