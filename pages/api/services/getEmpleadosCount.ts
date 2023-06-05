import { PoolClient, QueryResult } from "pg";
import pool from "../dbConfig";
import { TableEmpleado } from "@/utils/types/dbTables";

export default async function getEmpleados(): Promise<number | null> {
    let client: PoolClient | null = null;
    try {
        client = (await pool.connect()) as PoolClient;
        const query: string = `
            SELECT * 
            FROM empleado 
            ORDER BY id_empleado DESC 
            LIMIT 1
        `;

        const result: QueryResult = await client.query(query);
        const rows = result.rows as TableEmpleado[];

        return rows.length > 0 ? rows[0].id_empleado : null;
    } catch (err) {
        throw new Error("Failed to retrieve data from table empleado.");
    } finally {
        if (client) {
            client.release();
        }
    }
}
