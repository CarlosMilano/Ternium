import { PoolClient, QueryResult } from "pg";
import pool from "../dbConfig";
import { TableEmpleado } from "@/utils/types/dbTables";

export default async function getPageEmpleados(page: number, pageSize: number): Promise<TableEmpleado[]> {
    let client: PoolClient | null = null;
    try {
        client = (await pool.connect()) as PoolClient;
        const lastFetchedId: number = pageSize * (page - 1);
        const query: string = `
            SELECT * 
            FROM empleado 
            WHERE id_empleado > ${lastFetchedId}
            ORDER BY id_empleado
            LIMIT ${pageSize}
        `;

        const result: QueryResult = await client.query(query);
        const rows = result.rows as TableEmpleado[];
        return rows;
    } catch (err) {
        throw new Error("Failed to retrieve paginated data from table empleado.");
    } finally {
        if (client) {
            client.release();
        }
    }
}
