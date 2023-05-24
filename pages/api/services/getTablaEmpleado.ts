import { PoolClient, QueryResult } from "pg";
import pool from "../dbConfig";
import { TableEmpleado } from "@/utils/types/dbTables";

export default async function getEmpleadoData(idEmpleado: string): Promise<TableEmpleado | null> {
    let client: PoolClient | null = null;
    try {
        client = (await pool.connect()) as PoolClient;

        const query: string = `
            SELECT * FROM empleado
            WHERE id_empleado = ${idEmpleado}
            LIMIT 1
        `;

        const result: QueryResult = await client.query(query);
        const rows = result.rows as TableEmpleado[];

        // Returns found user, or user without data.
        return rows.length > 0 ? rows[0] : null;
    } catch (err) {
        throw new Error("Failed to retrieve data from empleado.");
    } finally {
        if (client) {
            client.release();
        }
    }
}
